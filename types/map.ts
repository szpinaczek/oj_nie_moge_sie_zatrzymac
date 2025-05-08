export type Language = "pl" | "en";

export interface Frame {
  time: number;
  lat: number;
  lng: number;
  description: {
    pl: string;
    en: string;
  };
  info?: {
    pl: string;
    en: string;
  };
  distance?: number;
  totalDistance?: number;
}

export interface MapData {
  frames: Frame[];
  route: [number, number][];
}

export interface MapComponentProps {
  mapData: MapData;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  language: Language;
}

export interface MapComponentHandle {
  seekToTime: (time: number) => void;
} 