import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import statistikService from "../../services/StatistikService";
import {
  Card,
  Collapse,
  Row,
  Col,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import { t } from "i18next";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA66CC"];

export default function OrganisationenDistanz() {
  const [data, setData] = useState<any[]>([]);
  const [avg, setAvg] = useState<number>(0);
  const [showStatistik, setShowStatistik] = useState<boolean>(false);

  useEffect(() => {
    statistikService.getOrganisationenDistanz().then((res) => {
      setData(res.data.organisationen);
      setAvg(res.data.durchschnittsDistanz);
    });
  }, []);

  return (
    <Card className="custom-card mb-3">
      <Card.Header
        className="custom-cardheader--available d-flex align-items-center justify-content-between"
        style={{ cursor: "pointer" }}
        onClick={() => setShowStatistik(!showStatistik)}
      >
        <span className="custom-cardheader_text" style={{ color: "white" }}>
          {t("stat.organisation.distanz.freiwillige.title")}
        </span>
        <div className="d-flex align-items-center gap-2">
          <OverlayTrigger
            trigger="click"
            placement="left"
            rootClose
            overlay={
              <Popover id="info-popover">
                <Popover.Body>
                  {t("stat.organisation.distanz.freiwillige.beschreibung")}
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
              transform: showStatistik ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            ▼
          </span>
        </div>
      </Card.Header>
      <Collapse in={showStatistik}>
        <div>
          <Card.Body>
            <Row>
              <Col>
                <PieChart width={340} height={300}>
                  <Pie
                    data={data}
                    dataKey="distanz"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    label
                  >
                    {data.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) =>
                      typeof v === "number" ? `${v.toFixed(2)} km` : v
                    }
                  />
                </PieChart>
              </Col>
              <Col>
                <div>
                  <h5>
                    {t(
                      "stat.organisation.distanz.freiwillige.durchschnittsdistanz",
                    )}
                  </h5>
                  <h2>{avg.toFixed(2)} km</h2>
                  <p>{t("stat.organisation.distanz.freiwillige.topfive")}</p>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </div>
      </Collapse>
    </Card>
  );
}
