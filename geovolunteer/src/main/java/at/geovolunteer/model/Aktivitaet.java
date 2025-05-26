package at.geovolunteer.model;

import java.util.Calendar;

import org.springframework.lang.Nullable;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "aktivitaet")
public class Aktivitaet extends AbstractAktivitaet {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private int teilnehmeranzahl;
	private String transport;
	private String verpflegung;

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

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

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

}
