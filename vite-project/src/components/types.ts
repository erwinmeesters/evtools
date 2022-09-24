export interface MapConfig {
  container: string;
  style: string;
  center: Coordinates;
  zoom: number;
  maxBounds: Array<Coordinates>;
}

export type Coordinates = Array<number | number>;

export interface DataSet {
  type: string;
  name: string;
  features: Array<Feature>;
}

export interface Feature {
  geometry: {
    coordinates: Coordinates;
    type: string;
  };
  id: number;
  properties: Properties;
  type: string;
}

export interface Properties {
  Aantal_2011: string;
  Aantal_2012: string;
  Aantal_2013: string;
  Aantal_2014: string;
  Aantal_2015: string;
  Aantal_2016: string;
  Aantal_2017: string;
  Aantal_2018: string;
  Aantal_2019: string;
  Aantal_2020: string;
  Aantal_2021: string;
  Aantal_2022: string;
  Foto1: string;
  Foto2: string;
  Huisnummer: string;
  Straatnaam: string;
  Verblijfplaats: string;
  Vogel: string;
  Voorziening: string;
}

export interface MapLayer {
  id: string;
  type: string;
  source: string;
  paint: {
    'circle-radius': number;
    'circle-color': string;
    'circle-stroke-width': number;
    'circle-stroke-color': string;
  };
  visible: boolean;
  total: number;
}

export enum Colors {
  Spreeuw = '#D62828',
  Huismus = '#FCBF49',
  Gierzwaluw = '#1B998B',
  Boerenzwaluw = '#4CC9F0',
  Huiszwaluw = '#8338EC',
  Undefined = '#333333'
}
