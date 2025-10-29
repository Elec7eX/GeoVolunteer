import React from "react";
import "./css/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import { Login } from "./login/Login";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./roots/ProtectedRoute";
import i18n from "./i18n";
import Map from "./components/karte/Map";
import Organisaiton from "./components/organisation/Organisation";
import AktivitaetenOverview from "./components/aktivitaeten/AktivitaetenOverview";
import AktivitaetDetailPage from "./components/aktivitaeten/AktivitaetDetailPage";
import RessourceDetailPage from "./components/aktivitaeten/RessourceDetailPage";
import AktivitaetDetail from "./components/aktivitaeten/AktivitaetDetail";
import Profil from "./components/profil/Profil";
import Freiwillige from "./components/freiwillige/Freiwillige";
import FreiwilligeDetailPage from "./components/freiwillige/FreiwilligeDetailPage";
import OrganisationDetailPage from "./components/organisation/OrganisationDetailPage";

const App: React.FC = () => {
  console.log(i18n);
  return (
    <div id="app-root" className="app">
      {<script src="http://localhost:8097"></script>}
      <AuthProvider>
        {/*<Pages />*/}
        {
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/aktivitäten"
              element={
                <ProtectedRoute>
                  <AktivitaetenOverview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/aktivitäten/detail/:id"
              element={
                <ProtectedRoute>
                  <AktivitaetDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/aktivitäten/ressource/detail/:id"
              element={
                <ProtectedRoute>
                  <RessourceDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/aktivitäten/erstellen"
              element={
                <ProtectedRoute>
                  <AktivitaetDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/aktivitäten/bearbeiten/:id"
              element={
                <ProtectedRoute>
                  <AktivitaetDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/map"
              element={
                <ProtectedRoute>
                  <Map />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organisation"
              element={
                <ProtectedRoute>
                  <Organisaiton />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organisation/detail/:id"
              element={
                <ProtectedRoute>
                  <OrganisationDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/freiwillige"
              element={
                <ProtectedRoute>
                  <Freiwillige />
                </ProtectedRoute>
              }
            />
            <Route
              path="/freiwillige/detail/:id"
              element={
                <ProtectedRoute>
                  <FreiwilligeDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profil"
              element={
                <ProtectedRoute>
                  <Profil />
                </ProtectedRoute>
              }
            />
          </Routes>
        }
      </AuthProvider>
    </div>
  );
  /*<div className="App">
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <a href={BASE_URL + "/benutzer"} className="navbar-brand">
            GeoVolunteer
          </a>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={BASE_URL + "/benutzer"} className="nav-link">
                User
              </Link>
            </li>
            <li className="nav-item">
              <Link to={BASE_URL + "/create"} className="nav-link">
                Add
              </Link>
            </li>
          </div>
        </nav>

        <div className="container mt-3">
          <Routes>
            <Route path={BASE_URL} element={<UsersList />} />
            <Route path={BASE_URL + "/benutzer"} element={<User />} />
            <Route path={BASE_URL + "/create"} element={<AddUser />} />
            <Route path="/benutzer/:id" element={<User />} />
          </Routes>
        </div>
    </div>
  );*/
};

export default App;
