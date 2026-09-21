<?php
// config.php
// Put your real Groq API key below. Keep this file OUT of any public git repo
// (add "config.php" to your .gitignore) — anyone who can read this file can
// use your key and run up your Groq usage.

return [
    'groq_api_key' => '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',
    // Any current Groq chat model works. llama-3.3-70b-versatile is a solid,
    // cheap default for this kind of text-extraction/generation task.
    'model' => 'openai/gpt-oss-20b',
];