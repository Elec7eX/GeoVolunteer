import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Button, Card, Collapse } from "react-bootstrap";
import { Header } from "./header/Header";
import { t } from "i18next";
import { Footer } from "./footer/Footer";
import {
  AktivitaetenByKategorienStatistik,
  Kategorie,
  KategorieLabels,
} from "../types/Types";
import statistikService from "../services/StatistikService";

export const KategorieColors: Record<Kategorie, string> = {
  [Kategorie.SOZIALES]: "#0d6efd",
  [Kategorie.GESUNDHEIT]: "#dc3545",
  [Kategorie.UMWELT]: "#198754",
  [Kategorie.BILDUNG]: "#6f42c1",
  [Kategorie.KINDER_UND_JUGEND]: "#fd7e14",
  [Kategorie.INTEGRATION_UND_BERATUNG]: "#20c997",
  [Kategorie.OEFFENTLICHKEITSARBEIT]: "#0dcaf0",
};

export default function HomePage() {
  const [data, setData] = useState<AktivitaetenByKategorienStatistik[]>([]);
  const [statistik1, setStatistik1] = useState(false);

  const buildCompleteCategoryStatistics = (
    backendData: AktivitaetenByKategorienStatistik[]
  ): AktivitaetenByKategorienStatistik[] => {
    return Object.values(Kategorie).map((kategorie) => {
      const found = backendData.find((d) => d.kategorie === kategorie);

      return {
        kategorie: kategorie,
        count: found ? found.count : 0,
      };
    });
  };

  useEffect(() => {
    statistikService.getAktivitaetenByKategorien().then((resp) => {
      const completedData = buildCompleteCategoryStatistics(resp.data);
      setData(completedData);
    });
  }, []);

  return (
    <>
      <Header title={t("home.title")} />
      <div className="body">
        <h5 style={{ marginTop: 30 }}>Statistiken</h5>
        <Card className="custom-card">
          <Card.Header className="custom-cardheader--available">
            <Button
              variant="link"
              onClick={() => setStatistik1(!statistik1)}
              aria-controls="aktivitaeten-collapse"
              aria-expanded={statistik1}
              className="text-decoration-none"
            >
              <div
                className="custom-cardheader_text"
                style={{ color: "white" }}
              >
                Übersicht der Aktivitäten nach Kategorie
              </div>
            </Button>
          </Card.Header>

          <Collapse in={statistik1}>
            <div id="aktivitaeten-collapse">
              <Card.Body>
                <Card.Text>
                  Zeigt die Aktivitäten des Benutzers nach Kategorien,
                  einschließlich bevorstehender, laufender und abgeschlossener
                  Teilnahme.
                </Card.Text>

                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={data}
                    margin={{ top: 20, right: 20, left: 20, bottom: 30 }}
                  >
                    <XAxis
                      dataKey="kategorie"
                      interval={0}
                      angle={-35}
                      textAnchor="end"
                      height={90}
                      tickFormatter={(value) =>
                        KategorieLabels[value as Kategorie]
                      }
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      labelFormatter={(label) =>
                        KategorieLabels[label as Kategorie]
                      }
                      formatter={(value) => [value, "Anzahl Aktivitäten"]}
                    />
                    <Bar dataKey="count">
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={KategorieColors[entry.kategorie]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card.Body>
            </div>
          </Collapse>
        </Card>
      </div>
      <Footer />
    </>
  );
}
