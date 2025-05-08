export type Language = 'pl' | 'en';

export const translations = {
  pl: {
    title: 'Trasa ONMSZ',
    video: 'Wideo',
    map: 'Mapa',
    routeInfo: 'Informacje o trasie',
    time: 'Czas',
    location: 'Lokalizacja',
    coordinates: 'Współrzędne',
    distance: 'Odległość',
    actions: 'Akcje',
    jumpTo: 'Przejdź',
    noInfo: 'Brak dodatkowych informacji',
    additionalInfo: 'Dodatkowe informacje',
    loading: 'Ładowanie...',
    loadingMap: 'Ładowanie mapy...',
    resetView: 'Resetuj widok',
    fullscreen: 'Pełny ekran',
    exitFullscreen: 'Wyłącz pełny ekran'
  },
  en: {
    title: 'ONMSZ Route',
    video: 'Video',
    map: 'Map',
    routeInfo: 'Route Information',
    time: 'Time',
    location: 'Location',
    coordinates: 'Coordinates',
    distance: 'Distance',
    actions: 'Actions',
    jumpTo: 'Jump to',
    noInfo: 'No additional information',
    additionalInfo: 'Additional Information',
    loading: 'Loading...',
    loadingMap: 'Loading map...',
    resetView: 'Reset view',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit fullscreen'
  }
} as const;

export const getTranslation = (key: keyof typeof translations.pl, lang: Language): string => {
  return translations[lang][key];
}; 