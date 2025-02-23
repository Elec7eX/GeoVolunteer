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
    id?: any | null,
    latitude: number,
    longitude: number
}

export interface RessourceModel {
    id?: any | null,
}

export interface AktivitaetModel {
    id?: any | null,
    name: string,
    beschreibung: string,
    addressInput: AdressInputEnum | null,
    adresse?: AdresseModel,
    marker?: MarkerModel,
    ressource: RessourceModel,
}