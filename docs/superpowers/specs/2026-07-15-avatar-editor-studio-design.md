# Studio Bohatera — projekt redesignu edytora avatara

**Data:** 2026-07-15  
**Status:** zatwierdzony kierunek, oczekuje na przegląd zapisanej specyfikacji

## Cel

Przekształcić obecny edytor avatara z płaskiego formularza ustawień w efektowny, pełnoekranowy kreator postaci inspirowany modelem interakcji Create-a-Sim. Avatar ma być głównym elementem sceny, a wybór wyglądu ma odbywać się wizualnie przez miniatury. Redesign zachowuje wszystkie istniejące możliwości, format `avatar_config`, blokady przedmiotów, podgląd zablokowanych opcji, rozwój pupila oraz zapis przez obecne API.

Projekt nie kopiuje stylistyki ani elementów marki The Sims. Wykorzystuje jedynie znany model kreatora postaci: duży podgląd bohatera, ikonowe kategorie i wizualne warianty.

## Kryteria sukcesu

- Avatar jest wizualnym centrum ekranu i jest wyraźnie większy niż w obecnym edytorze.
- Każdy wariant wyglądu, dla którego wygląd ma znaczenie, jest prezentowany jako kodowa miniatura aktualnego avatara z zastosowaną zmianą.
- Użytkownik rozumie wybraną kategorię, wariant, kolor oraz stan blokady bez polegania wyłącznie na tekście.
- Desktop wykorzystuje całą dostępną przestrzeń; telefon zachowuje stale widoczny podgląd i wygodne pola dotykowe.
- Losowanie, cofanie, podgląd zablokowanych elementów, wielokrotny ekwipunek, pozycjonowanie pupila i zapis działają bez regresji.
- Interfejs jest spójny z ciemnym, turkusowym systemem ChoreQuest, ale wygląda jak dopracowany ekran gry.

## Zakres

### W zakresie

- pełny redesign układu i hierarchii edytora;
- ikonowy wybór 13 istniejących kategorii;
- wizualne karty wariantów i większe palety kolorów;
- sceniczny podgląd avatara;
- losowanie odblokowanych opcji;
- wielopoziomowe cofanie zmian z historią bieżącej sesji;
- ochrona przed utratą niezapisanych zmian;
- uporządkowanie panelu pupila;
- responsywność, dostępność i animacje interfejsu;
- testy nowych pomocników stanu i weryfikacja w przeglądarce.

### Poza zakresem

- nowe części avatara lub nowe grafiki samych części;
- zmiana formatu danych avatara lub endpointów backendu;
- obracanie postaci 3D;
- przebudowa sklepu z avatarami;
- zakup zablokowanego elementu bezpośrednio z edytora;
- zmiany systemu XP i poziomów pupila.

## Układ i kompozycja

### Desktop

Pełnoekranowa przestrzeń robocza składa się z:

1. **Górnego paska akcji** — powrót, tytuł „Studio Bohatera”, losowanie, cofnięcie i zapis. Zapis jest wizualnie nadrzędną akcją.
2. **Lewego paska kategorii** — pionowy rail o stałej szerokości, z ikoną i etykietą/podpowiedzią dla każdej kategorii. Aktywna kategoria ma turkusowy znacznik i wyraźny stan zaznaczenia.
3. **Centralnej sceny avatara** — elastyczny obszar z dużym, animowanym avatarem na subtelnie oświetlonym podeście. Scena używa ciemnych powierzchni, delikatnego radialnego światła i ograniczonego efektu głębi; nie zawiera dekoracyjnych kart ani zbędnych statystyk.
4. **Prawego panelu opcji** — panel o szerokości około 380–440 px z nazwą kategorii, krótką wskazówką, siatką wariantów oraz paletą kolorów. Panel ma własne przewijanie.

Docelowa proporcja pozwala centralnej scenie zająć największą część widoku. Avatar jest renderowany w rozmiarze około 240–320 px, zależnie od wysokości viewportu.

### Telefon

- Kompaktowy nagłówek zachowuje powrót, cofnięcie i zapis.
- Górna część ekranu jest stałą sceną avatara o wysokości około 260–320 px.
- Kategorie tworzą poziomy, przewijany pasek ikon pod sceną.
- Opcje wypełniają dolną, przewijaną część ekranu; nie są modalem zasłaniającym avatar.
- Minimalny obszar dotykowy kontrolek wynosi 44 × 44 px.
- Na bardzo niskich ekranach scena może zmniejszyć się, ale avatar i aktywna kategoria pozostają widoczne.

## System wizualny

- **Tło:** ciemny grafit zgodny z aktywnym motywem ChoreQuest.
- **Powierzchnie:** wyraźne poziomy głębi dla paska kategorii, sceny i panelu opcji.
- **Akcent:** aktywny kolor motywu, domyślnie turkusowy.
- **Typografia:** istniejący font systemowy; wyraźna skala dla tytułu, kategorii, etykiet i opisów kontrolek.
- **Promienie:** umiarkowane 8–12 px; brak nadmiernie zaokrąglonych, zagnieżdżonych kart.
- **Cienie i światło:** oszczędne, skoncentrowane wokół postaci i aktywnego wyboru.
- **Ikony:** spójny zestaw Lucide, 18–22 px, z jednakową grubością optyczną.
- **Ruch:** krótkie przejścia 140–220 ms dla paneli i stanów wyboru; animacje avatara pozostają bez zmian. `prefers-reduced-motion` wyłącza ruch dekoracyjny.

## Kategorie

Rail zachowuje wszystkie istniejące kategorie w tej kolejności:

1. Głowa
2. Skóra
3. Włosy
4. Oczy
5. Usta
6. Sylwetka
7. Strój
8. Wzór
9. Tło
10. Nakrycie głowy
11. Twarz
12. Ekwipunek
13. Pupil

Na desktopie etykiety mogą być stale widoczne przy wystarczającej szerokości lub dostępne jako tooltip. Na telefonie ikony mają krótkie etykiety pod spodem albo dostępne nazwy dla czytników ekranu.

## Karty wariantów

`AvatarOptionCard` prezentuje:

- miniaturę `AvatarDisplay` z aktualną konfiguracją i nadpisanym jednym wariantem;
- lokalną etykietę wariantu;
- stan wybrany, dostępny lub zablokowany;
- ikonę kłódki i zwięzłą informację o blokadzie, jeśli backend ją udostępnia.

Wybrana karta ma ramkę w kolorze akcentu, znacznik wyboru i subtelne podświetlenie. Zablokowana karta pozostaje czytelna, ale ma wyciszoną powierzchnię. Najechanie kursorem lub przytrzymanie palcem uruchamia istniejący tymczasowy podgląd zablokowanego elementu na głównej postaci; zwolnienie przywraca konfigurację sesji.

Miniatury są renderowane kodowo z istniejących komponentów SVG, a nie jako zapisane obrazy. Dla kolorów używana jest większa paleta próbek zamiast powielania wielu pełnych miniatur.

## Palety kolorów

- Próbki mają co najmniej 32 px na desktopie i 40 px na telefonie.
- Wybrany kolor ma podwójną obwódkę i ikonę zaznaczenia o odpowiednim kontraście.
- Każda próbka ma dostępną etykietę z wartością koloru.
- Palety zachowują istniejące zestawy dla skóry, włosów, oczu, ust, stroju, tła, nakryć głowy, ekwipunku i pupila.
- Reset kolorów pupila jest widoczną akcją drugorzędną.

## Scena avatara

`AvatarStage` odpowiada wyłącznie za:

- prezentację `displayConfig`, w tym tymczasowego podglądu;
- istniejące animacje bezczynności;
- podest i oświetlenie sceny;
- komunikat kontekstowy przy podglądzie zablokowanego elementu;
- tryb ustawiania niestandardowej pozycji pupila.

W trybie ustawiania pupila scena pokazuje celownik i jedno krótkie polecenie. Kliknięcie lub dotknięcie pozostaje oparte na istniejącym przeliczeniu współrzędnych SVG i ograniczeniu do bezpiecznego obszaru.

## Panel pupila

Panel pupila dzieli kontrolki na cztery lokalne sekcje:

- **Wygląd** — wybór pupila i widoczny poziom/XP;
- **Kolory** — ciało, uszy, ogon i akcent wraz z resetem;
- **Pozycja** — lewo, prawo, głowa i pozycja niestandardowa;
- **Akcesorium** — istniejące dodatki pupila.

Sekcje są prostym segmentowanym przełącznikiem w obrębie panelu opcji, nie osobnymi stronami. Brak wybranego pupila ukrywa pozostałe sekcje i pokazuje zwięzłą zachętę do wyboru.

## Akcje sesji

### Losuj

- Losuje wyłącznie elementy dostępne lub domyślne.
- Obejmuje podstawowe cechy postaci, kolory, tło oraz opcjonalnie pojedyncze dodatki.
- Nie zmienia typu, XP, pozycji ani szczegółowych kolorów aktualnego pupila, aby nie naruszać jego tożsamości.
- Całe losowanie stanowi jeden wpis historii cofania.

### Cofnij

- Edytor przechowuje ograniczoną historię konfiguracji bieżącej sesji, maksymalnie 30 wpisów.
- Każda świadoma zmiana użytkownika tworzy jeden wpis.
- Tymczasowy podgląd zablokowanego elementu nie trafia do historii.
- Przycisk jest wyłączony, gdy historia jest pusta.

### Zapisz

- Używa istniejącego `PUT /api/avatar` i wysyła bieżący `config`.
- W trakcie zapisu akcje powodujące kolejny zapis są zablokowane.
- Sukces pokazuje jednoznaczny stan „Zapisano” i wraca do poprzedniego widoku po krótkim czasie.
- Błąd pozostawia edytor otwarty, pokazuje komunikat obok akcji i pozwala ponowić zapis.

### Wyjście z niezapisanymi zmianami

- Stan „dirty” jest wyliczany przez porównanie konfiguracji sesji z ostatnio zapisaną konfiguracją użytkownika.
- Powrót, `Escape` i nawigacja przeglądarki pokazują potwierdzenie, gdy stan jest niezapisany.
- Po zapisie lub przy braku zmian wyjście następuje bez pytania.

## Architektura komponentów

Docelowy podział:

- `AvatarEditor` — pobieranie blokad, stan sesji, historia, zapis i kompozycja;
- `AvatarEditorToolbar` — powrót, tytuł, losowanie, cofnięcie i zapis;
- `AvatarCategoryRail` — responsywna nawigacja kategorii;
- `AvatarStage` — duży podgląd i tryb pozycjonowania pupila;
- `AvatarOptionsPanel` — nagłówek oraz zawartość aktywnej kategorii;
- `AvatarOptionGrid` / `AvatarOptionCard` — wizualne warianty;
- `AvatarColorPalette` — próbki kolorów;
- `PetCustomizer` — lokalne sekcje pupila;
- czyste pomocniki stanu dla historii, losowania i konfiguracji miniatur.

Komponenty mogą pozostać w jednym pliku podczas pierwszego refaktoru tylko wtedy, gdy `AvatarEditor.jsx` nie przekroczy obecnej złożoności. Preferowany jest katalog `components/avatar-editor/` dla elementów UI i osobny moduł pomocników.

## Przepływ danych

1. Edytor inicjalizuje konfigurację z `DEFAULT_CONFIG` i `user.avatar_config`.
2. Backend zwraca katalog elementów; edytor buduje mapę blokad według kategorii.
3. Zmiana opcji dopisuje poprzednią konfigurację do historii i aktualizuje `config`.
4. Tymczasowy podgląd buduje `displayConfig` bez zmiany `config` i historii.
5. Miniatury budują konfiguracje pochodne bez zapisu w stanie.
6. Zapis wysyła `config`, aktualizuje użytkownika i czyści stan „dirty” oraz historię sesji.

## Błędy i stany brzegowe

- Niepowodzenie pobierania blokad zachowuje obecne zachowanie: edytor działa bez lokalnego blokowania elementów.
- Nieznany identyfikator wariantu używa istniejącego fallbacku rendererów.
- Brak `avatar_config` rozpoczyna od `DEFAULT_CONFIG`.
- Bardzo długa lista wariantów przewija się wewnątrz panelu; scena i toolbar pozostają stabilne.
- Długa etykieta nie zwiększa wysokości kart w niekontrolowany sposób; maksymalnie dwie linie.
- Wąski viewport nie może powodować poziomego przepełnienia strony.

## Dostępność

- Wszystkie ikonowe akcje mają nazwy dostępne dla technologii asystujących.
- Karty wariantów są prawdziwymi przyciskami z `aria-pressed` lub równoważnym stanem.
- Aktywna kategoria jest komunikowana semantycznie.
- Focus jest wyraźny i nie polega wyłącznie na kolorze.
- Kontrast tekstu, kłódek i stanów wyłączonych spełnia WCAG AA tam, gdzie element pozostaje interaktywny.
- Pełny przepływ podstawowej edycji i zapisu działa klawiaturą.

## Testowanie i weryfikacja

### Testy automatyczne

- historia cofania: pojedyncza zmiana, wiele zmian, limit 30, brak wpisu dla podglądu;
- losowanie: używa tylko odblokowanych opcji i nie zmienia tożsamości pupila;
- detekcja niezapisanych zmian;
- budowanie konfiguracji miniatur bez mutowania bazowej konfiguracji;
- istniejące testy katalogu motywów avatara pozostają zielone;
- produkcyjny build frontendu przechodzi bez ostrzeżeń blokujących.

### Weryfikacja w przeglądarce

- desktop około 1440 × 900;
- telefon 390 × 844;
- aktywne kategorie i przewijanie długich siatek;
- wybór wariantu i koloru;
- podgląd zablokowanego elementu;
- losowanie i cofnięcie;
- wielokrotny ekwipunek;
- wybór, kolory, pozycja i akcesorium pupila;
- błąd zapisu i udany zapis;
- potwierdzenie przy wyjściu z niezapisanymi zmianami;
- nawigacja klawiaturą i `prefers-reduced-motion`.

### Wizualny pasek jakości

Końcowy render ma wyglądać jak spójny ekran gry, a nie panel administracyjny: scena dominuje, opcje są rozpoznawalne wizualnie, hierarchia jest jednoznaczna, desktop nie ma dużych martwych obszarów, a mobile nie wygląda jak upchnięta wersja desktopu.
