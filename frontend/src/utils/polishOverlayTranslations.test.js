import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const overlayFiles = [
  new URL('../../../polish_translation/pl-runtime.js', import.meta.url),
  new URL('../../public/local-overrides/pl-runtime.js', import.meta.url),
];

const requiredChoreDetailTranslations = [
  ['Trivial', 'Trywialna'],
  ['Unknown', 'Nieznana'],
  ['Recurrence', 'Powtarzanie'],
  ['fortnightly', 'co dwa tygodnie'],
  ['monthly', 'co miesiąc'],
];

const requiredRewardTranslations = [
  ['Selected icon', 'Wybrana ikona'],
];

const requiredAvatarThemeTranslations = [
  ['Featured style packs', 'Polecane zestawy stylu'],
  ['Edit avatar', 'Edytuj awatar'],
  ['Neon Pop Idol', 'Neonowa gwiazda pop'],
  ['Shadow Hunter', 'Łowca cieni'],
  ['Sweet Kitty', 'Słodki kotek'],
  ['Midnight Mischief', 'Nocny psotnik'],
  ['Idol Waves', 'Fale idolki'],
  ['Spirit Blade', 'Duchowe ostrze'],
  ['Kitty Bow Ears', 'Kocie uszy z kokardką'],
  ['Mischief Hood', 'Psotny kaptur'],
];

const requiredSpecialThemeTranslations = [
  ['Easter', 'Wielkanoc'],
  ['Christmas', 'Boże Narodzenie'],
  ['Birthday', 'Urodziny'],
  ['Halloween', 'Halloween'],
  ["April Fools' Day", 'Prima Aprilis'],
  ['Wet Monday', 'Śmigus Dyngus'],
  ['Summer Vacation', 'Wakacje'],
  ['Spring petals, painted eggs and bunny decorations', 'Wiosenne płatki, pisanki i królicze ozdoby'],
  ['Falling snow, warm lights and festive greenery', 'Padający śnieg, ciepłe lampki i świąteczne gałązki'],
  ['Confetti, balloons and a birthday cake', 'Konfetti, balony i urodzinowy tort'],
  ['Pumpkins, friendly ghosts and flying bats', 'Dynie, przyjazne duszki i latające nietoperze'],
  ['Colourful streamers and playful decorations', 'Kolorowe serpentyny i psotne dekoracje'],
  ['Droplets, splashes and water play', 'Krople, rozbryzgi i wodna zabawa'],
  ['Sunshine, palms and a beach atmosphere', 'Słońce, palmy i plażowa atmosfera'],
];

test('polish overlay translates chore detail metadata', () => {
  for (const fileUrl of overlayFiles) {
    const source = fs.readFileSync(fileUrl, 'utf8');
    const translations = new Map(
      [...source.matchAll(/^\s*'([^']+)': '([^']*)',/gm)].map((match) => [
        match[1],
        match[2],
      ]),
    );

    for (const [english, polish] of requiredChoreDetailTranslations) {
      assert.equal(
        translations.get(english),
        polish,
        `${fileUrl.pathname} maps ${english} incorrectly`,
      );
    }
  }
});

test('polish overlay translates reward emoji picker text', () => {
  for (const fileUrl of overlayFiles) {
    const source = fs.readFileSync(fileUrl, 'utf8');
    const translations = new Map(
      [...source.matchAll(/^\s*'([^']+)': '([^']*)',/gm)].map((match) => [
        match[1],
        match[2],
      ]),
    );

    for (const [english, polish] of requiredRewardTranslations) {
      assert.equal(
        translations.get(english),
        polish,
        `${fileUrl.pathname} maps ${english} incorrectly`,
      );
    }
  }
});

test('polish overlay keeps textarea placeholders translatable', () => {
  for (const fileUrl of overlayFiles) {
    const source = fs.readFileSync(fileUrl, 'utf8');

    assert.match(
      source,
      /SKIP_TEXT_TAGS[\s\S]*TEXTAREA/,
      `${fileUrl.pathname} should only skip textarea text content`,
    );
    assert.doesNotMatch(
      source,
      /SKIP_TAGS\.has\(element\.tagName\)/,
      `${fileUrl.pathname} should not skip textarea attributes`,
    );
  }
});

test('polish overlay translates themed avatar collections', () => {
  for (const fileUrl of overlayFiles) {
    const source = fs.readFileSync(fileUrl, 'utf8');
    const translations = new Map(
      [...source.matchAll(/^\s*'([^']+)': '([^']*)',/gm)].map((match) => [
        match[1],
        match[2],
      ]),
    );

    for (const [english, polish] of requiredAvatarThemeTranslations) {
      assert.equal(
        translations.get(english),
        polish,
        `${fileUrl.pathname} maps ${english} incorrectly`,
      );
    }
  }
});

test('polish overlay translates every family special theme', () => {
  for (const fileUrl of overlayFiles) {
    const source = fs.readFileSync(fileUrl, 'utf8');

    for (const [english, polish] of requiredSpecialThemeTranslations) {
      const escapedEnglish = english.replaceAll("'", "\\'");
      assert.equal(
        source.includes(`'${escapedEnglish}': '${polish}',`),
        true,
        `${fileUrl.pathname} maps ${english} incorrectly`,
      );
    }
  }
});
