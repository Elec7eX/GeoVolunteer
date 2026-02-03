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
import { Card, Collapse, OverlayTrigger, Popover } from "react-bootstrap";
import {
  AktivitaetenByKategorienStatistik,
  Kategorie,
  KategorieLabels,
} from "../../types/Types";
import statistikService from "../../services/StatistikService";
import { t } from "i18next";

export const KategorieColors: Record<Kategorie, string> = {
  [Kategorie.SOZIALES]: "#0d6efd",
  [Kategorie.GESUNDHEIT]: "#dc3545",
  [Kategorie.UMWELT]: "#198754",
  [Kategorie.BILDUNG]: "#6f42c1",
  [Kategorie.KINDER_UND_JUGEND]: "#fd7e14",
  [Kategorie.INTEGRATION_UND_BERATUNG]: "#20c997",
  [Kategorie.OEFFENTLICHKEITSARBEIT]: "#0dcaf0",
};

export default function AktivitaetenByKategorien() {
  const [data, setData] = useState<AktivitaetenByKategorienStatistik[]>([]);
  const [statistik1, setStatistik1] = useState(false);

  const buildCompleteCategoryStatistics = (
    backendData: AktivitaetenByKategorienStatistik[],
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
      <Card className="custom-card mb-3">
        <Card.Header
          className="custom-cardheader--default d-flex align-items-center justify-content-between"
          style={{ cursor: "pointer" }}
          onClick={() => setStatistik1(!statistik1)}
        >
          <span className="custom-cardheader_text" style={{ color: "white" }}>
            {t("stat.aktivitaet.kategorie.title")}
          </span>
          <div className="d-flex align-items-center gap-2">
            <OverlayTrigger
              trigger="click"
              placement="left"
              rootClose
              overlay={
                <Popover id="info-popover">
                  <Popover.Body>
                    {t("stat.aktivitaet.kategorie.freiwillige.beschreibung")}
                  </Popover.Body>
                </Popover>
              }
            >
              <i
                className="bi bi-info-circle info-icon"
                onClick={(e) => e.stopPropagation()}
              />
            </OverlayTrigger>
            <span
              style={{
                fontSize: "19px",
                transition: "transform 0.2s ease",
                transform: statistik1 ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              ▼
            </span>
          </div>
        </Card.Header>
        <Collapse in={statistik1}>
          <div id="aktivitaeten-collapse">
            <Card.Body>
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
    </>
  );
}
