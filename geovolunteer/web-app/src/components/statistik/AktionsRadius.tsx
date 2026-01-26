import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, Col, Collapse, Row } from "react-bootstrap";
import statistikService from "../../services/StatistikService";
import { AktionsradiusVerlauf, RadiusStats } from "../../types/Types";
import { t } from "i18next";

export default function AktionsRadius() {
  const [showRadius, setShowRadius] = useState(false);
  const [radiusStats, setRadiusStats] = useState<RadiusStats>({
    avg: 0,
    max: 0,
    median: 0,
  });

  const [verlaufStats, setVerlaufStats] = useState<AktionsradiusVerlauf[]>([]);
  const [showVerlauf, setShowVerlauf] = useState(false);

  useEffect(() => {
    statistikService.getAktionsradius().then((resp) => {
      setRadiusStats(resp.data);
    });

    statistikService.getAktionsradiusVerlauf().then((resp) => {
      const chartData = resp.data.map((d, i) => ({
        index: i + 1,
        name: d.name,
        distanz: d.distanz,
      }));
      setVerlaufStats(chartData);
    });
  }, []);

  return (
    <>
      <Card className="custom-card mb-3">
        <Card.Header
          className="custom-cardheader--available d-flex align-items-center justify-content-between"
          style={{ cursor: "pointer" }}
          onClick={() => setShowRadius(!showRadius)}
        >
          <span className="custom-cardheader_text" style={{ color: "white" }}>
            {t("stat.aktivitaet.aktionsradius.title")}
          </span>
          <span
            style={{
              fontSize: "19px",
              transition: "transform 0.2s ease",
              transform: showRadius ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            ▼
          </span>
        </Card.Header>

        <Collapse in={showRadius}>
          <div>
            <Card.Body>
              <Card.Text>
                {t("stat.aktivitaet.aktionsradius.freiwillige.beschreibung")}
              </Card.Text>

              <Row>
                <Col>
                  <Card className="text-center">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "0.9rem" }}>
                        {t(
                          "stat.aktivitaet.aktionsradius.durchschnittsdistanz",
                        )}
                      </Card.Title>
                      <div style={{ fontSize: "1.4rem", fontWeight: "bold" }}>
                        {radiusStats.avg} km
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card className="text-center">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "0.9rem" }}>
                        {t("stat.aktivitaet.aktionsradius.weitesteAktivitaet")}
                      </Card.Title>
                      <div style={{ fontSize: "1.4rem", fontWeight: "bold" }}>
                        {radiusStats.max} km
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card className="text-center">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "0.9rem" }}>
                        {t("stat.aktivitaet.aktionsradius.typischerRadius")}
                      </Card.Title>
                      <div style={{ fontSize: "1.4rem", fontWeight: "bold" }}>
                        {radiusStats.median} km
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </div>
        </Collapse>
      </Card>
      <Card className="custom-card mb-3">
        <Card.Header
          className="custom-cardheader--available d-flex align-items-center justify-content-between"
          style={{ cursor: "pointer" }}
          onClick={() => setShowVerlauf(!showVerlauf)}
        >
          <span className="custom-cardheader_text" style={{ color: "white" }}>
            {t("stat.aktivitaet.distanzverlauf.title")}
          </span>
          <span
            style={{
              fontSize: "19px",
              transition: "transform 0.2s ease",
              transform: showVerlauf ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            ▼
          </span>
        </Card.Header>
        <Collapse in={showVerlauf}>
          <div>
            <Card.Body>
              <Card.Text>
                {t("stat.aktivitaet.distanzverlauf.beschreibung")}
              </Card.Text>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={verlaufStats}>
                  <XAxis
                    dataKey="index"
                    label={{
                      value: "Aktivitäten",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Distanz (km)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip
                    labelFormatter={(label, payload) =>
                      payload && payload[0]
                        ? payload[0].payload.name
                        : `Aktivität ${label}`
                    }
                    formatter={(value) =>
                      typeof value === "number"
                        ? [`${value} km`, "Entfernung"]
                        : value
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="distanz"
                    stroke="#0d6efd"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </div>
        </Collapse>
      </Card>
    </>
  );
}
