package at.geovolunteer.builder;

import java.util.Calendar;

import at.geovolunteer.model.Benutzer;
import at.geovolunteer.model.Einheit;
import at.geovolunteer.model.Rolle;
import at.geovolunteer.service.BenutzerService;

public class FreiwilligenBuilder extends AbstractBenutzerBuilder<FreiwilligenBuilder> {

	protected Double radius;
	protected Einheit einheit;

	// Freiwillige
	private String vorname;
	private String nachname;
	private Calendar geburtsDatum;
	private Calendar verfuegbarVonDatum;
	private Calendar verfuegbarBisDatum;
	private Calendar verfuegbarVonZeit;
	private Calendar verfuegbarBisZeit;

	public FreiwilligenBuilder(BenutzerService benutzerService) {
		super(benutzerService);
		this.rolle = Rolle.FREIWILLIGE;
	}

	public FreiwilligenBuilder vorname(String vorname) {
		this.vorname = vorname;
		return self();
	}

	public FreiwilligenBuilder nachname(String nachname) {
		this.nachname = nachname;
		return self();
	}

	public FreiwilligenBuilder geburtsDatum(Calendar geburtsDatum) {
		this.geburtsDatum = geburtsDatum;
		return self();
	}

	public FreiwilligenBuilder verfuegbarVonDatum(Calendar verfuegbarVonDatum) {
		this.verfuegbarVonDatum = verfuegbarVonDatum;
		return self();
	}

	public FreiwilligenBuilder verfuegbarBisDatum(Calendar verfuegbarBisDatum) {
		this.verfuegbarBisDatum = verfuegbarBisDatum;
		return self();
	}

	public FreiwilligenBuilder verfuegbarVonZeit(Calendar verfuegbarVonZeit) {
		this.verfuegbarVonZeit = verfuegbarVonZeit;
		return self();
	}

	public FreiwilligenBuilder verfuegbarBisZeit(Calendar verfuegbarBisZeit) {
		this.verfuegbarBisZeit = verfuegbarBisZeit;
		return self();
	}

	@Override
	public Benutzer build() {
		Benutzer b = new Benutzer();
		applyCommonFields(b);
		b.setRolle(Rolle.FREIWILLIGE);
		b.setVorname(vorname);
		b.setNachname(nachname);
		b.setGeburtsDatum(geburtsDatum);
		b.setVerfuegbarVonDatum(verfuegbarVonDatum);
		b.setVerfuegbarBisDatum(verfuegbarBisDatum);
		b.setVerfuegbarVonZeit(verfuegbarVonZeit);
		b.setVerfuegbarBisZeit(verfuegbarBisZeit);
		return benutzerService.create(b);
	}
}
