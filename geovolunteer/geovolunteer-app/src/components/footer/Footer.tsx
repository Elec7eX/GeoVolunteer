import { Nav, Navbar } from "react-bootstrap";

export const Footer = () => {
  return (
    <>
      <div>
        <Navbar className="footer navbar navbar-light bg-light">
          <div className="container d-inline-block">
            <a className="navbar-brand" href="/secret">
              <i className="bi bi-house-door" />
            </a>
          </div>
        </Navbar>
      </div>
    </>
  );
};
