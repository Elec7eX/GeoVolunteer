import { useState, ChangeEvent } from "react";
import IUserData from "../types/User";
import userService from "../services/UserServices";

export default function AddUser() {
  const initialBenutzerState = {
    id: null,
    vorname: "",
    nachname: "",
    geburtsDatum: "",
  };
  const [benutzer, setBenutzer] = useState<IUserData>(initialBenutzerState);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setBenutzer({ ...benutzer, [name]: value });
  };

  const saveBenutzer = () => {
    var data = {
      vorname: benutzer.vorname,
      nachname: benutzer.nachname,
      geburtsDatum: benutzer.geburtsDatum,
    };

    userService
      .create(data)
      .then((response: any) => {
        setBenutzer({
          id: response.data.id,
          vorname: response.data.vorname,
          nachname: response.data.nachname,
          geburtsDatum: response.data.geburtsDatum,
        });
        setSubmitted(true);
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  const newBenutzer = () => {
    setBenutzer(initialBenutzerState);
    setSubmitted(false);
  };
  return (
    <div className="submit-form">
      {submitted ? (
        <div>
          <h4>You submitted successfully!</h4>
          <button className="btn btn-success" onClick={newBenutzer}>
            Add
          </button>
        </div>
      ) : (
        <div>
          <div className="form-group">
            <label htmlFor="vorname">Vorname</label>
            <input
              type="text"
              className="form-control"
              id="vorname"
              required
              value={benutzer.vorname}
              onChange={handleInputChange}
              name="vorname"
            />
          </div>

          <div className="form-group">
            <label htmlFor="nachname">Nachname</label>
            <input
              type="text"
              className="form-control"
              id="nachname"
              required
              value={benutzer.nachname}
              onChange={handleInputChange}
              name="nachname"
            />
          </div>

          <div className="form-group">
            <label htmlFor="geburtsDatum">Geburtsdatum</label>
            <input
              type="date"
              className="form-control"
              id="geburtsDatum"
              required
              value={
                benutzer.geburtsDatum
                  ? benutzer.geburtsDatum.substring(0, 10)
                  : ""
              } // Formatierung auf YYYY-MM-DD
              onChange={handleInputChange}
              name="geburtsDatum"
            />
          </div>

          <button onClick={saveBenutzer} className="btn btn-success">
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
