/* ══════════════════════════════════════════════════════════════════════════
   dino-icons.js · EMOJI → LUCIDE
   Load LAST, after lucide and after every game script.

   The game stores emoji as data (powerup icons, status icons, stage icons).
   This file never touches that data — it swaps the glyph at the moment it is
   already rendered into the DOM, and only inside a fixed list of containers
   that hold nothing but an icon. Game logic, save files and comparisons all
   keep seeing the original emoji.

   Safety net: after lucide renders, any placeholder that did not resolve to
   an <svg> puts its original emoji back. A wrong or renamed icon name can
   therefore never leave an empty box on screen.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── the map. lucide.dev names. ─────────────────────────────────────── */
  var MAP = {
    /* combat */
    '⚡': 'zap',            '🔥': 'flame',        '❄': 'snowflake',
    '☠': 'skull',          '💀': 'skull',        '🛡': 'shield',
    '⚔': 'swords',         '🗡': 'sword',        '💥': 'zap',
    '🩸': 'droplet',       '💉': 'syringe',      '💣': 'bomb',
    '💢': 'zap',           '😤': 'angry',        '👁': 'eye',
    '🧱': 'brick-wall',    '🪨': 'hexagon',      '🪞': 'copy',
    '💨': 'wind',          '🌀': 'tornado',      '🌪': 'tornado',
    '🩹': 'bandage',       '💚': 'heart',        '❤': 'heart',
    '💗': 'heart',         '🌟': 'sparkles',     '💫': 'sparkle',
    '✦': 'sparkle',        '🔮': 'orbit',        '🎲': 'dices',

    /* items + meta */
    '🍖': 'ham',           '⏳': 'hourglass',    '⏱': 'timer',
    '🔒': 'lock',          '🎯': 'target',       '🏋': 'dumbbell',
    '💡': 'lightbulb',     '📍': 'map-pin',      '🗺': 'map',
    '📖': 'book-open',     '📚': 'library',      '📄': 'file-text',
    '✒': 'pen-tool',       '📐': 'ruler',        '🎮': 'gamepad-2',

    /* world + scenery */
    '🌿': 'leaf',          '🌵': 'tree-pine',    '🌊': 'waves',
    '🌑': 'moon',          '☀': 'sun',           '🏔': 'mountain',
    '🕳': 'circle',        '🌌': 'sparkles',     '🐢': 'turtle',

    /* progress */
    '🏆': 'trophy',        '🏅': 'award',        '👑': 'crown',
    '🥇': 'medal',         '🥈': 'medal',        '🥉': 'medal',
    '🎉': 'party-popper',  '🎓': 'graduation-cap',

    /* subjects */
    '🧬': 'dna',           '🔬': 'microscope',   '⚗': 'flask-conical',
    '🏛': 'landmark',      '💻': 'laptop',       '📊': 'trending-up',
    '📅': 'calendar',      '🗓': 'calendar-days',

    /* marks */
    '✓': 'check',          '✔': 'check',
    '✕': 'x',              '✗': 'x',             '✖': 'x',
    '⚠': 'triangle-alert',

    /* ── stage icons · dino-world.js ─────────────────────────────────── */
    '🌋': 'mountain',      '🏜': 'tree-palm',    '🪦': 'cross',
    '🐙': 'shell',         '🛠': 'wrench',       '🔨': 'hammer',
    '🚨': 'siren',         '📎': 'paperclip',    '🌲': 'tree-pine',
    '⬜': 'square',

    /* ── the worlds past the margin · dino-world2.js + author.js ─────── */
    '🕯': 'lamp',          '⚖': 'scale',         '🕸': 'network',
    '🎺': 'megaphone',     '🔱': 'anchor',       '✴': 'sparkle',
    '🌫': 'cloud-fog',     '⚙': 'cog',           '📜': 'scroll',
    '🕰': 'clock',         '🔔': 'bell',         '🎼': 'music',
    '⛪': 'church',        '🔩': 'bolt',         '💾': 'save',
    '🐋': 'fish',          '🧊': 'box',          '🦀': 'bug',
    '☄': 'sparkle',        '🌅': 'sunrise',      '🪝': 'link',
    '🔊': 'volume-2',      '🧪': 'test-tube',    '🕊': 'bird',
    '✍': 'pen-line'
  };

  /* 🏔 and 🌋 would both land on "mountain", so the snowy one takes the
     snowy icon and the volcano keeps the plain peak. */
  MAP['🏔'] = 'mountain-snow';
  /* 🌵 is a cactus, not a pine — 🌲 has the pine and 🏜 has the palm. */
  MAP['🌵'] = 'sprout';

  /* Deliberately NOT mapped: 🦖 🦕 — the dinosaurs are the game's own
     artwork and a line-icon lizard would be a downgrade.
     Also not mapped: → and ← . Almost every one of those is inside question
     content ("4x² - 36 = 0 → x = ?") or prose, not UI chrome. */

  /* Lucide renamed a number of icons across versions and ships the old names
     only as deprecated aliases. Rather than pin a guess, each entry lists
     fallbacks tried in order; the first one this build of lucide actually
     has, wins. */
  var ALIAS = {
    'triangle-alert': ['alert-triangle'],
    'bolt':           ['wrench', 'settings'],
    'cog':            ['settings'],
    'brick-wall':     ['wall', 'grid-3x3'],
    'mountain-snow':  ['mountain'],
    'tree-palm':      ['palmtree', 'tree-pine'],
    'cloud-fog':      ['cloud'],
    'volume-2':       ['volume'],
    'test-tube':      ['flask-conical'],
    'pen-line':       ['pen', 'pencil'],
    'chart-column':   ['bar-chart-3', 'bar-chart'],
    'trending-up':    ['chart-line', 'activity'],
    'network':        ['share-2'],
    'lamp':           ['lightbulb'],
    'megaphone':      ['music'],
    'shell':          ['circle-dashed'],
    'sprout':         ['leaf'],
    'sparkle':        ['sparkles'],
    'ham':            ['beef', 'drumstick'],
    'bandage':        ['cross'],
    'party-popper':   ['sparkles'],
    'graduation-cap': ['school'],
    'flask-conical':  ['beaker'],
    'gamepad-2':      ['gamepad'],
    'calendar-days':  ['calendar'],
    'file-up':        ['file-text'],
    'orbit':          ['circle-dashed'],
    'hexagon':        ['octagon', 'circle'],
    'siren':          ['bell-ring', 'bell']
  };

  /* names this build of lucide really has, in kebab-case */
  var AVAILABLE = null;
  function buildAvailable() {
    var set = Object.create(null);
    var src = (window.lucide && (window.lucide.icons || window.lucide)) || {};
    for (var k in src) {
      if (!/^[A-Z]/.test(k)) continue;
      set[k.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
           .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
           .toLowerCase()] = 1;
    }
    return set;
  }

  /* the name to actually use for a glyph, or null to keep the emoji */
  var RESOLVED = Object.create(null);
  function resolve(glyph) {
    if (glyph in RESOLVED) return RESOLVED[glyph];
    var want = MAP[glyph];
    var out = null;
    if (want) {
      if (!AVAILABLE || !Object.keys(AVAILABLE).length) {
        out = want;                        // cannot introspect — trust the map
      } else {
        var chain = [want].concat(ALIAS[want] || []);
        for (var i = 0; i < chain.length; i++) {
          if (AVAILABLE[chain[i]]) { out = chain[i]; break; }
        }
      }
    }
    RESOLVED[glyph] = out;
    return out;
  }

  /* ── containers that hold an icon and nothing else ──────────────────── */
  var ZONES = [
    '.sicon', '.effect-icon', '.pu-icon', '.rs-icon', '.sn-icon',
    '.aw-icon', '.es-icon', '.ach-ic', '.ach-bar-ic', '.pug-icon',
    '.syl-dz-icon', '.syl-subj-icon', '.home-empty-icon', '.card-icon',
    '.qc-i', '.hq-icon', '.diff-icon', '.sd-cell .sd-gift', '.lb-pu',
    '.guardian-chip', '.freeze-overlay', '.paralyze-overlay',
    '.ig-world-chip .icon', '.ig-vs-emoji', '.soon-orb', '#practice-icon',
    '.slot-i', '.hpr-icon'
  ].join(',');

  /* one regex built from the map's keys, longest first */
  var GLYPHS = new RegExp(
    '(' + Object.keys(MAP)
      .sort(function (a, b) { return b.length - a.length; })
      .map(function (g) { return g.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); })
      .join('|') + ')\\uFE0F?',
    'g'
  );

  var DONE = 'dqIconed';

  function swapIn(root) {
    var zones = (root || document).querySelectorAll(ZONES);
    for (var i = 0; i < zones.length; i++) {
      var zone = zones[i];
      if (zone.dataset[DONE] === zone.textContent) continue;

      var walker = document.createTreeWalker(zone, NodeFilter.SHOW_TEXT, null);
      var texts = [];
      var n;
      while ((n = walker.nextNode())) {
        if (GLYPHS.test(n.nodeValue)) texts.push(n);
        GLYPHS.lastIndex = 0;
      }

      for (var t = 0; t < texts.length; t++) {
        var node = texts[t];
        var frag = document.createDocumentFragment();
        var last = 0;
        var m;
        GLYPHS.lastIndex = 0;
        while ((m = GLYPHS.exec(node.nodeValue))) {
          if (m.index > last) {
            frag.appendChild(
              document.createTextNode(node.nodeValue.slice(last, m.index))
            );
          }
          var name = resolve(m[1]);
          if (name) {
            var el = document.createElement('i');
            el.setAttribute('data-lucide', name);
            el.className = 'dq-ico';
            el.setAttribute('data-dq-fallback', m[1]);
            el.setAttribute('aria-hidden', 'true');
            frag.appendChild(el);
          } else {
            /* lucide has nothing for this glyph — keep the emoji as it was */
            var keep = document.createElement('span');
            keep.className = 'dq-emoji';
            keep.textContent = m[1];
            frag.appendChild(keep);
          }
          last = m.index + m[0].length;
        }
        if (last < node.nodeValue.length) {
          frag.appendChild(document.createTextNode(node.nodeValue.slice(last)));
        }
        node.parentNode.replaceChild(frag, node);
      }
      zone.dataset[DONE] = zone.textContent;
    }
  }

  /* Anything still an <i> after lucide ran is a name lucide does not know.
     Put the emoji back rather than leaving a hole. */
  function restoreMisses(root) {
    var left = (root || document).querySelectorAll('i.dq-ico[data-dq-fallback]');
    for (var i = 0; i < left.length; i++) {
      var el = left[i];
      var span = document.createElement('span');
      span.className = 'dq-emoji';
      span.textContent = el.getAttribute('data-dq-fallback');
      el.parentNode.replaceChild(span, el);
    }
  }

  function apply(root) {
    try {
      swapIn(root);
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.__dqNative.call(window.lucide);
      }
      restoreMisses(root);
    } catch (e) {
      /* never let a cosmetic pass break a battle */
      if (window.console) console.warn('[dino-icons]', e);
    }
  }

  /* ── hook the one chokepoint every render path already calls ────────── */
  function hook() {
    if (!window.lucide || typeof window.lucide.createIcons !== 'function') return false;
    if (window.lucide.__dqNative) return true;

    AVAILABLE = buildAvailable();
    window.lucide.__dqNative = window.lucide.createIcons;
    window.lucide.createIcons = function () {
      try { swapIn(document); } catch (e) {}
      var r = window.lucide.__dqNative.apply(window.lucide, arguments);
      try { restoreMisses(document); } catch (e) {}
      return r;
    };

    /* say plainly which glyphs could not be matched, so the map can be
       corrected rather than quietly degrading */
    if (window.console && Object.keys(AVAILABLE).length) {
      var unresolved = Object.keys(MAP).filter(function (g) { return !resolve(g); });
      if (unresolved.length) {
        console.info('[dino-icons] no lucide match, keeping emoji: ' + unresolved.join(' '));
      }
    }
    return true;
  }

  if (!hook()) {
    /* lucide is served from a CDN — give it a moment if it is slow */
    var tries = 0;
    var iv = setInterval(function () {
      if (hook() || ++tries > 40) {
        clearInterval(iv);
        if (window.lucide) window.lucide.createIcons();
      }
    }, 100);
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (window.lucide) window.lucide.createIcons();
  });
  if (document.readyState !== 'loading' && window.lucide) {
    window.lucide.createIcons();
  }

  window.DQIcons = { apply: apply, map: MAP, zones: ZONES, resolve: resolve, alias: ALIAS };
})();
