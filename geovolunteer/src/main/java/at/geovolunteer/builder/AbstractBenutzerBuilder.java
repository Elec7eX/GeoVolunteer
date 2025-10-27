package at.geovolunteer.builder;

import org.locationtech.jts.geom.Geometry;

import at.geovolunteer.model.Benutzer;
import at.geovolunteer.model.Rolle;
import at.geovolunteer.model.repo.BenutzerRepository;

public abstract class AbstractBenutzerBuilder<T extends AbstractBenutzerBuilder<T>> {

	protected final BenutzerRepository benutzerRepository;

	protected Rolle rolle;
	protected boolean active;

	protected String login;
	protected String password;
	protected String email;
	protected String telefon;
	protected String strasse;
	protected String hausnummer;
	protected String plz;
	protected String ort;
	protected String beschreibung;
	protected Geometry shape;

	protected AbstractBenutzerBuilder(BenutzerRepository benutzerRepository) {
		this.benutzerRepository = benutzerRepository;
	}

	@SuppressWarnings("unchecked")
	protected T self() {
		return (T) this;
	}

	public T login(String login) {
		this.login = login;
		return self();
	}

	public T password(String password) {
		this.password = password;
		return self();
	}

	public T email(String email) {
		this.email = email;
		return self();
	}

	public T telefon(String telefon) {
		this.telefon = telefon;
		return self();
	}

	public T strasse(String strasse) {
		this.strasse = strasse;
		return self();
	}

	public T hausnummer(String hausnummer) {
		this.hausnummer = hausnummer;
		return self();
	}

	public T beschreibung(String beschreibung) {
		this.beschreibung = beschreibung;
		return self();
	}

	public T plz(String plz) {
		this.plz = plz;
		return self();
	}

	public T ort(String ort) {
		this.ort = ort;
		return self();
	}

	protected void applyCommonFields(Benutzer b) {
		b.setRolle(rolle);
		b.setActive(false);
		b.setLogin(login);
		b.setPassword(password);
		b.setEmail(email);
		b.setTelefon(telefon);
		b.setStrasse(strasse);
		b.setHausnummer(hausnummer);
		b.setPlz(plz);
		b.setOrt(ort);
		b.setBeschreibung(beschreibung);
	}

	public abstract Benutzer build();
}
