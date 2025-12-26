package at.geovolunteer.builder;

import java.util.Calendar;

import at.geovolunteer.model.Aktivitaet;
import at.geovolunteer.model.Kategorie;
import at.geovolunteer.model.Ressource;

public class AktivitaetBuilder extends AbstractAktivitaetBuilder<Aktivitaet, AktivitaetBuilder> {

	public AktivitaetBuilder() {
		super(new Aktivitaet());
	}

	public AktivitaetBuilder teilnehmeranzahl(int teilnehmeranzahl) {
		entity.setTeilnehmeranzahl(teilnehmeranzahl);
		return this;
	}

	public AktivitaetBuilder transport(String transport) {
		entity.setTransport(transport);
		return this;
	}

	public AktivitaetBuilder verpflegung(String verpflegung) {
		entity.setVerpflegung(verpflegung);
		return this;
	}

	public AktivitaetBuilder kategorie(Kategorie kategorie) {
		entity.setKategorie(kategorie);
		return this;
	}

	public AktivitaetBuilder startDatum(Calendar startDatum) {
		entity.setStartDatum(startDatum);
		return this;
	}

	public AktivitaetBuilder endDatum(Calendar endDatum) {
		entity.setEndDatum(endDatum);
		return this;
	}

	public AktivitaetBuilder startZeit(Calendar startZeit) {
		entity.setStartZeit(startZeit);
		return this;
	}

	public AktivitaetBuilder endZeit(Calendar endZeit) {
		entity.setEndZeit(endZeit);
		return this;
	}

	public AktivitaetBuilder ressource(Ressource ressource) {
		entity.setRessource(ressource);
		return this;
	}

	@Override
	public Aktivitaet build() {
		return entity;
	}
}