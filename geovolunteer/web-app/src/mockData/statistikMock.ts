import { AktionsradiusVerlauf, AktivitaetenByKategorienStatistik, FreiwilligenAktivitaetenType, FreiwilligenDistanzType, Kategorie, OrganisationenDistanz, RadiusStats } from "../types/Types";

export const statistikKategorieMock: AktivitaetenByKategorienStatistik[] = [{
    count: 2,
    kategorie: Kategorie.BILDUNG
  },
  {
    count: 1,
    kategorie: Kategorie.GESUNDHEIT
  },
  {
    count: 3,
    kategorie: Kategorie.OEFFENTLICHKEITSARBEIT
  }
]

export const radiusMock: RadiusStats = {
    avg: 1.9,
    max: 3.1,
    median: 1.8
}

export const verlaufMock: AktionsradiusVerlauf[] = [
    {
        distanz: 0.9,
        datum: new Date("2026-04-07"),
        datumLabel: "07.04",
        name: "Lebensmittelverteilung an Bedürftige"
    },
    {
        distanz: 3.1,
        datum: new Date("2026-04-08"),
        datumLabel: "08.04",
        name: "Baumpflanzaktion Frühling"
    },
    {
        distanz: 1.5,
        datum: new Date("2026-04-09"),
        datumLabel: "09.04",
        name: "Besuchsdienst im Seniorenheim"
    }
]

export const organisationDistanzMock: OrganisationenDistanz = 
    {
        durchschnittsDistanz: 1.78,
        organisationen: [
            {
                distanz: 0.47,
                id: 1,
                name: "Caritas Oberösterreich"
            },
            {
                distanz: 1.54,
                id: 5,
                name: "Verein Jugendzentren & Freizeit"
            },
            {
                distanz: 1.73,
                id: 3,
                name: "Linzer Baumpatenschaft"
            },
            {
                distanz: 1.98,
                id: 2,
                name: "Österreichisches Rotes Kreuz"
            },
            {
                distanz: 3.19,
                id: 4,
                name: "Volkshilfe Oberösterreich"
            }
        ]
    }

export const freiwilligenDistanzMock: FreiwilligenDistanzType = {
    aUnter5: 33,
    cUeber10: 1,
    bZwischen5und10: 1
}

export const freiwilligenAktivitaetenMock: FreiwilligenAktivitaetenType[] = [
    {
        count: 22,
        distanz: "0-1 km"
    },
    {
        count: 11,
        distanz: "1-3 km"
    },
    {
        count: 0,
        distanz: "3-5 km"
    },
    {
        count: 1,
        distanz: "5-10 km"
    },
    {
        count: 1,
        distanz: ">10 km"
    },
]

export const freiwilligenRadiusAktivitaetenMock: FreiwilligenAktivitaetenType[] = [
    {
        count: 15,
        distanz: "0-1 km"
    },
    {
        count: 8,
        distanz: "1-3 km"
    },
    {
        count: 0,
        distanz: "3-5 km"
    },
    {
        count: 0,
        distanz: "5-10 km"
    },
    {
        count: 0,
        distanz: ">10 km"
    },
]