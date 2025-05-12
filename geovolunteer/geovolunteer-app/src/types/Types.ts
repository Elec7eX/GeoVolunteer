import { AdressInputEnum } from "../enums/Enums"

export interface UserModel {
    id?: any | null,
    vorname: string,
    nachname: string,
    geburtsDatum: string  
}

export interface AdresseModel {
    strasse: string,
    hausnummer: string,
    plz: string,
    ort: string
}

export interface KoordinatenModel {
    latitude: number,
    longitude: number
}

export interface RessourceModel {
    name: string,
    beschreibung: string,
    addresseInput: AdressInputEnum,
    adresse: AdresseModel,
    koordinaten: KoordinatenModel,
    materialien: string,
    sicherheitsanforderungen: string,
    anmerkung: string,
    vorname: string,
    nachname: string,
    email: string,
    telefon: string
}

export interface AktivitaetModel {
    name: string,
    beschreibung: string,
    addresseInput?: AdressInputEnum,
    adresse: AdresseModel,
    koordinaten: KoordinatenModel,
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