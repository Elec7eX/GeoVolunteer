import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import { Login } from "./login/Login";
import { AuthProvider } from "./hooks/useAuth";
import { Secret } from "./components/Secret";
import { ProtectedRoute } from "./roots/ProtectedRoute";
import i18n from "./i18n";
import { Footer } from "./components/footer/Footer";
import { Header } from "./components/header/Header";

const App: React.FC = () => {
  console.log(i18n);
  return (
    <div className="app">
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
                  <Header />
                  <HomePage />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/secret"
              element={
                <ProtectedRoute>
                  <Secret />
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

const CheckAuth = ({ children }: { children: React.ReactElement }) => {
  return children;
};

export default App;
