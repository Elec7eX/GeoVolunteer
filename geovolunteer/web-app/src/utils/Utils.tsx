import { AktivitaetModel } from "../types/Types";

export const VerticalDivider = ({ height = "50px" }) => {
  return (
    <div
      style={{
        width: "1px",
        height: height,
        backgroundColor: "#dee2e6",
        margin: "0 1rem",
      }}
    />
  );
};

const STATUS_CONFIG = {
  available: {
    label: "Plätze verfügbar",
    color: "rgb(0, 160, 0)",
    className: "custom-cardheader--available",
  },
  limited: {
    label: "Wenige Plätze verfügbar",
    color: "rgb(160, 120, 0)",
    className: "custom-cardheader--limited",
  },
  full: {
    label: "Ausgebucht",
    color: "rgb(160, 0, 0)",
    className: "custom-cardheader--full",
  },
} as const;

type ActivityStatus = keyof typeof STATUS_CONFIG;

type StatusIndicatorProps = {
  aktivitaet: AktivitaetModel;
};

const StatusIndicator = ({ aktivitaet }: StatusIndicatorProps) => {
  const status = getAktivitaetStatus(aktivitaet);
  const { label, color } = STATUS_CONFIG[status];

  return (
    <div className="status">
      <span className="status-dot" style={{ backgroundColor: color }} />
      <span className="status-label">{label}</span>
    </div>
  );
};

export default StatusIndicator;

const getAktivitaetStatus = (aktivitaet: AktivitaetModel): ActivityStatus => {
  const kapazitaet = aktivitaet.teilnehmeranzahl;
  const anzahl = aktivitaet.teilnehmer?.length ?? 0;
  const freiePlaetze = kapazitaet - anzahl;

  if (freiePlaetze >= 3) return "available";
  if (freiePlaetze >= 1) return "limited";
  return "full";
};

export const aktivitaetStatus = (aktivitaet: AktivitaetModel) => {
  return STATUS_CONFIG[getAktivitaetStatus(aktivitaet)];
};
