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
        coordinates: [14.2643224, 48.2702525],
        type: "Point",
      },
      type: "Feature",
      properties: {}
    },
  };