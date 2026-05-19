import { AdressInputEnum, UserType } from "../enums/Enums";
import { AktivitaetModel, Kategorie } from "../types/Types";

export const mockLaufendAktivitaet: AktivitaetModel = 
  {
    id: 7,
    name: "Baumpflanzaktion Frühling",
    beschreibung: "Pflanzen junger Bäume im Stadtpark gemeinsam mit Freiwilligen.",
    addresseInput: AdressInputEnum.Map,
    email: "florian.maier@baumpatenschaft.at",
    startDatum: "2025-04-15",
    startZeit: "09:00",
    endDatum: "2026-04-15",
    endZeit: "14:00",
    kategorie: Kategorie.UMWELT,
    teilnehmeranzahl: 15,
    transport: "Öffi",
    verpflegung: "Snacks & Wasser",
    strasse: "Parkstraße",
    hausnummer: "9",
    plz: "4020",
    ort: "Linz",
    vorname: "Florian",
    nachname: "Maier",
    telefon: "+43 732 444555",
    organisation: {
      id: 3,
      name: "Linzer Baumpatenschaft",
      rolle: UserType.ORGANISATION,
      login: "baum",
      password: "aaa",
      email: "info@mag.linz.at",
      telefon: "+43 732 70700",
      strasse: "Hauptstraße",
      hausnummer: "1",
      plz: "4020",
      ort: "Linz",
      webseite: "https://www.linz.at/umwelt/baumpatenschaft.php",
      shape: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [14.2830434, 48.3097595]
        },
        properties: {}
      }
    },
    ressource: {
      name: "Pflanzwerkzeug",
      beschreibung: "Werkzeuge für Baumpflanzaktionen.",
      addresseInput: AdressInputEnum.Map,
      strasse: "Volksgartenstraße",
      hausnummer: "20",
      plz: "4020",
      ort: "Linz",
      materialien: "Spaten, Gießkanne, Handschuhe",
      sicherheitsanforderungen: "Feste Schuhe, Gartenhandschuhe",
      anmerkung: "Werkzeug wird zentral bereitgestellt",
      vorname: "Florian",
      nachname: "Maier",
      email: "florian.maier@baumpatenschaft.at",
      telefon: "+43 732 444555",
      shape: {
        geometry: {
          coordinates: [14.2895086, 48.2959758],
          type: "Point",
        },
        type: "Feature",
        properties: {}
      },
    },
    shape: {
      geometry: {
        coordinates: [[[14.300171, 48.298203], 
                      [14.300412, 48.297768], 
                      [14.300546, 48.297729], 
                      [14.300578, 48.297639], 
                      [14.300503, 48.297579], 
                      [14.300562, 48.297479], 
                      [14.300482, 48.297432], 
                      [14.300519, 48.297379], 
                      [14.300675, 48.297407], 
                      [14.300798, 48.297372], 
                      [14.30105, 48.297404],
                      [14.301383, 48.297522],
                      [14.301506, 48.297704], 
                      [14.301624, 48.298453], 
                      [14.301538, 48.298574], 
                      [14.300171, 48.298203]]],
        type: "Polygon",
      },
      type: "Feature",
      properties: {}
    },
  };

export const mockLaufendAktivitaetOrg1: AktivitaetModel = {
    id: 5,
    name: "Erste-Hilfe-Training für Freiwillige",
    beschreibung: "Schulung in lebensrettenden Sofortmaßnahmen.",
    addresseInput: AdressInputEnum.Map,
    email: "katrin.fischer@roteskreuz.at",
    startDatum: "2025-07-20",
    startZeit: "09:00",
    endDatum: "2026-07-20",
    endZeit: "14:00",
    kategorie: Kategorie.BILDUNG,
    teilnehmeranzahl: 20,
    transport: "Individuell",
    verpflegung: "Getränke",
    strasse: "Fadingerstraße",
    hausnummer: "15",
    plz: "4020",
    ort: "Linz",
    vorname: "Katrin",
    nachname: "Fischer",
    telefon: "+43 732 222222",
    organisation: {
      id: 2,
      beschreibung: "Das Rote Kreuz Oberösterreich engagiert sich im Rettungsdienst, der Sozialarbeit und der Freiwilligenkoordination.",
      name: "Österreichisches Rotes Kreuz",
      rolle: UserType.ORGANISATION,
      login: "kreuz",
      password: "aaa",
      email: "marketing@o.roteskreuz.at",
      telefon: "+43 732 7644",
      strasse: "Körnerstraße",
      hausnummer: "28",
      plz: "4020",
      ort: "Linz",
      webseite: "https://www.roteskreuz.at/oberoesterreich",
      shape: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [14.2990243, 48.3046134]
        },
        properties: {}
      }
    },
    ressource: {
      name: "Rettungsfahrzeug",
      anmerkung: "Nur von geschultem Personal zu verwenden",
      beschreibung: "Notfallfahrzeug mit medizinischer Grundausstattung.",
      addresseInput: AdressInputEnum.Map,
      strasse: "Ludlgasse",
      hausnummer: "3",
      plz: "4020",
      ort: "Linz",
      materialien: "Sanitätskoffer, Defibrillator, Trage",
      sicherheitsanforderungen: "Sanitäter-Ausbildung erforderlich",
      vorname: "Katrin",
      nachname: "Fischer",
      email: "katrin.fischer@roteskreuz.at",
      telefon: "+43 732 222222",
      shape: {
        geometry: {
          coordinates: [14.296509, 48.3101669],
          type: "Point",
        },
        type: "Feature",
        properties: {}
      },
    },
    shape: {
      geometry: {
        coordinates: [14.294339, 48.302505],
        type: "Point",
      },
      type: "Feature",
      properties: {}
    },
    teilnehmer: [
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
      },
      {
          id: 15,
          rolle: "FREIWILLIGE",
          login: "Benjamin",
          password: "aaa",
          email: "benjamin.maier@example.com",
          telefon: "06765553322",
          strasse: "Wankmüllerhofstraße",
          hausnummer: "22",
          beschreibung: "Hilft gerne bei körperlichen Aufgaben und liebt Teamarbeit.",
          shape: {
              type: "Feature",
              geometry: {
                  type: "Point",
                  coordinates: [
                      14.302826,
                      48.2824763
                  ],
              },
              properties: {
                  radius: 7088.0
              }
          },
          radius: 7088.0,
          einheit: "M",
          plz: "4020",
          ort: "Linz",
          vorname: "Benjamin",
          nachname: "Maier",
          geburtsDatum: "1999-01-09",
          verfuegbarVonDatum: "2025-03-10",
          verfuegbarBisDatum: "2026-03-10",
          verfuegbarVonZeit: "13:00",
          verfuegbarBisZeit: "16:45",
      },
      {
          id: 16,
          rolle: "FREIWILLIGE",
          login: "Laura",
          password: "aaa",
          email: "laura.schuster@example.com",
          telefon: "06503334455",
          strasse: "Kärntner Straße",
          hausnummer: "8",
          beschreibung: "Kreative junge Frau, die gerne bei Veranstaltungen unterstützt.",
          shape: {
              type: "Feature",
              geometry: {
                  type: "Point",
                  coordinates: [
                      14.2918977,
                      48.2930833
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
          vorname: "Laura",
          nachname: "Schuster",
          geburtsDatum: "2001-06-29",
          verfuegbarVonDatum: "2025-01-20",
          verfuegbarBisDatum: "2026-01-20",
          verfuegbarVonZeit: "07:00",
          verfuegbarBisZeit: "11:30",
      },
      {
        id: 6,
        rolle: "FREIWILLIGE",
        login: "Murat",
        password: "aaa",
        email: "murat.demir.1905@hotmail.com",
        telefon: "06503216549",
        strasse: "Stelzerstraße",
        hausnummer: "39",
        beschreibung: "Hallo ich bin Murat und bin für jede Hilfe bereit!",
        shape: {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [
                    14.3031913,
                    48.3101252
                ],
            },
            properties: {
                radius: 521.0
            }
        },
        radius: 521.0,
        einheit: "M",
        plz: "4020",
        ort: "Linz",
        vorname: "Murat",
        nachname: "Demir",
        geburtsDatum: "1990-05-15",
        verfuegbarVonDatum: "2025-11-13",
        verfuegbarBisDatum: "2025-11-27",
        verfuegbarVonZeit: "15:32",
        verfuegbarBisZeit: "16:35",
      }
    ]
}

export const mockLaufendAktivitaetOrg2: AktivitaetModel = {
  id: 4,
  name: "Blutspendeaktion Linz",
  beschreibung: "HelferInnen unterstützen bei Registrierung und Betreuung von SpenderInnen.",
  shape: {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [14.300171, 48.298203],
          [14.300412, 48.297768],
          [14.300546, 48.297729],
          [14.300578, 48.297639],
          [14.300503, 48.297579],
          [14.300562, 48.297479],
          [14.300482, 48.297432],
          [14.300519, 48.297379],
          [14.300675, 48.297407],
          [14.300798, 48.297372],
          [14.30105, 48.297404],
          [14.301383, 48.297522],
          [14.301506, 48.297704],
          [14.301624, 48.298453],
          [14.301538, 48.298574],
          [14.300171, 48.298203]
        ]
      ],
    },
    properties: {}
  },
  vorname: "Peter",
  nachname: "Lehner",
  email: "peter.lehner@roteskreuz.at",
  telefon: "+43 732 987654",
  teilnehmeranzahl: 12,
  transport: "Öffi",
  verpflegung: "Jause vorhanden",
  kategorie: Kategorie.GESUNDHEIT,
  startDatum: "2025-06-14",
  endDatum: "2026-06-14",
  startZeit: "09:00",
  endZeit: "16:00",
  ressource: {
    name: "Blutspendeausstattung",
    beschreibung: "Materialien für Blutspendeaktionen.",
    strasse: "Harrachstraße",
    hausnummer: "1",
    plz: "4020",
    ort: "Linz",
    shape: {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [
          14.2900898,
          48.3020264
        ]
      },
      properties: {}
    },
    vorname: "Peter",
    nachname: "Lehner",
    email: "peter.lehner@roteskreuz.at",
    telefon: "+43 732 987654",
    materialien: "Liegen, Desinfektionsmittel, Getränke",
    sicherheitsanforderungen: "Ersthelferkurs empfohlen",
    anmerkung: "Geräte werden regelmäßig gewartet",
    addresseInput: AdressInputEnum.Manual
  },
  organisation: {
    id: 2,
    rolle: "ORGANISATION",
    password: "aaa",
    login: "kreuz",
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
        ],
      },
      properties: {}
    },
    plz: "4020",
    ort: "Linz",
    name: "Österreichisches Rotes Kreuz",
    webseite: "https://www.roteskreuz.at/oberoesterreich",
  },
  addresseInput: AdressInputEnum.Manual,
  strasse: "Fadingerstraße",
  hausnummer: "15",
  plz: "4020",
  ort: "Linz",
  teilnehmer: [
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
  },
  {
      id: 15,
      rolle: "FREIWILLIGE",
      login: "Benjamin",
      password: "aaa",
      email: "benjamin.maier@example.com",
      telefon: "06765553322",
      strasse: "Wankmüllerhofstraße",
      hausnummer: "22",
      beschreibung: "Hilft gerne bei körperlichen Aufgaben und liebt Teamarbeit.",
      shape: {
          type: "Feature",
          geometry: {
              type: "Point",
              coordinates: [
                  14.302826,
                  48.2824763
              ],
          },
          properties: {
              radius: 7088.0
          }
      },
      radius: 7088.0,
      einheit: "M",
      plz: "4020",
      ort: "Linz",
      vorname: "Benjamin",
      nachname: "Maier",
      geburtsDatum: "1999-01-09",
      verfuegbarVonDatum: "2025-03-10",
      verfuegbarBisDatum: "2026-03-10",
      verfuegbarVonZeit: "13:00",
      verfuegbarBisZeit: "16:45",
  },
  {
      id: 16,
      rolle: "FREIWILLIGE",
      login: "Laura",
      password: "aaa",
      email: "laura.schuster@example.com",
      telefon: "06503334455",
      strasse: "Kärntner Straße",
      hausnummer: "8",
      beschreibung: "Kreative junge Frau, die gerne bei Veranstaltungen unterstützt.",
      shape: {
          type: "Feature",
          geometry: {
              type: "Point",
              coordinates: [
                  14.2918977,
                  48.2930833
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
      vorname: "Laura",
      nachname: "Schuster",
      geburtsDatum: "2001-06-29",
      verfuegbarVonDatum: "2025-01-20",
      verfuegbarBisDatum: "2026-01-20",
      verfuegbarVonZeit: "07:00",
      verfuegbarBisZeit: "11:30",
  },
  {
    id: 6,
    rolle: "FREIWILLIGE",
    login: "Murat",
    password: "aaa",
    email: "murat.demir.1905@hotmail.com",
    telefon: "06503216549",
    strasse: "Stelzerstraße",
    hausnummer: "39",
    beschreibung: "Hallo ich bin Murat und bin für jede Hilfe bereit!",
    shape: {
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: [
                14.3031913,
                48.3101252
            ],
        },
        properties: {
            radius: 521.0
        }
    },
    radius: 521.0,
    einheit: "M",
    plz: "4020",
    ort: "Linz",
    vorname: "Murat",
    nachname: "Demir",
    geburtsDatum: "1990-05-15",
    verfuegbarVonDatum: "2025-11-13",
    verfuegbarBisDatum: "2025-11-27",
    verfuegbarVonZeit: "15:32",
    verfuegbarBisZeit: "16:35",
  }
  ]
}

export const mockLaufendAktivitaetOrg3: AktivitaetModel = 
  {
    id: 6,
    name: "Infostand am Hauptplatz",
    beschreibung: "Aufklärung über Erste Hilfe und Freiwilligenarbeit.",
    strasse: "Goethestraße",
    hausnummer: "17",
    plz: "4020",
    ort: "Linz",
    shape: {
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: [
                14.2948638,
                48.2970583
            ],
        },
        properties: {}
    },
    vorname: "Julia",
    nachname: "Wagner",
    email: "julia.wagner@roteskreuz.at",
    telefon: "+43 732 333333",
    teilnehmeranzahl: 6,
    transport: "Öffi",
    verpflegung: "Keine",
    kategorie: Kategorie.OEFFENTLICHKEITSARBEIT,
    startDatum: "2026-05-10",
    endDatum: "2026-08-10",
    startZeit: "11:00",
    endZeit: "17:00",
    addresseInput: AdressInputEnum.Manual,
    ressource: {
        name: "Infostand Rotes Kreuz",
        beschreibung: "Informationsstand für Öffentlichkeitsarbeit.",
        strasse: "Mozartstraße",
        hausnummer: "6",
        plz: "4020",
        ort: "Linz",
        vorname: "Julia",
        nachname: "Wagner",
        email: "julia.wagner@roteskreuz.at",
        telefon: "+43 732 333333",
        materialien: "Zelt, Tische, Flyer, Banner",
        sicherheitsanforderungen: "Keine besonderen Anforderungen",
        anmerkung: "Aufbau durch Freiwillige vor Ort",
        addresseInput: AdressInputEnum.Manual,
        shape: null
    },
    organisation: {
      id: 2,
      rolle: "ORGANISATION",
      login: "kreuz",
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
          ],
        },
        properties: {}
      },
      plz: "4020",
      ort: "Linz",
      name: "Österreichisches Rotes Kreuz",
      webseite: "https://www.roteskreuz.at/oberoesterreich",
      password: "aaa"
    },
    teilnehmer: [
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
        },
        {
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
        },
        {
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
    ]
}