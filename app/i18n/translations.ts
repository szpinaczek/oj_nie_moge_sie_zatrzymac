export type Language = "pl" | "en";

const translations = {
  pl: {
    title: "Oj! Nie mogę się zatrzymać - interaktywna mapa śladami filmu",
    map: "Mapa",
    time: "Czas",
    video: "Wideo",
    routeInfo: "Informacje o trasie",
    location: "Lokalizacja",
    coordinates: "Współrzędne",
    distance: "Odległość",
    actions: "Akcje",
    jumpTo: "Przejdź",
    noInfo: "Brak informacji",
    additionalInfo: "Dodatkowe informacje",
    loading: "Ładowanie",
    loadingMap: "Ładowanie mapy",
    resetView: "Resetuj widok",
    fullscreen: "Pełny ekran",
    exitFullscreen: "Wyjdź z pełnego ekranu",
    currentPosition: "Aktualna pozycja",
    learnMore: "Dowiedz się więcej",
    about: "O projekcie",
    aboutAuthors: "Współautorzy filmu",
    authors: "Współautorzy",
    authorDirector: "Scenariusz, zdjęcia i reżyseria",
    authorMusic: "Muzyka",
    authorSecondDirector: "Współpraca reżyserska",
    authorSecondOperator: "Współpraca operatorska",
    authorProducer: "Kierownictwo produkcji",
    authorSecondProducer: "Współpraca produkcyjna",
    authorSound: "Dźwięk",
    authorEditor: "Montaż",
    aboutMovie: "O filmie",
    aboutApp: `Było lato 1975 roku. Zajęci swoimi sprawami przechodnie, wędrujący pylistymi ulicami Łodzi, ze zdumieniem patrzyli na grupę długowłosych młodych ludzi, którzy dźwigając ciężkie, kilkunastokilogramowe kamery szli wytrwale przez ulice, place, ogrody i trawniki miasta. Znikali w bramach kamienic, aby wyłonić się z zupełnie innej bramy przy innej ulicy. Gdyby ciekawski przechodzień zechciał udać się za nimi, zapewne zdumiałby się widząc, że filmowcy wciągają ciężki sprzęt na dachy komórek, a nawet, nieraz wchodzą przez okna do prywatnych mieszkań. Trudno byłoby mu uwierzyć, że właśnie powstaje film animowany dla łódzkiego studia Se-Ma-For, znanego powszechnie z produkcji kreskówek dla dzieci.

    Jednak rzeczywiście powstawał film animowany, realizowany w technice poklatkowej, na bazie niezwykłego w tamtych czasach pomysłu, którego autorem był przyszły laureat Oscara, Zbigniew Rybczyński. Bohaterem filmu jest  - w sumie nie wiadomo kto - najpewniej potwór, bestia, która w ślimaczym tempie wypełza z lasu, pędzi coraz szybciej przez miasto, niszcząc wszystko na swej drodze. Wreszcie spotyka swój koniec, rozpryskując się na ścianie kamienicy. Film oglądany z dźwiękiem jest, co tu kryć, filmem grozy, choć nie brakuje w nim czarnego humoru. Oglądany bez dźwięku może być odbierany z mniejszą dozą emocji - jako majstersztyk planowania, pokaz reżyserskiego i operatorskiego kunsztu. Żeby zrealizowac swój ambitny plan, reżyser z ekipą musieli przebyć ponad 12 kilometrów przez miasto. Zrobiono to bardzo uczciwie, bez żadnych sktótów i ułatwiania sobie drogi. Dlatego można dokładnie prześledzić trasę naszych filmowców (i potwora) i dlatego powstał ten projekt - jako ciekawostka dla miłośników artystycznego kina vintage, a także dla tych, którzy chcieliby zobaczyć, jak wyglądała Łódź latem 1975 roku.

    Cała trasa jest zaznaczona na mapie, a mapa jest zsynchronizowana z filmem. Film można przewijać klatka po klatce za pomoca strzałek na klawiaturze. Przy niektórych klatkach wyświetli się okienko z informacjami o miejscu, które mijamy w naszej podróży.`,
    aboutFilm: "Film",
    aboutDirector: "Reżyser",
    filmDescription:
      "'Oj! Nie mogę się zatrzymać!' to eksperymentalny film animowany z 1975 roku, opowiadający historię potwora, który wypełza z lasu na przedmieściach i pędzi coraz szybciej przez miasto, niszcząc wszystko na swojej drodze. Wreszcie spotyka swój koniec, rozpryskując się na ścianie kamienicy.",
    filmYear: "Rok produkcji",
    filmDuration: "Czas trwania",
    filmTechnique: "Technika",
    filmTechniqueValue: "Animacja poklatkowa",
    filmAwards: "Nagrody",
    filmAwardsValue:
      "Grand Prix na Międzynarodowym Festiwalu Filmów Animowanych w Annecy (1976)",
    directorDescription:
      "Zbigniew Rybczyński to jeden z najważniejszych polskich reżyserów filmów animowanych. Jego innowacyjne podejście do technik animacji i narracji filmowej wywarło ogromny wpływ na rozwój światowej kinematografii.",
    directorBorn: "Rok urodzenia",
    directorEducation: "Edukacja",
    directorEducationValue:
      "Państwowa Wyższa Szkoła Filmowa, Telewizyjna i Teatralna w Łodzi",
    directorAchievements: "Osiągnięcia",
    directorAchievementsValue:
      "Oscar za film 'Tango' (1983), pionier w dziedzinie animacji komputerowej",
    directorLegacy: "Dziedzictwo",
    directorLegacyValue:
      "Jego innowacyjne techniki animacji i podejście do narracji filmowej wpłynęły na pokolenia twórców filmowych na całym świecie.",
    locationDescription:
      "Film został zrealizowany w Łodzi, mieście o bogatej tradycji filmowej i artystycznej. Studio Se-ma-for, gdzie powstał film, było jednym z najważniejszych ośrodków animacji w Polsce.",
    locationCity: "Miasto",
    locationCityValue: "Łódź",
    locationStudio: "Studio",
    locationStudioValue: "Studio Se-ma-for",
    locationSignificance: "Znaczenie",
    locationSignificanceValue:
      "Łódź była i jest ważnym ośrodkiem polskiej kinematografii, szczególnie w dziedzinie filmu animowanego.",
    locationToday: "Dziś",
    locationTodayValue:
      "Studio Se-ma-for zakończyło działalnośc w 2018 roku.",
  },
  en: {
    title: "Oh! I Can't Stop! - Interactive Map Following The Film's Footsteps",
    map: "Map",
    time: "Time",
    video: "Video",
    routeInfo: "Route Information",
    location: "Location",
    coordinates: "Coordinates",
    distance: "Distance",
    actions: "Actions",
    jumpTo: "Jump to",
    noInfo: "No information",
    additionalInfo: "Additional information",
    loading: "Loading",
    loadingMap: "Loading map",
    resetView: "Reset view",
    fullscreen: "Fullscreen",
    exitFullscreen: "Exit fullscreen",
    currentPosition: "Current position",
    learnMore: "Learn more",
    about: "About The Project",
    aboutAuthors: "Credits",
    authors: "Credits",
    authorDirector: "Screenplay, cinematography and direction",
    authorMusic: "Music",
    authorSecondDirector: "Assistant Director",
    authorSecondOperator: "Assistant Camera",
    authorProducer: "Producer",
    authorSecondProducer: "Assistant Producer",
    authorSound: "Sound",
    authorEditor: "Editor",
    aboutMovie: "About The Film",
    aboutApp: `It was the summer of 1975. Busy with their own affairs, passersby wandering the dusty streets of Łódź looked on in astonishment at a group of long-haired young people, who, carrying heavy cameras weighing several kilograms, perseveringly walked through the streets, squares, gardens, and lawns of the city. They disappeared into the doorways of tenement houses, only to emerge from a completely different doorway on another street. If a curious passerby had decided to follow them, they would surely have been astonished to see the filmmakers hauling heavy equipment onto the roofs of buildings, and sometimes even entering private apartments through windows. It would have been hard for them to believe that an animated film was being created for the Łódź studio Se-Ma-For, widely known for producing cartoons for children.

    However, an animated film was indeed being made, realized in stop-motion technique, based on an extraordinary idea for that time, authored by future Oscar laureate Zbigniew Rybczyński. The film's protagonist is - it is not entirely clear who - most likely a monster, a beast that crawls out of the forest at a snail's pace, speeds up through the city, destroying everything in its path. Finally, it meets its end, splattering against the wall of a tenement. The film, when watched with sound, is, to be frank, a horror film, though it is not lacking in dark humor. Watched without sound, it can be perceived with less emotional intensity - as a masterpiece of planning, showcasing directorial and cinematographic craftsmanship. To realize his ambitious plan, the director and crew had to traverse over 12 kilometers through the city. This was done very honestly, without any shortcuts or easing their path. Therefore, one can precisely trace the route of our filmmakers (and the monster), and that is why this project was created - as a curiosity for lovers of vintage artistic cinema, as well as for those who would like to see what Łódź looked like in the summer of 1975.
    
    The entire route is marked on a map, and the map is synchronized with the film. The film can be advanced frame by frame using the arrow keys on the keyboard. At certain frames, a window will pop up with information about the location we are passing on our journey.`,
    aboutFilm: "Film",
    aboutDirector: "Director",
    filmDescription:
      '"Oh! I Can\'t Stop!" is an experimental animated film from 1975, telling the story of a monster that crawls out of the forest into the suburbs, racing faster and faster through the city, destroying everything in its path. Finally, it meets its end, splattering against the wall of an apartment building.',
    filmYear: "Production Year",
    filmDuration: "Duration",
    filmTechnique: "Technique",
    filmTechniqueValue: "Stop-motion animation",
    filmAwards: "Awards",
    filmAwardsValue:
      "Grand Prix at the International Animated Film Festival in Annecy (1976)",
    directorDescription:
      "Zbigniew Rybczyński is one of the most important Polish animated film directors. His innovative approach to animation techniques and film narration has had a huge impact on the development of world cinematography.",
    directorBorn: "Year of Birth",
    directorEducation: "Education",
    directorEducationValue: "National Film School in Łódź",
    directorAchievements: "Achievements",
    directorAchievementsValue:
      'Oscar for "Tango" (1983), pioneer in computer animation',
    directorLegacy: "Legacy",
    directorLegacyValue:
      "His innovative animation techniques and approach to film narration have influenced generations of filmmakers worldwide.",
    locationDescription:
      "The film was made in Łódź, a city with a rich film and artistic tradition. The Se-ma-for Studio, where the film was created, was one of the most important animation centers in Poland.",
    locationCity: "City",
    locationCityValue: "Łódź",
    locationStudio: "Studio",
    locationStudioValue: "Se-ma-for Studio",
    locationSignificance: "Significance",
    locationSignificanceValue:
      "Łódź was and is an important center of Polish cinematography, especially in the field of animated film.",
    locationToday: "Today",
    locationTodayValue:
      "Studio Se-ma-for ceased operations in 2018.",
  },
} as const;

export function getTranslation(
  key: keyof typeof translations.pl,
  language: Language
): string {
  return translations[language][key] || translations.en[key] || key;
}
