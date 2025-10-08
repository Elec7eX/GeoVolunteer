import { AdressInputEnum } from "../enums/Enums"
import { Feature, Geometry } from "geojson";

export enum UserType {
    ADMIN = "ADMIN",
    ORGANISATION = "ORGANISATION",
    FREIWILLIGE = "FREIWILLIGE",
}

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
    latitude?: number,
    longitude?: number,
    einheit?: string,
    radius?: number,
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