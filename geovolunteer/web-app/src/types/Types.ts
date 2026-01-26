import { AdressInputEnum } from "../enums/Enums"
import { Feature, Geometry } from "geojson";

export enum UserType {
    ADMIN = "ADMIN",
    ORGANISATION = "ORGANISATION",
    FREIWILLIGE = "FREIWILLIGE",
}

export enum Kategorie {
  SOZIALES = "SOZIALES",
  GESUNDHEIT = "GESUNDHEIT",
  UMWELT = "UMWELT",
  BILDUNG = "BILDUNG",
  KINDER_UND_JUGEND = "KINDER_UND_JUGEND",
  INTEGRATION_UND_BERATUNG = "INTEGRATION_UND_BERATUNG",
  OEFFENTLICHKEITSARBEIT = "OEFFENTLICHKEITSARBEIT",
}

export const KategorieLabels: Record<Kategorie, string> = {
    [Kategorie.SOZIALES]: "Soziales",
    [Kategorie.GESUNDHEIT]: "Gesundheit",
    [Kategorie.UMWELT]: "Umwelt",
    [Kategorie.BILDUNG]: "Bildung",
    [Kategorie.KINDER_UND_JUGEND]: "Kinder & Jugend",
    [Kategorie.INTEGRATION_UND_BERATUNG]: "Integration & Beratung",
    [Kategorie.OEFFENTLICHKEITSARBEIT]: "Öffentlichkeitsarbeit",
  };

export type GeoJsonFeature = Feature<Geometry, { [key: string]: any }> | null;

export interface UserModel {
    id?: number,
    rolle?: string,
    login: string,
    email?: string,
    password: string,
    telefon?: string,
    strasse?: string,
    hausnummer?: string,
    addresseInput?: AdressInputEnum,
    plz?: string,
    ort?: string,
    shape?: GeoJsonFeature;
    radius?: number,
    einheit?: string,
    land?: string,
    name?: string,
    webseite?: string,
    beschreibung?: string,
    vorname?: string,
    nachname?: string,
    geburtsDatum?: string,
    verfuegbarVonDatum?: string,
    verfuegbarBisDatum?: string,
    verfuegbarVonZeit?: string,
    verfuegbarBisZeit?: string 
}

export interface RessourceModel {
    name: string,
    beschreibung: string,
    addresseInput: AdressInputEnum, 
    strasse: string,
    hausnummer: string,
    plz: string,
    ort: string,
    shape: GeoJsonFeature;
    materialien: string,
    sicherheitsanforderungen: string,
    anmerkung: string,
    vorname: string,
    nachname: string,
    email: string,
    telefon: string
}

export interface AktivitaetModel {
    id?: number,
    name: string,
    beschreibung: string,
    kategorie?: Kategorie,
    addresseInput: AdressInputEnum,
    strasse: string,
    hausnummer: string,
    plz: string,
    ort: string,
    shape: GeoJsonFeature;
    teilnehmeranzahl: number,
    transport: string,
    verpflegung: string,
    vorname: string,
    nachname: string,
    email: string,
    telefon: string,
    ressource: RessourceModel,
    startDatum: string,
    endDatum: string,
    startZeit: string,
    endZeit: string,
    organisation?: UserModel,
    teilnehmer?: UserModel[]
}

export interface AktivitaetenByKategorienStatistik {
  kategorie: Kategorie;
  count: number;
}

export interface RadiusStats {
  avg: number;
  max: number;
  median: number;
}

export interface AktionsradiusVerlauf {
  name: string;
  distanz: number;
}

export interface Organisation {
  id: number;
  name: string;
  distance: number;
}

export interface OrganisationenDistanz {
  organisationen: Organisation[];
  durchschnittsDistanz: number;
}

export interface FreiwilligenDistanzType {
  aUnter5: number;
  bZwischen5und10: number;
  cUeber10: number;
}

export interface FreiwilligenAktivitaetenType {
  distanz: string,
  count: number
}