# Studio Bohatera — ilustracyjny renderer postaci v3

**Data:** 2026-07-21  
**Status:** zatwierdzony projekt, oczekuje na przegląd zapisanej specyfikacji

## Cel

Zastąpić prosty, portretowy renderer avatara pełnopostaciową, modułową ilustracją chibi o jakości zbliżonej do zaakceptowanej makiety Studio Bohatera. Nowy renderer ma wyglądać jak element dopracowanego kreatora postaci z gry, a nie jak zestaw podstawowych figur SVG.

Zmiana dotyczy grafiki postaci i sposobu jej kadrowania. Zachowuje istniejący edytor, katalog elementów, blokady, zapisane konfiguracje, historię zmian, losowanie, pupile oraz API.

## Zatwierdzone decyzje

- Renderer pozostaje modułowy i wektorowy; nie używa gotowych renderów całych kombinacji.
- Główna scena pokazuje pełną postać.
- Kafelki wariantów i avatary w pozostałej aplikacji pokazują portretowe kadrowanie tej samej kompozycji.
- Jeden zestaw warstw jest źródłem prawdy dla wszystkich rozmiarów i kadrów.
- Obecne identyfikatory części oraz format `avatar_config` pozostają zgodne wstecznie.
- Wszystkie istniejące rodziny elementów pozostają dostępne; redesign nie może ograniczyć katalogu do kilku pokazowych wariantów.
- Po przejściu weryfikacji produkcyjny build frontendu zostanie opublikowany do `static/`.

## Kryteria sukcesu

- Na scenie widoczna jest kompletna postać: głowa, szyja, tułów, ręce i dłonie, nogi, skarpety lub nogawki oraz buty.
- Postać ma czytelną, dziecięcą sylwetkę chibi, spójny kontur, cel-shading, miękkie gradienty i detale materiałów.
- Włosy mają rozpoznawalne pasma, objętość, cień i refleks; twarz ma czytelne oczy, brwi, nos, usta, policzki i subtelne modelowanie.
- Sylwetka pozostaje czytelna dla jasnych i ciemnych wariantów skóry, włosów, stroju oraz tła.
- Zmiana dowolnego elementu daje ten sam rezultat na scenie, w kafelku i w kompaktowym avatarze, z różnicą wyłącznie w kadrowaniu i poziomie efektów.
- Wszystkie dotychczasowe identyfikatory renderują zamierzony wariant albo udokumentowany bezpieczny fallback.
- Kreator zachowuje płynność przy siatce wielu miniatur i nie powoduje zauważalnych skoków układu.
- Zrzuty z działającej aplikacji przy 1440 × 900 i 390 × 844 spełniają wizualny pasek jakości opisany w tym dokumencie.
- `static/` zawiera ten sam zweryfikowany build, który został oceniony wizualnie.

## Kierunek artystyczny

### Proporcje i poza

- Bazowa postać ma około 3,25–3,75 wysokości głowy.
- Głowa jest duża i ekspresyjna, ale ciało pozostaje pełnopostaciowe oraz czytelne.
- Domyślna poza jest lekko asymetryczna: ciężar ciała spoczywa na jednej nodze, jedna ręka może opierać się o biodro, druga pozostaje swobodna.
- Dłonie i buty są większe niż realistyczne, zgodnie ze stylistyką przyjaznej gry rodzinnej.
- Poszczególne sylwetki `slim`, `regular` i `broad` zmieniają szerokość tułowia, ramion oraz ustawienie kończyn bez zmiany punktów mocowania głowy i wyposażenia.

### Język ilustracji

- Zewnętrzny kontur: ciemny, kolorystycznie powiązany z daną powierzchnią, z optycznie stałą grubością.
- Wewnętrzne detale: cieńsze linie o mniejszym kontraście niż obrys sylwetki.
- Światło: z góry i lekko z lewej; każda główna powierzchnia ma highlight, kolor bazowy i cień.
- Cienie kontaktowe: pod włosami, pod brodą, przy rękawach, między nogami i nad podeszwą.
- Materiały mają własny charakter: skóra jest miękka, włosy bardziej błyszczące, tkanina matowa, metal i klejnoty mają ostrzejszy refleks.
- Styl pozostaje oryginalny dla ChoreQuest. Makieta jest wzorcem jakości, kompozycji i nastroju, a nie źródłem kopiowanych elementów marki lub postaci.

### Twarz

- Oczy otrzymują białko, tęczówkę, źrenicę, minimum dwa refleksy, górną linię rzęs i delikatny cień.
- Brwi są osobną warstwą ekspresji i reagują na wariant oczu.
- Nos jest dyskretnym kształtem z cieniem, nie pojedynczą linią techniczną.
- Policzki mają subtelne ocieplenie zależne od koloru skóry.
- Warianty ust zachowują swoje znaczenie, ale otrzymują wypełnienie, cień i detale zębów lub języka tam, gdzie są potrzebne.

### Włosy i nakrycia głowy

- Każda fryzura ma tylną i przednią część, jeśli wymaga tego długość albo objętość.
- Fryzury używają wspólnych punktów dopasowania do głowy, lecz zachowują charakterystyczną sylwetkę każdego istniejącego identyfikatora.
- Nakrycia głowy opierają się na jednym kontrakcie linii czaszki i mogą zasłaniać odpowiednią część włosów bez widocznych kolizji.
- Refleks włosów jest kierunkowy i dopasowany do kształtu pasm, a nie nałożony jako przypadkowy gradient.

### Strój i kończyny

- Bazowy strój jest współczesny, przyjazny i neutralny: bluza lub kurtka, krótkie albo długie spodnie zależnie od wariantu oraz sportowe buty.
- Kolor `body_color` steruje dominującym kolorem stroju, a system automatycznie wylicza jaśniejsze i ciemniejsze odcienie.
- Wzory stroju są przycinane maską do powierzchni ubrania i nie wychodzą poza szwy.
- Ręce, nogi i buty nie są dekoracją tła — należą do wspólnej anatomii i zmieniają się proporcjonalnie z sylwetką.

## Płótno i kontrakt geometrii

Renderer używa jednego wewnętrznego układu współrzędnych o orientacji pionowej, docelowo `0 0 240 320`. Dokładne krzywe mogą zostać skorygowane w implementacji, ale punkty kotwiczenia mają pozostać stabilne.

### Główne kotwice

- środek głowy: około `(120, 82)`;
- linia szyi: około `y=132`;
- barki: około `y=145`;
- środek tułowia: około `(120, 188)`;
- linia dłoni: około `y=215`;
- linia kolan: około `y=246`;
- podeszwy: około `y=292`;
- punkty pupila: mapowane z istniejącej przestrzeni `32 × 32` do wspólnego płótna przez czysty helper transformacji.

### Kadry

- `full`: całe płótno z zapasem na wysokie fryzury, nakrycia głowy, skrzydła i pupila;
- `portrait`: głowa, włosy, nakrycie głowy, twarz, barki i górna część stroju;
- `icon`: ciaśniejszy portret optymalizowany dla rozmiarów 24–64 px.

Kadrowanie jest deklaratywną właściwością renderera. Nie powiela grafiki, konfiguracji ani logiki doboru części. Elementy wychodzące poza standardowy kadr, takie jak wysokie uszy lub korona, mogą dostarczyć metadane bezpiecznego marginesu.

## Stos warstw

Docelowa kolejność malowania:

1. definicje gradientów, masek, klipów i filtrów;
2. tło oraz dekoracyjne światło dla trybu scenicznego;
3. cień kontaktowy i tylne efekty;
4. tylna część pupila oraz tylne akcesoria postaci;
5. tylna część włosów;
6. nogi, skarpety lub nogawki i buty;
7. tułów, wzór stroju, ramiona oraz dłonie;
8. szyja i uszy;
9. głowa oraz modelowanie skóry;
10. dodatki twarzy, oczy, brwi, nos i usta;
11. przednia część włosów;
12. nakrycie głowy;
13. przednie akcesoria i wyposażenie;
14. pupil, jego akcesoria i efekty poziomu;
15. rim light, drobne refleksy i efekty reakcji.

Warstwy dekoracyjne mogą być wyłączane w `portrait` i `icon`. Warstwy istotne dla tożsamości postaci nie mogą znikać wyłącznie ze względów wydajnościowych.

## Architektura komponentów

### Publiczny komponent

`AvatarDisplay` pozostaje publicznym punktem wejścia. Otrzymuje co najmniej:

- `config` — istniejąca konfiguracja;
- `size` — istniejące rozmiary nazwane albo wartość liczbowa;
- `crop` — `full`, `portrait` lub `icon`;
- `animate` — istniejące sterowanie animacją.

Domyślne kadrowanie wynika z rozmiaru w sposób zgodny wstecznie: `studio` używa `full`, `option` używa `portrait`, a małe rozmiary używają `icon`. Wywołujący może jawnie nadpisać kadr. W `full` wartość `size` oznacza wysokość, a szerokość wynika z proporcji płótna; w `portrait` i `icon` komponent zachowuje kwadratowy rozmiar. Pełna postać nie jest przycinana kołem ani klasą `overflow-hidden`. Okrągłe tło i przycięcie pozostają wyłącznie w portretach i ikonach.

`AvatarDisplay` renderuje postać i jej własne cienie modelujące. `AvatarStage` pozostaje jedynym właścicielem podium, reflektora, scenicznej poświaty i reakcji tła, dzięki czemu profile oraz kafelki nie dziedziczą ciężkich efektów sceny.

### Wewnętrzny renderer

Nowa implementacja powinna oddzielić:

- normalizację i fallback konfiguracji;
- paletę i definicje farb;
- geometrię bazowej anatomii;
- rejestry części;
- kompozycję warstw;
- kadrowanie;
- efekty sceniczne i ruch.

Preferowany podział to katalog `components/avatar-illustration/` zawierający małe, testowalne moduły. `AvatarDisplay.jsx` nie powinien ponownie stać się monolitycznym plikiem zawierającym całą grafikę.

### Rejestry części

Każda rodzina udostępnia mapę identyfikatorów na komponenty oraz opcjonalne metadane:

- `heads` — geometria głowy i korekty kotwic twarzy;
- `hair` — warstwa tylna, przednia i margines kadru;
- `eyes`, `mouths`, `faceExtras` — ekspresja twarzy;
- `bodies` — anatomia tułowia i kończyn;
- `outfits` — ubranie oraz maska wzoru;
- `hats` — nakrycia głowy i reguły zasłaniania włosów;
- `accessories` — położenie z przodu lub z tyłu;
- `pets` — pełniejsze ilustracje oraz istniejący rozwój poziomów.

Nieznany identyfikator używa stabilnego wariantu domyślnego. `none` renderuje brak części bez błędu.

## Zakres katalogu i zgodność

Implementacja obejmuje cały katalog istniejący na dzień specyfikacji, w tym:

- 9 kształtów głowy;
- 21 fryzur;
- 15 wariantów oczu;
- 14 wariantów ust;
- 3 sylwetki;
- 17 nakryć głowy;
- 10 akcesoriów postaci;
- 10 dodatków twarzy;
- 10 wzorów stroju;
- 6 typów pupila oraz stan `none`;
- 6 akcesoriów pupila oraz stan `none`;
- istniejące palety kolorów i specjalne zestawy tematyczne.

Ostateczna liczba jest weryfikowana testem względem katalogu, aby nowe lub wcześniej pominięte identyfikatory nie renderowały się jako puste elementy.

Format danych nie otrzymuje nowego obowiązkowego pola. Wersja konfiguracji `_v` nie zmienia się tylko z powodu wymiany renderera. Zapisane kolory, tablica `accessories`, pozycja pupila, XP pupila oraz wartości starszych pól nadal są interpretowane.

## Kolor i farby

- Każdy edytowalny kolor pozostaje dokładnym kolorem bazowym wybranym przez użytkownika.
- Helper palety wylicza highlight, półton, cień, głęboki cień oraz kolor konturu.
- Mieszanie kolorów musi zachowywać czytelność bardzo jasnych, bardzo ciemnych i nasyconych wariantów.
- Gradienty otrzymują unikalne identyfikatory przez `useId`, aby wiele avatarów na jednej stronie nie dzieliło definicji SVG.
- W `icon` liczba gradientów i filtrów może być ograniczona, ale barwa bazowa i rozpoznawalność elementu muszą pozostać zgodne.
- Efekty nie mogą opierać się wyłącznie na filtrach SVG; kluczowe cienie i refleksy są częścią geometrii, co poprawia stabilność w przeglądarkach mobilnych.

## Scena i animacja

Duża scena zachowuje ciemny charakter Studio Bohatera, ale wzmacnia prezentację postaci przez:

- owalne podium;
- skupione światło za sylwetką;
- miękki cień pod stopami;
- subtelny rim light wokół krawędzi;
- krótką reakcję świetlną po zmianie wariantu.

Animacje mają małą amplitudę i nie przesuwają punktów interakcji:

- powolny oddech tułowia;
- naturalne mrugnięcie;
- minimalny wtórny ruch włosów lub dodatków;
- delikatna reakcja wybranego elementu;
- istniejący ruch pupila.

`prefers-reduced-motion: reduce` usuwa ruch dekoracyjny i pozostawia stabilną, końcową klatkę. Tryb ustawiania pupila wyłącza transformacje, które mogłyby rozjechać współrzędne celownika.

## Miniatury i użycie poza edytorem

- Kafelek opcji nadpisuje dokładnie jeden wybierany element w konfiguracji pochodnej.
- Kategorie `head`, `skin`, `hair`, `eyes`, `mouth`, `hat` i `face` używają `portrait`.
- Kategorie `body`, `outfit`, `pattern`, `background`, `accessory` i `pet` używają `full`, ponieważ ich różnice mogą występować poniżej ramion lub poza sylwetką głowy.
- Profile i listy używają `icon`, bez podium i efektów scenicznych.
- Duże profile mogą użyć `portrait`.
- Miniatury zachowują stan blokady, zaznaczenia i podglądu bez zmiany logiki uprawnień.
- Etykieta tekstowa nadal towarzyszy grafice; rozpoznawanie opcji nie opiera się wyłącznie na kolorze lub obrazie.

## Wydajność

- Rejestry części i dane statyczne są definiowane poza renderem komponentu.
- Normalizacja konfiguracji i paleta są memoizowane na stabilnych zależnościach.
- `AvatarDisplay` nie wykonuje odczytów układu ani zapisu stanu podczas renderowania.
- Filtry sceniczne są wyłączone lub upraszczane w `option` i małych rozmiarach.
- Animacje używają głównie `transform` i `opacity`.
- Kafelki nie tworzą osobnych rasteryzowanych kopii i nie pobierają z sieci dodatkowych obrazów.
- Pomiar w przeglądarce obejmuje długą siatkę fryzur i nakryć głowy na widoku mobilnym oraz desktopowym.

## Dostępność

- `AvatarDisplay` zachowuje rolę obrazu i otrzymuje lokalizowalny opis.
- Dekoracyjne warstwy nie trafiają do drzewa dostępności.
- Tryb kadru nie zmienia nazwy semantycznej postaci.
- Karty pozostają prawdziwymi przyciskami z czytelnym stanem `aria-pressed`, blokadą i etykietą.
- Kontrast konturów, twarzy i elementów sterujących jest sprawdzany dla skrajnych palet.
- Ograniczenie ruchu jest respektowane zarówno przez UI edytora, jak i postać.

## Błędy i stany brzegowe

- Nieznany lub brakujący identyfikator części korzysta z domyślnego wariantu danej rodziny.
- Brak całej konfiguracji nadal pokazuje inicjały użytkownika zgodnie z istniejącym zachowaniem.
- Brak opcjonalnych metadanych kadru używa standardowego marginesu.
- Długie włosy, wysokie nakrycia głowy, skrzydła, miecz i pupil nie mogą zostać przypadkowo ucięte w `full`.
- W `portrait` dopuszczalne jest zamierzone ucięcie elementów poniżej ramion; tożsamościowe elementy przy głowie muszą pozostać widoczne.
- Wiele akcesoriów zachowuje deterministyczną kolejność i nie zasłania oczu ani podstawowych kontrolek.
- Gdy przeglądarka ogranicza filtry SVG, postać pozostaje kompletna dzięki geometrycznym cieniom i konturom.

## Strategia implementacji

Prace są prowadzone etapami, ale funkcja jest publikowana dopiero po osiągnięciu spójności całego katalogu:

1. kontrakt płótna, kadrów, kotwic, palety i stosu warstw;
2. bazowa anatomia pełnej postaci oraz scena;
3. reprezentatywny pionowy wycinek: kilka głów, fryzur, twarzy, sylwetek, strój, nakrycie, akcesorium i pupil;
4. porównanie wizualne z zaakceptowanym kierunkiem;
5. przeniesienie wszystkich pozostałych identyfikatorów;
6. integracja kadrów z kartami i pozostałymi miejscami aplikacji;
7. animacje, redukcja ruchu i optymalizacja;
8. pełna weryfikacja automatyczna i wizualna;
9. produkcyjny build oraz publikacja do `static/`.

Pionowy wycinek służy do wykrycia błędów stylu i architektury. Nie jest uznawany za ukończoną funkcję ani publikowany jako częściowe zastępstwo katalogu.

## Testy automatyczne

### Kontrakt renderera

- każdy identyfikator z katalogu ma zarejestrowany renderer;
- `none` jest obsługiwane jawnie;
- nieznany identyfikator wybiera poprawny fallback;
- `full`, `portrait` i `icon` korzystają z jednego modelu oraz poprawnych viewBoxów;
- definicje SVG mają unikalne identyfikatory między instancjami;
- kolejność grup warstw pozostaje zgodna z kontraktem;
- konfiguracja wejściowa nie jest mutowana.

### Zgodność

- starsza konfiguracja bez nowych opcjonalnych danych renderuje się bez wyjątku;
- wszystkie historyczne identyfikatory pozostają obecne;
- kolory bazowe są zachowane w wyliczonej palecie;
- tablica wielu akcesoriów i starsze pole pojedynczego akcesorium zachowują dotychczasowe zasady;
- XP, poziom, pozycja i akcesorium pupila nie zmieniają semantyki.

### UI i zachowanie

- scena jawnie używa pełnej postaci;
- kafelki używają portretu, z wyjątkami dla kategorii wymagających pełnej sylwetki;
- podgląd zablokowanego elementu nadal aktualizuje dużą postać;
- tryb ustawiania pupila zachowuje mapowanie współrzędnych;
- `prefers-reduced-motion` wyłącza nowe animacje;
- istniejące testy edytora, uprawnień i zapisu pozostają zielone.

## Weryfikacja wizualna

Obowiązkowe zrzuty z działającej aplikacji:

- desktop 1440 × 900: domyślna pełna postać oraz otwarta kategoria włosów;
- desktop: długa fryzura, wysokie nakrycie głowy, kilka akcesoriów i pupil;
- mobile 390 × 844: scena, poziomy rail i siatka opcji;
- ciemna skóra z ciemnymi włosami na ciemnym tle;
- jasna skóra, jasne włosy i jasny strój;
- każda z trzech sylwetek;
- co najmniej jeden zrzut wszystkich 21 fryzur i wszystkich 17 nakryć głowy w siatce;
- `portrait` i `icon` obok odpowiadającej im pełnej postaci;
- stan zablokowany, zaznaczony oraz podgląd tymczasowy;
- tryb ustawiania pupila.

### Wizualny pasek jakości

Przed publikacją należy odpowiedzieć „tak” na wszystkie pytania:

- Czy postać jest wyraźnie pełnopostaciowa i zajmuje większość wysokości sceny?
- Czy twarz, włosy, dłonie, ubranie i buty zawierają świadome detale, a nie tylko bazowe figury?
- Czy światło i cienie opisują objętość zamiast służyć jako przypadkowa dekoracja?
- Czy wszystkie warianty wyglądają jak części jednego zestawu ilustracji?
- Czy kadr portretowy wygląda jak ten sam bohater, a nie osobny uproszczony avatar?
- Czy żadna kategoria nie wraca wizualnie do poprzedniego, płaskiego stylu?
- Czy faktyczny ekran aplikacji jest zbliżony poziomem dopracowania do zaakceptowanej makiety?

Jeżeli którakolwiek odpowiedź brzmi „nie”, etap wizualny nie jest ukończony.

## Build i publikacja

- Weryfikowany jest produkcyjny build Vite.
- Po akceptacji zrzutów wykonywany jest proces publikacji, który czyści `static/` i kopiuje aktualną zawartość `frontend/dist/`.
- `static/index.html` oraz nazwy zahashowanych assetów są porównywane z `frontend/dist/`.
- Aplikacja uruchomiona przez FastAPI jest sprawdzana ponownie, aby potwierdzić, że serwuje nowy renderer, a nie starszy bundle.
- Zmiany w `static/` są częścią tego samego zakresu i nie mogą zostać pominięte przy przygotowaniu PR-a.

## Poza zakresem

- grafika 3D i obracanie postaci;
- gotowe rendery każdej kombinacji;
- zmiana API, systemu uprawnień, XP albo ekonomii sklepu;
- nowe płatne elementy katalogu;
- kopiowanie postaci, ikon lub znaków rozpoznawczych z The Sims albo innej gry;
- osobny kreator pozy lub animacji.

## Warunek ukończenia

Praca jest ukończona dopiero wtedy, gdy cały katalog korzysta z nowego języka ilustracji, testy są zielone, widoki desktop i mobile przechodzą kontrolę wizualną, a zweryfikowany build jest faktycznie obecny w `static/`. Sama makieta, pojedyncza grafika referencyjna albo częściowo przerysowana postać nie spełnia celu.
