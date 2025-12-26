package at.geovolunteer.model;

import java.util.Calendar;
import java.util.List;

import org.springframework.lang.Nullable;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import at.geovolunteer.config.CalendarDeserializer;
import at.geovolunteer.config.CalendarSerializer;
import at.geovolunteer.config.CalendarTimeDeserializer;
import at.geovolunteer.config.CalendarTimeSerializer;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "aktivitaet")
public class Aktivitaet extends AbstractAktivitaet {

	private int teilnehmeranzahl;
	private String transport;
	private String verpflegung;

	@Enumerated(EnumType.STRING)
	private Kategorie kategorie;

	@Temporal(TemporalType.DATE)
	@JsonSerialize(using = CalendarSerializer.class)
	@JsonDeserialize(using = CalendarDeserializer.class)
	private Calendar startDatum;

	@Temporal(TemporalType.DATE)
	@JsonSerialize(using = CalendarSerializer.class)
	@JsonDeserialize(using = CalendarDeserializer.class)
	private Calendar endDatum;

	@Temporal(TemporalType.TIME)
	@JsonSerialize(using = CalendarTimeSerializer.class)
	@JsonDeserialize(using = CalendarTimeDeserializer.class)
	private Calendar startZeit;

	@Temporal(TemporalType.TIME)
	@JsonSerialize(using = CalendarTimeSerializer.class)
	@JsonDeserialize(using = CalendarTimeDeserializer.class)
	private Calendar endZeit;

	@Nullable
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "ressource_id", unique = true)
	private Ressource ressource;

	// Der Ersteller der Aktivität (Organisation)
	@ManyToOne
	@JoinColumn(name = "organisation_id")
	@JsonIgnoreProperties({ "password", "teilnahmen", "erstellteAktivitaeten", "shape", "radius" })
	private Benutzer organisation;

	// Teilnehmer (Freiwillige)
	@ManyToMany(mappedBy = "teilnahmen")
	private List<Benutzer> teilnehmer;

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

	public Ressource getRessource() {
		return ressource;
	}

	public void setRessource(Ressource ressource) {
		this.ressource = ressource;
	}

	public Benutzer getOrganisation() {
		return organisation;
	}

	public void setOrganisation(Benutzer organisation) {
		this.organisation = organisation;
	}

	public List<Benutzer> getTeilnehmer() {
		return teilnehmer;
	}

	public void addTeilnehmer(Benutzer teilnehmer) {
		if (!this.teilnehmer.contains(teilnehmer)) {
			this.teilnehmer.add(teilnehmer);
			teilnehmer.getTeilnahmen().add(this);
		}
	}

	public void removeTeilnehmer(Benutzer teilnehmer) {
		if (this.teilnehmer.contains(teilnehmer)) {
			this.teilnehmer.remove(teilnehmer);
			teilnehmer.getTeilnahmen().remove(this);
		}
	}

	public Kategorie getKategorie() {
		return kategorie;
	}

	public void setKategorie(Kategorie kategorie) {
		this.kategorie = kategorie;
	}

}
