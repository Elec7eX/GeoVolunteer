import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  Col,
  Collapse,
  OverlayTrigger,
  Row,
  Popover,
} from "react-bootstrap";
import statistikService from "../../services/StatistikService";
import { AktionsradiusVerlauf, RadiusStats } from "../../types/Types";
import { t } from "i18next";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { radiusMock, verlaufMock } from "../../mockData/statistikMock";

export default function AktionsRadius() {
  const [user] = useLocalStorage("user", null);
  const [showRadius, setShowRadius] = useState(false);
  const [radiusStats, setRadiusStats] = useState<RadiusStats>({
    avg: 0,
    max: 0,
    median: 0,
  });

  const [verlaufStats, setVerlaufStats] = useState<AktionsradiusVerlauf[]>([]);
  const [showVerlauf, setShowVerlauf] = useState(false);

  useEffect(() => {
    if (user.id !== 3000) {
      statistikService.getAktionsradius().then((resp) => {
        setRadiusStats(resp.data);
      });

      statistikService.getAktionsradiusVerlauf().then((resp) => {
        const chartData = resp.data.map((d) => {
          const date = new Date(d.datum);
          return {
            datum: date,
            datumLabel: date
              .toLocaleDateString("de-AT", {
                day: "2-digit",
                month: "2-digit",
              })
              .replace(/\.$/, ""),
            name: d.name,
            distanz: d.distanz,
          };
        });
        setVerlaufStats(chartData);
      });
    } else {
      setRadiusStats(radiusMock);
      const charData = verlaufMock.map((d) => {
        const date = new Date(d.datum);
        return {
          datum: date,
          datumLabel: date
            .toLocaleDateString("de-AT", {
              day: "2-digit",
              month: "2-digit",
            })
            .replace(/\.$/, ""),
          name: d.name,
          distanz: d.distanz,
        };
      });
      setVerlaufStats(charData);
    }
  }, [user.id]);

  return (
    <>
      <Card className="custom-card mb-3">
        <Card.Header
          className="custom-cardheader--default d-flex align-items-center justify-content-between"
          style={{ cursor: "pointer" }}
          onClick={() => setShowRadius(!showRadius)}
        >
          <span className="custom-cardheader_text" style={{ color: "white" }}>
            {t("stat.aktivitaet.aktionsradius.title")}
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
                      "stat.aktivitaet.aktionsradius.freiwillige.beschreibung",
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
                transform: showRadius ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              ▼
            </span>
          </div>
        </Card.Header>
        <Collapse in={showRadius}>
          <div>
            <Card.Body>
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
          className="custom-cardheader--default d-flex align-items-center justify-content-between"
          style={{ cursor: "pointer" }}
          onClick={() => setShowVerlauf(!showVerlauf)}
        >
          <span className="custom-cardheader_text" style={{ color: "white" }}>
            {t("stat.aktivitaet.distanzverlauf.title")}
          </span>
          <div className="d-flex align-items-center gap-2">
            <OverlayTrigger
              trigger="click"
              placement="left"
              rootClose
              overlay={
                <Popover id="info-popover">
                  <Popover.Body>
                    {t("stat.aktivitaet.distanzverlauf.beschreibung")}
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
                transform: showVerlauf ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              ▼
            </span>
          </div>
        </Card.Header>
        <Collapse in={showVerlauf}>
          <div>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={verlaufStats}>
                  <XAxis
                    dataKey="datumLabel"
                    angle={-30}
                    textAnchor="end"
                    height={60}
                    label={{
                      value: "Datum",
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
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0]) {
                        const data = payload[0].payload;
                        const fullDate = data.datum.toLocaleDateString(
                          "de-AT",
                          {
                            weekday: "short",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        );

                        return `${data.name} (${fullDate})`;
                      }

                      return `Aktivität ${label}`;
                    }}
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
