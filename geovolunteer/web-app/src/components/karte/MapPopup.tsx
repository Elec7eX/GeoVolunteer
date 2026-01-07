import { Popup } from "react-leaflet";
import { AktivitaetModel, UserModel } from "../../types/Types";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface PopupData {
  aktivitaet?: AktivitaetModel;
  user?: UserModel;
  isRessource?: boolean;
}

export const MapPopup: React.FC<PopupData> = ({
  aktivitaet,
  user,
  isRessource,
}) => {
  const navigate = useNavigate();
  return (
    <>
      <Popup>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {user && (
            <span>
              {user.vorname} {user.nachname}
            </span>
          )}
          {!isRessource && aktivitaet && <span>{aktivitaet.name}</span>}
          {isRessource && aktivitaet?.ressource && (
            <span>{aktivitaet.ressource?.name ?? "Ressource"}</span>
          )}

          <FaExternalLinkAlt
            style={{ cursor: "pointer" }}
            title={
              "Zur " + (user ? "Freiwillige" : "Aktivität") + " navigieren"
            }
            onClick={(e) => {
              e.stopPropagation();
              if (user) {
                navigate(`/freiwillige/detail/${user.id}`);
              }
              if (aktivitaet) {
                navigate(`/aktivitäten/detail/${aktivitaet.id}`);
              }
            }}
          />
        </div>
      </Popup>
    </>
  );
};
