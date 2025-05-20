import { AdressInputEnum } from "../enums/Enums"

export interface UserModel {
    id?: number,
    rolle?: string,
    login: string,
    email?: string,
    password: string,
    vorname?: string,
    nachname?: string,
    geburtsDatum?: string  
}

export interface RessourceModel {
    name: string,
    beschreibung: string,
    addresseInput: AdressInputEnum,
    strasse: string,
    hausnummer: string,
    plz: string,
    ort: string
    latitude: number,
    longitude: number,
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
    ort: string
    latitude: number,
    longitude: number,
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
    endZeit: string
}