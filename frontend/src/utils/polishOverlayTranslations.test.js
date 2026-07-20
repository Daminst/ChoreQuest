import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const overlayFiles = [
  new URL('../../../polish_translation/pl-runtime.js', import.meta.url),
  new URL('../../public/local-overrides/pl-runtime.js', import.meta.url),
];
const petCustomizerFile = new URL('../components/avatar-editor/PetCustomizer.jsx', import.meta.url);

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

function loadTranslateClean(fileUrl) {
  const source = fs.readFileSync(fileUrl, 'utf8');
  const marker = '  function translateDialogMessage(message) {';
  assert.ok(source.includes(marker), `${fileUrl.pathname} exposes the expected translation seam`);

  const instrumentedSource = source.replace(
    marker,
    `  window.__translateCleanForTest = translateClean;\n\n${marker}`,
  );
  const window = {};
  const document = {
    readyState: 'loading',
    addEventListener() {},
  };

  vm.runInNewContext(instrumentedSource, { document, window }, { filename: fileUrl.pathname });
  return window.__translateCleanForTest;
}

function loadMutationObserverCallback(fileUrl) {
  const source = fs.readFileSync(fileUrl, 'utf8');
  let observerCallback;
  const pendingFrames = [];
  const root = {
    nodeType: 1,
    tagName: 'BODY',
    hasAttribute() { return false; },
  };
  const window = {
    alert() {},
    confirm() {},
    prompt() {},
  };
  const document = {
    readyState: 'complete',
    body: root,
    documentElement: root,
    createTreeWalker(walkRoot) {
      return {
        currentNode: walkRoot,
        nextNode() { return null; },
      };
    },
  };

  class MutationObserver {
    constructor(callback) {
      observerCallback = callback;
    }

    observe() {}
  }

  vm.runInNewContext(source, {
    document,
    window,
    MutationObserver,
    Node: { TEXT_NODE: 3, ELEMENT_NODE: 1, DOCUMENT_NODE: 9 },
    NodeFilter: { SHOW_ELEMENT: 1, SHOW_TEXT: 4, FILTER_ACCEPT: 1, FILTER_REJECT: 2 },
    requestAnimationFrame(callback) { pendingFrames.push(callback); },
  }, { filename: fileUrl.pathname });

  return { observerCallback, pendingFrames, root };
}

const requiredAvatarStudioTranslations = [
  ['Hero Studio', 'Studio Bohatera'],
  ['Randomise', 'Losuj'],
  ['Checking avatar unlocks...', 'Sprawdzanie odblokowanych elementów awatara...'],
  ['Unlock status unavailable. Randomise is disabled.', 'Nie udało się sprawdzić odblokowanych elementów. Losowanie jest wyłączone.'],
  ['Undo', 'Cofnij'],
  ['Unsaved changes', 'Niezapisane zmiany'],
  ['Your hero is ready', 'Twój bohater jest gotowy'],
  ['Discard changes?', 'Odrzucić zmiany?'],
  ['Your hero has unsaved changes. Leave without saving?', 'Twój bohater ma niezapisane zmiany. Wyjść bez zapisywania?'],
  ['Keep editing', 'Kontynuuj edycję'],
  ['Discard', 'Odrzuć'],
  ['Preview updates instantly', 'Podgląd aktualizuje się od razu'],
  ['Previewing a locked item', 'Podgląd zablokowanego elementu'],
  ['Appearance', 'Wygląd'],
  ['Colours', 'Kolory'],
  ['Accessory', 'Akcesorium'],
  ['Equipment', 'Ekwipunek'],
  ['Background', 'Tło'],
  ['Avatar categories', 'Kategorie awatara'],
  ['Live avatar preview', 'Podgląd awatara na żywo'],
  ['Pet customisation', 'Edycja pupila'],
  ['Multiple selection', 'Wybór wielokrotny'],
  ['Choose a head shape', 'Wybierz kształt głowy'],
  ['Start with the silhouette of your hero.', 'Zacznij od sylwetki swojego bohatera.'],
  ['Choose a skin tone', 'Wybierz odcień skóry'],
  ['Pick the tone that feels right.', 'Wybierz odpowiedni odcień.'],
  ['Style the hair', 'Ułóż włosy'],
  ['Choose a cut, then finish it with colour.', 'Wybierz fryzurę, a potem jej kolor.'],
  ['Choose the eyes', 'Wybierz oczy'],
  ['Give your hero their expression.', 'Nadaj bohaterowi charakter.'],
  ['Choose the smile', 'Wybierz uśmiech'],
  ['Finish the expression.', 'Dopełnij wyraz twarzy.'],
  ['Choose a build', 'Wybierz sylwetkę'],
  ['Set the hero silhouette.', 'Ustal sylwetkę bohatera.'],
  ['Choose outfit colour', 'Wybierz kolor stroju'],
  ['Set the main outfit colour.', 'Ustal główny kolor stroju.'],
  ['Choose a pattern', 'Wybierz wzór'],
  ['Add a final outfit detail.', 'Dodaj ostatni detal stroju.'],
  ['Choose a backdrop', 'Wybierz tło'],
  ['Frame your hero.', 'Nadaj bohaterowi oprawę.'],
  ['Choose headwear', 'Wybierz nakrycie głowy'],
  ['Add a signature finishing touch.', 'Dodaj charakterystyczne wykończenie.'],
  ['Choose face details', 'Wybierz detale twarzy'],
  ['Add freckles, paint, or stickers.', 'Dodaj piegi, malunek lub naklejki.'],
  ['Choose equipment', 'Wybierz ekwipunek'],
  ['Equip more than one item.', 'Możesz założyć więcej niż jeden przedmiot.'],
  ['Customise your companion', 'Dostosuj pupila'],
  ['Style and place your loyal companion.', 'Dostosuj wygląd i pozycję wiernego pupila.'],
  ['Back', 'Wstecz'],
  ['Saving...', 'Zapisywanie...'],
  ['Save', 'Zapisz'],
  ['Request failed', 'Żądanie nie powiodło się'],
  ['Tap to place your pet', 'Dotknij, aby ustawić pupila'],
  ['Position', 'Pozycja'],
  ['Locked', 'Zablokowane'],
  ['Find in quests', 'Znajdź w misjach'],
  ['Skin tone', 'Odcień skóry'],
  ['Hair colour', 'Kolor włosów'],
  ['Eye colour', 'Kolor oczu'],
  ['Mouth colour', 'Kolor ust'],
  ['Outfit colour', 'Kolor stroju'],
  ['Backdrop colour', 'Kolor tła'],
  ['Headwear colour', 'Kolor nakrycia głowy'],
  ['Equipment colour', 'Kolor ekwipunku'],
  ['Pet level progression', 'Postęp rozwoju pupila'],
  ['Eight pet levels', 'Osiem poziomów pupila'],
  ['Choose a companion to unlock colours, placement, and accessories.', 'Wybierz pupila, aby odblokować kolory, ustawienie i akcesoria.'],
  ['Reset all to match', 'Ujednolić wszystkie kolory'],
  ['Body', 'Sylwetka'],
  ['Body Colour', 'Kolor ciała'],
  ['Ears', 'Uszy'],
  ['Tail', 'Ogon'],
  ['Accent', 'Akcent'],
  ['Level', 'Poziom'],
  ['XP to Level', 'XP do poziomu'],
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

test('polish overlay translates Hero Studio controls', () => {
  for (const fileUrl of overlayFiles) {
    const source = fs.readFileSync(fileUrl, 'utf8');
    const translations = new Map(
      [...source.matchAll(/^\s*'([^']+)': '([^']*)',/gm)].map((match) => [
        match[1],
        match[2],
      ]),
    );

    for (const [english, polish] of requiredAvatarStudioTranslations) {
      assert.equal(
        translations.get(english),
        polish,
        `${fileUrl.pathname} maps ${english} incorrectly`,
      );
    }
  }
});

test('polish overlay translates dynamically added avatar labels before the next frame', () => {
  for (const fileUrl of overlayFiles) {
    const { observerCallback, pendingFrames, root } = loadMutationObserverCallback(fileUrl);
    const textNode = {
      nodeType: 3,
      nodeValue: 'Short',
      parentElement: { closest() { return null; } },
    };

    observerCallback([{ type: 'childList', target: root, addedNodes: [textNode] }]);

    assert.equal(textNode.nodeValue, 'Krótkie', `${fileUrl.pathname} translates an added label immediately`);
    assert.equal(pendingFrames.length, 0, `${fileUrl.pathname} does not defer an added label to a later frame`);
  }
});

test('polish overlay keeps avatar-specific Pet and Custom labels in the studio context', () => {
  for (const fileUrl of overlayFiles) {
    const { observerCallback, root } = loadMutationObserverCallback(fileUrl);
    const studioParent = {
      closest(selector) { return selector.includes('.avatar-editor-shell') ? {} : null; },
    };
    const petNode = { nodeType: 3, nodeValue: 'Pet', parentElement: studioParent };
    const customNode = { nodeType: 3, nodeValue: 'Custom', parentElement: studioParent };

    observerCallback([{ type: 'childList', target: root, addedNodes: [petNode, customNode] }]);

    assert.equal(petNode.nodeValue, 'Pupil');
    assert.equal(customNode.nodeValue, 'Własna');

    for (const [english, polish] of [['Pet', 'Pupil'], ['Custom', 'Własna']]) {
      const attributes = new Map([['aria-label', english]]);
      const element = {
        nodeType: 1,
        tagName: 'BUTTON',
        closest(selector) { return selector.includes('.avatar-editor-shell') ? {} : null; },
        hasAttribute(name) { return attributes.has(name); },
        getAttribute(name) { return attributes.get(name) ?? null; },
        setAttribute(name, value) { attributes.set(name, value); },
      };

      observerCallback([{ type: 'attributes', target: element }]);
      assert.equal(attributes.get('aria-label'), polish);
    }
  }
});

test('polish overlay translates composed Hero Studio aria labels at runtime', () => {
  const composedAriaTranslations = [
    ['Round, locked, 120 XP', 'Okrągła, opcja zablokowana, 120 XP'],
    ['Round, locked, Earn 120 XP', 'Okrągła, opcja zablokowana, Zdobądź 120 XP'],
    ['Round, locked, 12-day streak', 'Okrągła, opcja zablokowana, 12-dniowa seria'],
    ['Round, locked, Find in quests', 'Okrągła, opcja zablokowana, Znajdź w misjach'],
    ['Round, locked, Locked', 'Okrągła, opcja zablokowana'],
    ['Hair colour: #ff00aa', 'Kolor włosów: #ff00aa'],
    ['Body Colour: #ff00aa', 'Kolor ciała: #ff00aa'],
    ['73% to level 5', '73% do poziomu 5'],
  ];

  for (const fileUrl of overlayFiles) {
    const translateClean = loadTranslateClean(fileUrl);
    for (const [english, polish] of composedAriaTranslations) {
      assert.equal(
        translateClean(english),
        polish,
        `${fileUrl.pathname} translates ${english} at runtime`,
      );
    }
  }
});

test('pet customiser uses the context-specific body colour translation key', () => {
  const source = fs.readFileSync(petCustomizerFile, 'utf8');

  assert.match(
    source,
    /<AvatarColorPalette label="Body Colour" colors=\{PET_COLORS\}/,
  );
  assert.doesNotMatch(
    source,
    /<AvatarColorPalette label="Body" colors=\{PET_COLORS\}/,
  );
});
