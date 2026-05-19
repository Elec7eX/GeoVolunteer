import { UserModel } from "../types/Types";

export const mockUser = {
  active: true,
  beschreibung: "Hilfsbereite, offene Person, die gerne Verantwortung übernimmt.",
  einheit: "M",
  email: "maya.ertl@example.com",
  freiwillige: true,
  geburtsDatum: "1994-09-27",
  hausnummer: "13",
  id: 3000,
  land: null,
  login: "Maya",
  nachname: "Ertl",
  name: null,
  organisation: false,
  ort: "Linz",
  password: "aaa",
  plz: "4020",
  radius: 1112,
  rolle: "FREIWILLIGE",
  shape: {
    type: "Feature",
    geometry: { type: "Point", coordinates: [14.2844671, 48.2942764] },
    properties: {}
  },
  strasse: "Kellergasse",
  telefon: "06765553311",
  verfuegbarBisDatum: "2026-04-07",
  verfuegbarBisZeit: "11:30",
  verfuegbarVonDatum: "2025-04-07",
  verfuegbarVonZeit: "07:00",
  vorname: "Maya",
  webseite: null
};

export const mockOrganisation = {
  active:true, 
  beschreibung:"Das Rote Kreuz Oberösterreich engagiert sich im Rettungsdienst, der Sozialarbeit und der Freiwilligenkoordination.",
  einheit: null,
  email:"marketing@o.roteskreuz.at",
  freiwillige: false,
  geburtsDatum: null,
  hausnummer: "28",
  id:2,
  land:null,
  login: "kreuz",
  nachname: null,
  name: "Österreichisches Rotes Kreuz",
  organisation: true,
  ort: "Linz",
  password: "aaa",
  plz: "4020",
  radius: null,
  rolle: "ORGANISATION",
  shape: {
    type: "Feature", 
    geometry: {
      type: "Point", 
      coordinates: [14.2990243, 48.3046134]}, 
      properties: {}},
  strasse: "Körnerstraße",
  telefon: "+43 732 7644",
  verfuegbarBisDatum: null,
  verfuegbarBisZeit: null,
  verfuegbarVonDatum: null,
  verfuegbarVonZeit: null,
  vorname: null,
  webseite: "https://www.roteskreuz.at/oberoesterreich"
}

export const mockOrganisationKreuz = {
    id: 2,
    rolle: "ORGANISATION",
    active: true,
    login: "kreuz",
    password: "aaa",
    email: "marketing@o.roteskreuz.at",
    telefon: "+43 732 7644",
    strasse: "Körnerstraße",
    hausnummer: "28",
    beschreibung: "Das Rote Kreuz Oberösterreich engagiert sich im Rettungsdienst, der Sozialarbeit und der Freiwilligenkoordination.",
    shape: {
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: [
                14.2990243,
                48.3046134
            ]
        },
        properties: {}
    },
    radius: null,
    einheit: null,
    plz: "4020",
    ort: "Linz",
    land: null,
    name: "Österreichisches Rotes Kreuz",
    webseite: "https://www.roteskreuz.at/oberoesterreich",
    vorname: null,
    nachname: null,
    geburtsDatum: null,
    verfuegbarVonDatum: null,
    verfuegbarBisDatum: null,
    verfuegbarVonZeit: null,
    verfuegbarBisZeit: null,
    organisation: true,
    freiwillige: false
}

export const mockFreiwillige1: UserModel = {
  id: 7,
  rolle: "FREIWILLIGE",
  login: "Neriman",
  password: "aaa",
  email: "neriman.demir@hotmail.com",
  telefon: "06503216549",
  strasse: "Wildbergstraße",
  hausnummer: "8",
  beschreibung: "Hallo ich bin die Neri und bin für jede Hilfe bereit",
  shape: {
      type: "Feature",
      geometry: {
          type: "Point",
          coordinates: [
              14.2867383,
              48.3135152
          ],
      },
      properties: {
          radius: 1876.0
      }
  },
  radius: 1876.0,
  einheit: "M",
  plz: "4040",
  ort: "Linz",
  vorname: "Neriman",
  nachname: "Demir",
  geburtsDatum: "1997-04-05",
  verfuegbarVonDatum: "2025-11-03",
  verfuegbarBisDatum: "2025-11-13",
  verfuegbarVonZeit: "16:40",
  verfuegbarBisZeit: "17:40",
}

export const mockFreiwillige2: UserModel =
  {
    id: 7,
    rolle: "FREIWILLIGE",
    login: "Neriman",
    password: "aaa",
    email: "neriman.demir@hotmail.com",
    telefon: "06503216549",
    strasse: "Wildbergstraße",
    hausnummer: "8",
    beschreibung: "Hallo ich bin die Neri und bin für jede Hilfe bereit",
    shape: {
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: [
                14.2867383,
                48.3135152
            ],
        },
        properties: {
            radius: 1876.0
        }
    },
    radius: 1876.0,
    einheit: "M",
    plz: "4040",
    ort: "Linz",
    vorname: "Neriman",
    nachname: "Demir",
    geburtsDatum: "1997-04-05",
    verfuegbarVonDatum: "2025-11-03",
    verfuegbarBisDatum: "2025-11-13",
    verfuegbarVonZeit: "16:40",
    verfuegbarBisZeit: "17:40",
}

export const mockFreiwillige3: UserModel = {
    id: 17,
    rolle: "FREIWILLIGE",
    login: "Jonas",
    password: "aaa",
    email: "jonas.hartl@example.com",
    telefon: "06770001122",
    strasse: "Museumstraße",
    hausnummer: "3",
    beschreibung: "Technikaffiner Helfer, der gerne improvisiert.",
    shape: {
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: [
                14.2906953,
                48.3056662
            ],
        },
        properties: {
            radius: 0.0
        }
    },
    radius: 0.0,
    einheit: "M",
    plz: "4020",
    ort: "Linz",
    vorname: "Jonas",
    nachname: "Hartl",
    geburtsDatum: "1996-10-05",
    verfuegbarVonDatum: "2025-04-15",
    verfuegbarBisDatum: "2026-03-15",
    verfuegbarVonZeit: "13:00",
    verfuegbarBisZeit: "16:45",
  }

export const mockFreiwillige4: UserModel = {
    id: 18,
    rolle: "FREIWILLIGE",
    login: "Katharina",
    password: "aaa",
    email: "katharina.stadlmayr@example.com",
    telefon: "06765557788",
    strasse: "Hafenstraße",
    hausnummer: "70",
    beschreibung: "Geduldig und freundlich, unterstützt gerne Kinder und Familien.",
    shape: {
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: [
                14.3107628,
                48.3184204
            ],
        },
        properties: {
            radius: 3058.0
        }
    },
    radius: 3058.0,
    einheit: "M",
    plz: "4020",
    ort: "Linz",
    vorname: "Katharina",
    nachname: "Stadlmayr",
    geburtsDatum: "1993-12-13",
    verfuegbarVonDatum: "2025-06-01",
    verfuegbarBisDatum: "2026-06-01",
    verfuegbarVonZeit: "07:00",
    verfuegbarBisZeit: "11:30",
  }