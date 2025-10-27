package at.geovolunteer.builder;

import at.geovolunteer.model.AbstractAktivitaet;

@SuppressWarnings("unchecked")
public abstract class AbstractAktivitaetBuilder<T extends AbstractAktivitaet, B extends AbstractAktivitaetBuilder<T, B>> {

	protected final T entity;

	protected AbstractAktivitaetBuilder(T entity) {
		this.entity = entity;
	}

	public B name(String name) {
		entity.setName(name);
		return (B) this;
	}

	public B beschreibung(String beschreibung) {
		entity.setBeschreibung(beschreibung);
		return (B) this;
	}

	public B strasse(String strasse) {
		entity.setStrasse(strasse);
		return (B) this;
	}

	public B hausnummer(String hausnummer) {
		entity.setHausnummer(hausnummer);
		return (B) this;
	}

	public B plz(String plz) {
		entity.setPlz(plz);
		return (B) this;
	}

	public B ort(String ort) {
		entity.setOrt(ort);
		return (B) this;
	}

	public B vorname(String vorname) {
		entity.setVorname(vorname);
		return (B) this;
	}

	public B nachname(String nachname) {
		entity.setNachname(nachname);
		return (B) this;
	}

	public B email(String email) {
		entity.setEmail(email);
		return (B) this;
	}

	public B telefon(String telefon) {
		entity.setTelefon(telefon);
		return (B) this;
	}

	public abstract T build();
}
