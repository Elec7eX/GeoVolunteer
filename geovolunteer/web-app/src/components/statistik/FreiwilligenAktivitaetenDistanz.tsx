import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { FreiwilligenAktivitaetenType } from "../../types/Types";
import statistikService from "../../services/StatistikService";
import { t } from "i18next";
import { Card, Collapse } from "react-bootstrap";

export default function FreiwilligenAktivitaetenDistanz() {
  const [data, setData] = useState<FreiwilligenAktivitaetenType[]>([]);
  const [show, setShow] = useState(false);

  const [radiusData, setRadiusData] = useState<FreiwilligenAktivitaetenType[]>(
    [],
  );
  const [showRadius, setShowRadius] = useState(false);

  useEffect(() => {
    statistikService.getFreiwilligenAktivitaetenDistanz().then((resp) => {
      const histogramData = Object.entries(resp.data).map(
        ([distanz, count]) => ({
          distanz,
          count,
        }),
      );
      setData(histogramData);
    });
    statistikService.getFreiwilligenRadiusAktivitaetenDistanz().then((resp) => {
      const histogramData = Object.entries(resp.data).map(
        ([distanz, count]) => ({
          distanz,
          count,
        }),
      );
      setRadiusData(histogramData);
    });
  }, []);
  return (
    <>
      <Card className="custom-card mb-3">
        <Card.Header
          className="custom-cardheader--default d-flex align-items-center justify-content-between"
          style={{ cursor: "pointer" }}
          onClick={() => setShow(!show)}
        >
          <span className="custom-cardheader_text" style={{ color: "white" }}>
            {t("stat.organisation.freiwilligeAktivitaeten.distanz.title")}
          </span>
          <span
            style={{
              fontSize: "19px",
              transition: "transform 0.2s ease",
              transform: show ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            ▼
          </span>
        </Card.Header>
        <Collapse in={show}>
          <div id="aktivitaeten-collapse">
            <Card.Body>
              <Card.Text>
                {t(
                  "stat.organisation.freiwilligeAktivitaeten.distanz.beschreibung",
                )}
              </Card.Text>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="distanz" />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(value) => [`${value}`, "Freiwillige"]} />
                  <Bar dataKey="count" fill="#4e73df" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </div>
        </Collapse>
      </Card>
      <Card className="custom-card mb-3">
        <Card.Header
          className="custom-cardheader--default d-flex align-items-center justify-content-between"
          style={{ cursor: "pointer" }}
          onClick={() => setShowRadius(!showRadius)}
        >
          <span className="custom-cardheader_text" style={{ color: "white" }}>
            {t("stat.organisation.freiwilligeRadiusAktivitaeten.distanz.title")}
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
          <div id="aktivitaeten-collapse">
            <Card.Body>
              <Card.Text>
                {t(
                  "stat.organisation.freiwilligeRadiusAktivitaeten.distanz.beschreibung",
                )}
              </Card.Text>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={radiusData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="distanz" />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(value) => [`${value}`, "Freiwillige"]} />
                  <Bar dataKey="count" fill="#4e73df" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </div>
        </Collapse>
      </Card>
    </>
  );
}
