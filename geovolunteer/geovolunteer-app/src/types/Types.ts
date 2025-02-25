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

export interface MarkerModel {
    latitude: number,
    longitude: number
}

export interface RessourceModel {
    name: string
}

export interface AktivitaetModel {
    name: string,
    beschreibung: string,
    addressInput: AdressInputEnum,
    adresse: AdresseModel,
    marker: MarkerModel,
    ressource: RessourceModel,
}