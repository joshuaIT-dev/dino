<?php
// syllabus_api.php
// Backend for the Syllabus Scan feature. Called by the front-end via fetch().
// Two actions:
//   { action: "scan",     text: "...", subject: "..." }
//   { action: "generate", topic: "...", subject: "...", count: 4 }
//
// The Groq API key never reaches the browser — it lives only in config.php
// on this server.

header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', '0'); // don't leak PHP errors into the JSON response

$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Server is missing config.php.']);
    exit;
}
$config = require $configPath;
$GROQ_API_KEY = $config['groq_api_key'] ?? '';
$MODEL = $config['model'] ?? 'llama-3.3-70b-versatile';

function fail($msg, $code = 400) {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg]);
    exit;
}

// ADD THIS ↓↓↓
function extractCourseOutline($text) {
    $startPatterns = [
        '/COURSE\s+OUTLINE/i',
        '/E\.\s*COURSE\s+OUTLINE/i',
    ];
    $endPatterns = [
        '/COURSE\s+REQUIREMENTS/i',
        '/F\.\s*COURSE\s+REQUIREMENTS/i',
        '/ASSESSMENT\s+AND\s+RUBRICS/i',
        '/GRADING\s+SYSTEM/i',
    ];

    $start = null;
    foreach ($startPatterns as $p) {
        if (preg_match($p, $text, $m, PREG_OFFSET_CAPTURE)) {
            $start = $m[0][1];
            break;
        }
    }
    if ($start === null) return $text;

    $end = strlen($text);
    foreach ($endPatterns as $p) {
        if (preg_match($p, $text, $m, PREG_OFFSET_CAPTURE, $start)) {
            $end = min($end, $m[0][1]);
        }
    }

    $slice = substr($text, $start, $end - $start);
    return trim($slice) !== '' ? $slice : $text;
}
// ADD THIS ↑↑↑

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail('This endpoint only accepts POST requests.', 405);
}

$raw = file_get_contents('php://input');
$body = json_decode($raw, true);
if (!$body || !isset($body['action'])) {
    fail('Missing or invalid request body.');
}

if (empty($GROQ_API_KEY) || $GROQ_API_KEY === 'YOUR_GROQ_API_KEY_HERE') {
    fail('Server is not configured with a Groq API key yet. Edit config.php.', 500);
}

/**
 * Calls the Groq chat completions endpoint.
 * Returns [content, null] on success or [null, errorMessage] on failure.
 */
function callGroq($messages, $apiKey, $model, $retriesLeft = 1) {
    $payload = [
        'model' => $model,
        'messages' => $messages,
        'temperature' => 0.3,
        'response_format' => ['type' => 'json_object'],
    ];

    $ch = curl_init('https://api.groq.com/openai/v1/chat/completions');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $apiKey,
        ],
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_TIMEOUT => 45,
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr = curl_error($ch);
    curl_close($ch);

    if ($curlErr) {
        return [null, 'Could not reach Groq: ' . $curlErr];
    }

    if ($httpCode === 429 && $retriesLeft > 0) {
        $decoded = json_decode($response, true);
        $msg = $decoded['error']['message'] ?? '';
        // Parse "try again in 2.4975s" out of the message; default to 3s if not found
        $waitSeconds = 3.0;
        if (preg_match('/try again in ([\d.]+)s/', $msg, $m)) {
            $waitSeconds = (float)$m[1] + 0.3; // small buffer
        }
        usleep((int)($waitSeconds * 1000000));
        return callGroq($messages, $apiKey, $model, $retriesLeft - 1);
    }

    if ($httpCode < 200 || $httpCode >= 300) {
        $decoded = json_decode($response, true);
        $apiMsg = $decoded['error']['message'] ?? $response;
        return [null, 'Groq API error (HTTP ' . $httpCode . '): ' . $apiMsg];
    }
    $decoded = json_decode($response, true);
    $content = $decoded['choices'][0]['message']['content'] ?? null;
    if (!$content) {
        return [null, 'Groq returned an empty response.'];
    }
    return [$content, null];
}

$action = $body['action'];

/* ============ SCAN: extract topics from real syllabus text ============ */
if ($action === 'scan') {
    $text = trim($body['text'] ?? '');
    $subject = trim($body['subject'] ?? 'General');

    if (strlen($text) < 20) {
        fail('That text is too short to scan — paste more of the syllabus.');
    }

    $text = extractCourseOutline($text);

    // Defensive trim for very long documents / model context limits.
    if (strlen($text) > 24000) {
        $text = substr($text, 0, 24000);
    }

    $messages = [
        [
            'role' => 'system',
            'content' =>
                "You extract a clean topic list from a student's syllabus for the subject \"{$subject}\". " .
                "Respond ONLY with valid JSON in this exact shape: " .
                '{"topics":[{"name":"...","summary":"..."}]}' . ' ' .
                "Use between 4 and 14 topics. Each name is a short noun phrase, 6 words or fewer, no numbering, no duplicates. " .
                "Base every topic strictly on content that actually appears in the text below — never invent topics that aren't there.",
        ],
        ['role' => 'user', 'content' => $text],
    ];

    [$content, $err] = callGroq($messages, $GROQ_API_KEY, $MODEL);
    if ($err) fail($err, 502);

    $parsed = json_decode($content, true);
    if (!$parsed || !isset($parsed['topics']) || !is_array($parsed['topics'])) {
        fail('Could not understand the AI response — try scanning again.', 502);
    }

    $topics = [];
    $lowerText = strtolower($text);
    foreach ($parsed['topics'] as $t) {
        $name = trim($t['name'] ?? '');
        if ($name === '') continue;
        // Real mention count from the actual document, not a guess.
        $count = substr_count($lowerText, strtolower($name));
        $topics[] = [
            'name' => $name,
            'summary' => trim($t['summary'] ?? ''),
            'count' => max(1, $count),
        ];
    }
    if (empty($topics)) {
        fail('No topics were detected in this document. Try a more detailed syllabus.', 502);
    }

    echo json_encode(['ok' => true, 'topics' => $topics]);
    exit;
}

/* ============ GENERATE: MCQ practice questions for one confirmed topic ============ */
if ($action === 'generate') {
    $topic = trim($body['topic'] ?? '');
    $subject = trim($body['subject'] ?? 'General');
    $count = intval($body['count'] ?? 4);
    $count = max(1, min(10, $count));

    if ($topic === '') fail('Missing topic.');

    $messages = [
        [
            'role' => 'system',
            'content' =>
                "You write short, exam-style MULTIPLE CHOICE practice questions for a student studying {$subject}. " .
                "Respond ONLY with valid JSON in this exact shape: " .
                '{"questions":[{"question":"...","answer":"...","choices":["...","...","...","..."]}]}' . ' ' .
                "Write exactly {$count} distinct questions about the topic the user gives you. " .
                "Each question under 30 words. Each item MUST have exactly 4 choices, all different, " .
                "and 'answer' MUST be an exact string match to one of the 4 choices. " .
                "Do not label choices with letters. No extra text outside the JSON.",
        ],
        ['role' => 'user', 'content' => "Topic: {$topic}"],
    ];

    [$content, $err] = callGroq($messages, $GROQ_API_KEY, $MODEL);
    if ($err) fail($err, 502);

    $parsed = json_decode($content, true);
    if (!$parsed || !isset($parsed['questions']) || !is_array($parsed['questions'])) {
        fail('Could not understand the AI response — try again.', 502);
    }

    $questions = [];
    foreach ($parsed['questions'] as $q) {
        $question = trim($q['question'] ?? '');
        $answer = trim($q['answer'] ?? '');
        $choices = array_values(array_filter(array_map('trim', $q['choices'] ?? [])));

        if ($question === '' || $answer === '' || count($choices) < 2) continue;
        // enforce the answer is actually one of the choices
        if (!in_array($answer, $choices, true)) {
            $choices[] = $answer; // repair rather than silently dropping the question
        }
        // de-dupe choices just in case the model repeats one
        $choices = array_values(array_unique($choices));

        $questions[] = [
            'question' => $question,
            'answer' => $answer,
            'choices' => $choices,
        ];
    }

    if (empty($questions)) {
        fail('No valid questions were generated for this topic.', 502);
    }

    echo json_encode(['ok' => true, 'topic' => $topic, 'questions' => $questions]);
    exit;
}

fail('Unknown action.');