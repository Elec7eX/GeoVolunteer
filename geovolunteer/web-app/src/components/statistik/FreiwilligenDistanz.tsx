import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FreiwilligenDistanzType } from "../../types/Types";
import statistikService from "../../services/StatistikService";
import { t } from "i18next";
import { Card, Collapse, OverlayTrigger, Popover } from "react-bootstrap";

const COLORS = ["#4CAF50", "#FFC107", "#F44336"];

export default function FreiwilligenDistanz() {
  const [show, setShow] = useState(false);
  const [stats, setStats] = useState<FreiwilligenDistanzType>({
    aUnter5: 0,
    bZwischen5und10: 0,
    cUeber10: 0,
  });

  const chartData = stats
    ? [
        { name: "< 5 km", value: stats.aUnter5 },
        { name: "5–10 km", value: stats.bZwischen5und10 },
        { name: "> 10 km", value: stats.cUeber10 },
      ]
    : [];

  useEffect(() => {
    statistikService
      .getFreiwilligenDistanz()
      .then((resp) => setStats(resp.data));
  }, []);

  return (
    <>
      {stats && (
        <Card className="custom-card mb-3">
          <Card.Header
            className="custom-cardheader--default d-flex align-items-center justify-content-between"
            style={{ cursor: "pointer" }}
            onClick={() => setShow(!show)}
          >
            <span className="custom-cardheader_text" style={{ color: "white" }}>
              {t("stat.organisation.freiwillige.entfernung.title")}
            </span>
            <div className="d-flex align-items-center gap-2">
              <OverlayTrigger
                trigger="click"
                placement="left"
                rootClose
                overlay={
                  <Popover id="info-popover">
                    <Popover.Body>
                      {t(
                        "stat.organisation.freiwillige.entfernung.beschreibung",
                      )}
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
                  transform: show ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                ▼
              </span>
            </div>
          </Card.Header>
          <Collapse in={show}>
            <div id="aktivitaeten-collapse">
              <Card.Body>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart width={350} height={300}>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      dataKey="value"
                    >
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card.Body>
            </div>
          </Collapse>
        </Card>
      )}
    </>
  );
}
