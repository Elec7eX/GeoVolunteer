import { AktionsradiusVerlauf, AktivitaetenByKategorienStatistik, Kategorie, OrganisationenDistanz, RadiusStats } from "../types/Types";

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
        name: "Lebensmittelverteilung an Bedürftige"
    },
    {
        distanz: 3.1,
        name: "Baumpflanzaktion Frühling"
    },
    {
        distanz: 1.5,
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