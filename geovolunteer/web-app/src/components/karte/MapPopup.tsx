import { Popup } from "react-leaflet";
import { AktivitaetModel, UserModel, UserType } from "../../types/Types";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../hooks/useLocalStorage";

interface PopupData {
  aktivitaet?: AktivitaetModel;
  selectedUser?: UserModel;
  isRessource?: boolean;
}

export const MapPopup: React.FC<PopupData> = ({
  aktivitaet,
  selectedUser,
  isRessource,
}) => {
  const [user] = useLocalStorage("user", null);
  return (
    <>
      <Popup>
        <div>
          {user.rolle === UserType.FREIWILLIGE &&
            selectedUser?.rolle === UserType.FREIWILLIGE &&
            user.id === selectedUser.id &&
            user.vorname + " " + user.nachname}
        </div>
        <div
          style={{
            opacity: 0.5, //ausgegraut
            pointerEvents: "none",
            userSelect: "none",
            fontSize: "85%",
          }}
        >
          {aktivitaet && !isRessource && aktivitaet.organisation?.name}
          <div>
            {user.rolle === UserType.FREIWILLIGE &&
              selectedUser?.rolle === UserType.FREIWILLIGE &&
              user.id === selectedUser.id &&
              "mein Standort"}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: "bold",
          }}
        >
          {user.rolle === UserType.ORGANISATION &&
            selectedUser?.rolle === UserType.FREIWILLIGE && (
              <>
                <Link
                  to={`/freiwillige/detail/${selectedUser.id}`}
                  onClick={(e) => e.stopPropagation()}
                  style={{ textDecoration: "none" }}
                >
                  <span>
                    {selectedUser.vorname} {selectedUser.nachname}
                  </span>
                </Link>
              </>
            )}
          {selectedUser?.rolle === UserType.ORGANISATION &&
            (user.rolle === UserType.FREIWILLIGE ? (
              <>
                <Link
                  to={`/organisation/detail/${selectedUser.id}`}
                  onClick={(e) => e.stopPropagation()}
                  style={{ textDecoration: "none" }}
                >
                  <span>{selectedUser.name}</span>
                </Link>
              </>
            ) : (
              <strong>{selectedUser.name}</strong>
            ))}
          {!isRessource && aktivitaet && (
            <Link
              to={`/aktivitäten/detail/${aktivitaet.id}`}
              onClick={(e) => e.stopPropagation()}
              style={{ textDecoration: "none" }}
            >
              {aktivitaet.name}
            </Link>
          )}
          {isRessource && aktivitaet?.ressource && (
            <span>{aktivitaet.ressource?.name ?? "Ressource"}</span>
          )}
        </div>
        <div>
          {!isRessource && aktivitaet && (
            <>
              <div style={{ marginTop: 4, opacity: 0.5 }}>
                <div>
                  Start: {aktivitaet.startDatum + " " + aktivitaet.startZeit}
                </div>
                <div>
                  Ende: {aktivitaet.endDatum + " " + aktivitaet.endZeit}
                </div>
              </div>
            </>
          )}
          {isRessource && aktivitaet?.ressource && (
            <div>
              <Link
                to={`/aktivitäten/detail/${aktivitaet.id}`}
                onClick={(e) => e.stopPropagation()}
                style={{ textDecoration: "none" }}
              >
                {aktivitaet.name}
              </Link>
            </div>
          )}
        </div>
        <div
          style={{
            opacity: 0.5, //ausgegraut
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {selectedUser?.rolle === UserType.ORGANISATION && (
            <span>
              {selectedUser.strasse +
                " " +
                selectedUser.hausnummer +
                ", " +
                selectedUser.plz +
                " " +
                selectedUser.ort}
            </span>
          )}
        </div>
      </Popup>
    </>
  );
};
