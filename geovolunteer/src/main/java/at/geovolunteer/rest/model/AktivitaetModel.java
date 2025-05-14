package at.geovolunteer.rest.model;

import java.util.Calendar;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

public class AktivitaetModel extends AbstractAktivitaetModel {

	private int teilnehmeranzahl;
	private String transport;
	private String verpflegung;
	@JsonDeserialize(using = CalendarDeserializer.class)
	private Calendar startDatum;
	@JsonDeserialize(using = CalendarDeserializer.class)
	private Calendar endDatum;
	@JsonDeserialize(using = CalendarTimeDeserializer.class)
	private Calendar startZeit;
	@JsonDeserialize(using = CalendarTimeDeserializer.class)
	private Calendar endZeit;
	private RessourceModel ressource;

	public int getTeilnehmeranzahl() {
		return teilnehmeranzahl;
	}

	public void setTeilnehmeranzahl(int teilnehmeranzahl) {
		this.teilnehmeranzahl = teilnehmeranzahl;
	}

	public String getTransport() {
		return transport;
	}

	public void setTransport(String transport) {
		this.transport = transport;
	}

	public String getVerpflegung() {
		return verpflegung;
	}

	public void setVerpflegung(String verpflegung) {
		this.verpflegung = verpflegung;
	}

	public Calendar getStartDatum() {
		return startDatum;
	}

	public void setStartDatum(Calendar startDatum) {
		this.startDatum = startDatum;
	}

	public Calendar getEndDatum() {
		return endDatum;
	}

	public void setEndDatum(Calendar endDatum) {
		this.endDatum = endDatum;
	}

	public Calendar getStartZeit() {
		return startZeit;
	}

	public void setStartZeit(Calendar startZeit) {
		this.startZeit = startZeit;
	}

	public Calendar getEndZeit() {
		return endZeit;
	}

	public void setEndZeit(Calendar endZeit) {
		this.endZeit = endZeit;
	}

	public RessourceModel getRessource() {
		return ressource;
	}

	public void setRessource(RessourceModel ressource) {
		this.ressource = ressource;
	}

}
