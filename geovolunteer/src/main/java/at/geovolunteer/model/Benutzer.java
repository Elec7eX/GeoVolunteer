package at.geovolunteer.model;

import java.util.Calendar;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

@Data
@JsonIgnoreProperties(value = { "addresseInput" })
@Entity(name = "benutzer")
public class Benutzer {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Enumerated(EnumType.STRING)
	private Rolle rolle;

	private boolean active;

	private String login;
	private String password;
	private String email;
	private String telefon;
	private String strasse;
	private String hausnummer;
	private double latitude;
	private double longitude;
	private double radius;
	@Enumerated(EnumType.STRING)
	private Einheit einheit;
	private String plz;
	private String ort;
	private String land;
	private byte[] logo;

	// Organisation
	private String name;
	private String webseite;
	private String beschreibung;

	// Freiwillige
	private String vorname;
	private String nachname;
	@Temporal(TemporalType.DATE)
	@JsonSerialize(using = CalendarSerializer.class)
	@JsonDeserialize(using = CalendarDeserializer.class)
	private Calendar geburtsDatum;
	@Temporal(TemporalType.DATE)
	@JsonSerialize(using = CalendarSerializer.class)
	@JsonDeserialize(using = CalendarDeserializer.class)
	private Calendar verfuegbarVonDatum;
	@Temporal(TemporalType.DATE)
	@JsonSerialize(using = CalendarSerializer.class)
	@JsonDeserialize(using = CalendarDeserializer.class)
	private Calendar verfuegbarBisDatum;
	@Temporal(TemporalType.TIME)
	@JsonSerialize(using = CalendarTimeSerializer.class)
	@JsonDeserialize(using = CalendarTimeDeserializer.class)
	private Calendar verfuegbarVonZeit;
	@Temporal(TemporalType.TIME)
	@JsonSerialize(using = CalendarTimeSerializer.class)
	@JsonDeserialize(using = CalendarTimeDeserializer.class)
	private Calendar verfuegbarBisZeit;

	// Für Organisationen: Aktivitäten erstellen
	@JsonIgnore
	@OneToMany(mappedBy = "organisation")
	private List<Aktivitaet> erstellteAktivitaeten;

	// Für Freiwillige: Teilnahme an Aktivitäten
	@ManyToMany
	@JoinTable(joinColumns = @JoinColumn(name = "benutzer_id"), inverseJoinColumns = @JoinColumn(name = "aktivitaet_id"))
	private List<Aktivitaet> teilnahmen;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Rolle getRolle() {
		return rolle;
	}

	public void setRolle(Rolle rolle) {
		this.rolle = rolle;
	}

	public String getLogin() {
		return login;
	}

	public void setLogin(String login) {
		this.login = login;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getTelefon() {
		return telefon;
	}

	public void setTelefon(String telefon) {
		this.telefon = telefon;
	}

	public String getStrasse() {
		return strasse;
	}

	public void setStrasse(String strasse) {
		this.strasse = strasse;
	}

	public String getHausnummer() {
		return hausnummer;
	}

	public void setHausnummer(String hausnummer) {
		this.hausnummer = hausnummer;
	}

	public String getPlz() {
		return plz;
	}

	public void setPlz(String plz) {
		this.plz = plz;
	}

	public String getOrt() {
		return ort;
	}

	public void setOrt(String ort) {
		this.ort = ort;
	}

	public String getLand() {
		return land;
	}

	public void setLand(String land) {
		this.land = land;
	}

	public byte[] getLogo() {
		return logo;
	}

	public void setLogo(byte[] logo) {
		this.logo = logo;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getWebseite() {
		return webseite;
	}

	public void setWebseite(String webseite) {
		this.webseite = webseite;
	}

	public String getBeschreibung() {
		return beschreibung;
	}

	public void setBeschreibung(String beschreibung) {
		this.beschreibung = beschreibung;
	}

	public String getVorname() {
		return vorname;
	}

	public void setVorname(String vorname) {
		this.vorname = vorname;
	}

	public String getNachname() {
		return nachname;
	}

	public void setNachname(String nachname) {
		this.nachname = nachname;
	}

	public Calendar getGeburtsDatum() {
		return geburtsDatum;
	}

	public void setGeburtsDatum(Calendar geburtsDatum) {
		this.geburtsDatum = geburtsDatum;
	}

	public Calendar getVerfuegbarVonDatum() {
		return verfuegbarVonDatum;
	}

	public void setVerfuegbarVonDatum(Calendar verfuegbarVonDatum) {
		this.verfuegbarVonDatum = verfuegbarVonDatum;
	}

	public Calendar getVerfuegbarBisDatum() {
		return verfuegbarBisDatum;
	}

	public void setVerfuegbarBisDatum(Calendar verfuegbarBisDatum) {
		this.verfuegbarBisDatum = verfuegbarBisDatum;
	}

	public Calendar getVerfuegbarVonZeit() {
		return verfuegbarVonZeit;
	}

	public void setVerfuegbarVonZeit(Calendar verfuegbarVonZeit) {
		this.verfuegbarVonZeit = verfuegbarVonZeit;
	}

	public Calendar getVerfuegbarBisZeit() {
		return verfuegbarBisZeit;
	}

	public void setVerfuegbarBisZeit(Calendar verfuegbarBisZeit) {
		this.verfuegbarBisZeit = verfuegbarBisZeit;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public double getLatitude() {
		return latitude;
	}

	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}

	public double getLongitude() {
		return longitude;
	}

	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}

	public double getRadius() {
		return radius;
	}

	public void setRadius(double radius) {
		this.radius = radius;
	}

	public Einheit getEinheit() {
		return einheit;
	}

	public void setEinheit(Einheit einheit) {
		this.einheit = einheit;
	}

	public List<Aktivitaet> getErstellteAktivitaeten() {
		return erstellteAktivitaeten;
	}

	public void addErstellteAktivitaeten(Aktivitaet aktivitaet) {
		if (!this.erstellteAktivitaeten.contains(aktivitaet)) {
			this.erstellteAktivitaeten.add(aktivitaet);
			aktivitaet.setOrganisation(this);
		}
	}

	public void removeErstellteAktivitaeten(Aktivitaet aktivitaet) {
		if (this.erstellteAktivitaeten.contains(aktivitaet)) {
			this.erstellteAktivitaeten.remove(aktivitaet);
			aktivitaet.setOrganisation(null);
		}
	}

	public List<Aktivitaet> getTeilnahmen() {
		return teilnahmen;
	}

	public void addTeilnahmen(Aktivitaet aktivitaet) {
		if (!this.teilnahmen.contains(aktivitaet)) {
			this.teilnahmen.add(aktivitaet);
			aktivitaet.getTeilnehmer().add(this);
		}
	}

	public void removeTeilnahmen(Aktivitaet aktivitaet) {
		if (this.teilnahmen.contains(aktivitaet)) {
			this.teilnahmen.remove(aktivitaet);
			aktivitaet.getTeilnehmer().remove(this);
		}
	}
}
