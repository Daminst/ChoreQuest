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

const requiredAvatarStudioTranslations = [
  ['Hero Studio', 'Studio Bohatera'],
  ['Randomise', 'Losuj'],
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
  ['Avatar categories', 'Kategorie avatara'],
  ['Live avatar preview', 'Podgląd avatara na żywo'],
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
  ['Reset all to match', 'Zresetuj wszystko do zgodności'],
  ['Body', 'Sylwetka'],
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
