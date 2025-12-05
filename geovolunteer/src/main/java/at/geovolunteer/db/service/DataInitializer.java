package at.geovolunteer.db.service;

import java.util.Calendar;
import java.util.Collections;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import at.geovolunteer.builder.AktivitaetBuilder;
import at.geovolunteer.builder.FreiwilligenBuilder;
import at.geovolunteer.builder.OrganisationBuilder;
import at.geovolunteer.builder.RessourceBuilder;
import at.geovolunteer.model.Aktivitaet;
import at.geovolunteer.model.Benutzer;
import at.geovolunteer.model.Ressource;
import at.geovolunteer.model.repo.AktivitaetRepository;
import at.geovolunteer.model.repo.BenutzerRepository;
import at.geovolunteer.service.BenutzerService;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

	private final BenutzerRepository benutzerRepository;
	private final AktivitaetRepository aktivitaetRepository;

	@Autowired
	private final BenutzerService benutzerService;

	public DataInitializer(BenutzerService benutzerService, BenutzerRepository benutzerRepository,
			AktivitaetRepository aktivitaetRepository) {
		this.benutzerRepository = benutzerRepository;
		this.benutzerService = benutzerService;
		this.aktivitaetRepository = aktivitaetRepository;
	}

	@Override
	@Transactional
	public void run(String... args) throws Exception {
		createOrganisationen();
		createAktivitaeten();
		createFreiwillige();
		System.out.println("GEO_VOLUNTEER_APP wurde gestartet!");
	}

	private void createOrganisationen() {
		List<Benutzer> organisationen = Optional.ofNullable(benutzerService.getOrganisationen())
				.orElse(Collections.emptyList());

		boolean caritasExists = organisationen.stream().filter(Objects::nonNull).map(Benutzer::getName)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Caritas Oberösterreich"));

		boolean roteskreuzExists = organisationen.stream().filter(Objects::nonNull).map(Benutzer::getName)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Österreichisches Rotes Kreuz"));

		boolean baumpatenschaftExists = organisationen.stream().filter(Objects::nonNull).map(Benutzer::getName)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Linzer Baumpatenschaft"));

		boolean volkshilfeExists = organisationen.stream().filter(Objects::nonNull).map(Benutzer::getName)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Volkshilfe Oberösterreich"));

		boolean vereinJugendExists = organisationen.stream().filter(Objects::nonNull).map(Benutzer::getName)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Verein Jugendzentren & Freizeit"));

		if (!caritasExists) {
			new OrganisationBuilder(benutzerRepository).login("caritas").password("aaa")
					.email("information@caritas-ooe.at").telefon("+43 732 7610").strasse("Kapuzinerstraße")
					.hausnummer("84").plz("4020").ort("Linz")
					.beschreibung(
							"Die Caritas Linz unterstützt Menschen in Notlagen und organisiert zahlreiche Freiwilligenprojekte in Oberösterreich.")
					.name("Caritas Oberösterreich").webseite("https://www.caritas-ooe.at/").build();
		}
		if (!roteskreuzExists) {
			new OrganisationBuilder(benutzerRepository).login("kreuz").password("aaa")
					.email("marketing@o.roteskreuz.at").telefon("+43 732 7644").strasse("Körnerstraße").hausnummer("28")
					.plz("4020").ort("Linz")
					.beschreibung(
							"Das Rote Kreuz Oberösterreich engagiert sich im Rettungsdienst, der Sozialarbeit und der Freiwilligenkoordination.")
					.name("Österreichisches Rotes Kreuz").webseite("https://www.roteskreuz.at/oberoesterreich").build();
		}
		if (!baumpatenschaftExists) {
			new OrganisationBuilder(benutzerRepository).login("baum").password("aaa").email("info@mag.linz.at ")
					.telefon("+43 732 70700").strasse("Hauptstraße").hausnummer("1").plz("4020").ort("Linz")
					.beschreibung(
							"Bäume sind natürliche Klimaanlagen in der Stadt und tragen maßgeblich zu einer nachhaltigen, klimagerechten Zukunft bei. Nur durch Begrünung kann die Lebensqualität in der dicht verbauten Innenstadt in Zukunft weiter hochgehalten werden.")
					.name("Linzer Baumpatenschaft").webseite("https://www.linz.at/umwelt/baumpatenschaft.php").build();
		}
		if (!volkshilfeExists) {
			new OrganisationBuilder(benutzerRepository).login("volk").password("aaa")
					.email("office@tierschutzverein-linz.at").telefon("+43 732 3405").strasse("Glimpfingerstraße")
					.hausnummer("48").plz("4020").ort("Linz")
					.beschreibung(
							"Die Volkshilfe in Oberösterreich steht nicht nur für menschliche Vielfalt, auch unsere Angebote gehen von Betreuung und Pflege, über Beratung und Therapie bishin zur Unterstützung am Arbeitsmarkt und noch vieles mehr.")
					.name("Volkshilfe Oberösterreich").webseite("https://www.volkshilfe-ooe.at/").build();
		}
		if (!vereinJugendExists) {
			new OrganisationBuilder(benutzerRepository).login("jugend").password("aaa").email("office@vjf.at ")
					.telefon("+43 732 773031").strasse("Lederergasse").hausnummer("7").plz("4020").ort("Linz")
					.beschreibung(
							"Der Verein Jugendzentren Linz betreibt offene Jugendarbeit in mehreren Stadtteilen und organisiert Freiwilligenprojekte mit Jugendlichen.")
					.name("Verein Jugendzentren & Freizeit").webseite("https://vjf.at/").build();
		}
	}

	private void createAktivitaeten() {
		createCaritasAktivitaeten();
		createRotesKreuzAktivitaeten();
		createBaumpatenschaftAktivitaeten();
		createVolkshilfeAktivitaeten();
		createJugendzentrumAktivitaeten();

	}

	private void createCaritasAktivitaeten() {
		Optional<Benutzer> caritasBenutzer = benutzerService.getOrganisationen().stream()
				.filter(org -> org.getName().equals("Caritas Oberösterreich")).findFirst();
		if (caritasBenutzer.isPresent()) {
			Benutzer organisation = caritasBenutzer.get();
			boolean isAktivitaet = !CollectionUtils.isEmpty(organisation.getErstellteAktivitaeten())
					&& organisation.getErstellteAktivitaeten().stream().filter(Objects::nonNull)
							.anyMatch(e -> e.getName().equals("Lebensmittelverteilung an Bedürftige"));
			boolean isAktivitaet2 = !CollectionUtils.isEmpty(organisation.getErstellteAktivitaeten())
					&& organisation.getErstellteAktivitaeten().stream().filter(Objects::nonNull)
							.anyMatch(e -> e.getName().equals("Kleiderspenden sortieren"));
			boolean isAktivitaet3 = !CollectionUtils.isEmpty(organisation.getErstellteAktivitaeten())
					&& organisation.getErstellteAktivitaeten().stream().filter(Objects::nonNull)
							.anyMatch(e -> e.getName().equals("Sozialberatung unterstützen"));

			if (!isAktivitaet) {
				Ressource lebensmittelSet = new RessourceBuilder().name("Lebensmittelpakete")
						.beschreibung("Kisten mit haltbaren Lebensmitteln für Bedürftige.").strasse("Lagerstraße")
						.hausnummer("12").plz("4020").ort("Linz").vorname("Maria").nachname("Huber")
						.email("maria.huber@caritas.at").telefon("+43 732 123456")
						.materialien("Konserven, Hygieneartikel, Grundnahrungsmittel")
						.sicherheitsanforderungen("Trageschutz, feste Schuhe")
						.anmerkung("Bereitgestellt aus dem Caritas-Lager Linz-Süd").build();

				Aktivitaet lebensmittelVerteilung = new AktivitaetBuilder().name("Lebensmittelverteilung an Bedürftige")
						.beschreibung("HelferInnen sortieren und verteilen gespendete Lebensmittel.")
						.strasse("Kapuzinerstraße").hausnummer("84").plz("4020").ort("Linz").teilnehmeranzahl(10)
						.transport("Öffi oder Fahrrad").verpflegung("Getränke vorhanden").vorname("Maria")
						.nachname("Huber").email("maria.huber@caritas.at").telefon("+43 732 123456")
						.startDatum(new GregorianCalendar(2025, Calendar.MARCH, 10))
						.endDatum(new GregorianCalendar(2025, Calendar.MARCH, 10))
						.startZeit(new GregorianCalendar(0, 0, 0, 9, 0)).endZeit(new GregorianCalendar(0, 0, 0, 14, 0))
						.ressource(lebensmittelSet).build();
				lebensmittelVerteilung.setOrganisation(organisation);
				organisation.addErstellteAktivitaeten(lebensmittelVerteilung);
				aktivitaetRepository.save(lebensmittelVerteilung);
			}
			if (!isAktivitaet2) {
				Ressource kleidung = new RessourceBuilder().name("Kleiderspenden")
						.beschreibung("Sortierte Spendenkleidung für Verteilung an Bedürftige.")
						.strasse("Posthofstraße").hausnummer("5").plz("4020").ort("Linz").vorname("Thomas")
						.nachname("Krenn").email("thomas.krenn@caritas.at").telefon("+43 732 654321")
						.materialien("Kleidung, Schuhe, Decken")
						.sicherheitsanforderungen("Saubere Arbeitskleidung, Handschuhe empfohlen")
						.anmerkung("Kleidung bitte vorsortieren nach Größe").build();

				Aktivitaet kleidersortierung = new AktivitaetBuilder().name("Kleiderspenden sortieren")
						.beschreibung("Sortieren und Verpacken von Kleiderspenden für Bedürftige.")
						.strasse("Industriezeile").hausnummer("47").plz("4020").ort("Linz").vorname("Birgit")
						.nachname("Leitner").email("birgit.leitner@caritas.at").telefon("+43 732 654322")
						.teilnehmeranzahl(8).transport("Keine notwendig").verpflegung("Mittagessen inkludiert")
						.startDatum(new GregorianCalendar(2025, Calendar.APRIL, 5))
						.endDatum(new GregorianCalendar(2025, Calendar.APRIL, 5))
						.startZeit(new GregorianCalendar(0, 0, 0, 10, 0)).endZeit(new GregorianCalendar(0, 0, 0, 16, 0))
						.ressource(kleidung).build();
				kleidersortierung.setOrganisation(organisation);
				organisation.addErstellteAktivitaeten(kleidersortierung);
				aktivitaetRepository.save(kleidersortierung);
			}
			if (!isAktivitaet3) {
				Ressource sozialberatung = new RessourceBuilder().name("Infomaterial Sozialberatung")
						.beschreibung("Materialien zur Unterstützung von Beratungen und Workshops.")
						.strasse("Landstraße").hausnummer("120").plz("4020").ort("Linz").vorname("Elisabeth")
						.nachname("Schmid").email("elisabeth.schmid@caritas.at").telefon("+43 732 789456")
						.materialien("Flyer, Broschüren, Roll-Ups")
						.sicherheitsanforderungen("Keine besonderen Anforderungen")
						.anmerkung("Wird zentral aus dem Büro geliefert").build();

				Aktivitaet sozialdienst = new AktivitaetBuilder().name("Sozialberatung unterstützen")
						.beschreibung("Begleitung von BeraterInnen bei Infoveranstaltungen.").strasse("Bürgerstraße")
						.hausnummer("20").plz("4020").ort("Linz").vorname("Michael").nachname("Hager")
						.email("michael.hager@caritas.at").telefon("+43 732 789457").teilnehmeranzahl(5)
						.transport("Öffi").verpflegung("Keine").startDatum(new GregorianCalendar(2025, Calendar.MAY, 2))
						.endDatum(new GregorianCalendar(2025, Calendar.MAY, 2))
						.startZeit(new GregorianCalendar(0, 0, 0, 13, 0)).endZeit(new GregorianCalendar(0, 0, 0, 17, 0))
						.ressource(sozialberatung).build();
				sozialdienst.setOrganisation(organisation);
				organisation.addErstellteAktivitaeten(sozialdienst);
				aktivitaetRepository.save(sozialdienst);
			}
		}
	}

	private void createRotesKreuzAktivitaeten() {
		Optional<Benutzer> rotesKreuzBenutzer = benutzerService.getOrganisationen().stream()
				.filter(org -> org.getName().equals("Österreichisches Rotes Kreuz")).findFirst();

		if (rotesKreuzBenutzer.isPresent()) {
			Benutzer organisation = rotesKreuzBenutzer.get();
			boolean isAktivitaet = !CollectionUtils.isEmpty(organisation.getErstellteAktivitaeten())
					&& organisation.getErstellteAktivitaeten().stream().filter(Objects::nonNull)
							.anyMatch(e -> e.getName().equals("Blutspendeaktion Linz"));
			boolean isAktivitaet2 = !CollectionUtils.isEmpty(organisation.getErstellteAktivitaeten())
					&& organisation.getErstellteAktivitaeten().stream().filter(Objects::nonNull)
							.anyMatch(e -> e.getName().equals("Erste-Hilfe-Training für Freiwillige"));
			boolean isAktivitaet3 = !CollectionUtils.isEmpty(organisation.getErstellteAktivitaeten())
					&& organisation.getErstellteAktivitaeten().stream().filter(Objects::nonNull)
							.anyMatch(e -> e.getName().equals("Infostand am Hauptplatz"));

			if (!isAktivitaet) {
				Ressource blutspende = new RessourceBuilder().name("Blutspendeausstattung")
						.beschreibung("Materialien für Blutspendeaktionen.").strasse("Harrachstraße").hausnummer("1")
						.plz("4020").ort("Linz").vorname("Peter").nachname("Lehner").email("peter.lehner@roteskreuz.at")
						.telefon("+43 732 987654").materialien("Liegen, Desinfektionsmittel, Getränke")
						.sicherheitsanforderungen("Ersthelferkurs empfohlen")
						.anmerkung("Geräte werden regelmäßig gewartet").build();

				Aktivitaet blutspendeAktion = new AktivitaetBuilder().name("Blutspendeaktion Linz")
						.beschreibung("HelferInnen unterstützen bei Registrierung und Betreuung von SpenderInnen.")
						.strasse("Bürgerstraße").hausnummer("26").plz("4020").ort("Linz").teilnehmeranzahl(12)
						.transport("Öffi").verpflegung("Jause vorhanden").vorname("Peter").nachname("Lehner")
						.email("peter.lehner@roteskreuz.at").telefon("+43 732 987654")
						.startDatum(new GregorianCalendar(2025, Calendar.JUNE, 14))
						.endDatum(new GregorianCalendar(2025, Calendar.JUNE, 14))
						.startZeit(new GregorianCalendar(0, 0, 0, 9, 0)).endZeit(new GregorianCalendar(0, 0, 0, 16, 0))
						.ressource(blutspende).build();

				blutspendeAktion.setOrganisation(organisation);
				organisation.addErstellteAktivitaeten(blutspendeAktion);
				aktivitaetRepository.save(blutspendeAktion);
			}

			if (!isAktivitaet2) {
				Ressource fahrzeug = new RessourceBuilder().name("Rettungsfahrzeug")
						.beschreibung("Notfallfahrzeug mit medizinischer Grundausstattung.").strasse("Gruberstraße")
						.hausnummer("45").plz("4020").ort("Linz").vorname("Katrin").nachname("Fischer")
						.email("katrin.fischer@roteskreuz.at").telefon("+43 732 222222")
						.materialien("Sanitätskoffer, Defibrillator, Trage")
						.sicherheitsanforderungen("Sanitäter-Ausbildung erforderlich")
						.anmerkung("Nur von geschultem Personal zu verwenden").build();

				Aktivitaet ersteHilfeTraining = new AktivitaetBuilder().name("Erste-Hilfe-Training für Freiwillige")
						.beschreibung("Schulung in lebensrettenden Sofortmaßnahmen.").strasse("Fadingerstraße")
						.hausnummer("27").plz("4020").ort("Linz").teilnehmeranzahl(20).transport("Individuell")
						.verpflegung("Getränke").vorname("Katrin").nachname("Fischer")
						.email("katrin.fischer@roteskreuz.at").telefon("+43 732 222222")
						.startDatum(new GregorianCalendar(2025, Calendar.JULY, 20))
						.endDatum(new GregorianCalendar(2025, Calendar.JULY, 20))
						.startZeit(new GregorianCalendar(0, 0, 0, 10, 0)).endZeit(new GregorianCalendar(0, 0, 0, 15, 0))
						.ressource(fahrzeug).build();

				ersteHilfeTraining.setOrganisation(organisation);
				organisation.addErstellteAktivitaeten(ersteHilfeTraining);
				aktivitaetRepository.save(ersteHilfeTraining);
			}

			if (!isAktivitaet3) {
				Ressource infostand = new RessourceBuilder().name("Infostand Rotes Kreuz")
						.beschreibung("Informationsstand für Öffentlichkeitsarbeit.").strasse("Mozartstraße")
						.hausnummer("6").plz("4020").ort("Linz").vorname("Julia").nachname("Wagner")
						.email("julia.wagner@roteskreuz.at").telefon("+43 732 333333")
						.materialien("Zelt, Tische, Flyer, Banner")
						.sicherheitsanforderungen("Keine besonderen Anforderungen")
						.anmerkung("Aufbau durch Freiwillige vor Ort").build();

				Aktivitaet infostandLinz = new AktivitaetBuilder().name("Infostand am Hauptplatz")
						.beschreibung("Aufklärung über Erste Hilfe und Freiwilligenarbeit.").strasse("Goethestraße")
						.hausnummer("17").plz("4020").ort("Linz").teilnehmeranzahl(6).transport("Öffi")
						.verpflegung("Keine").vorname("Julia").nachname("Wagner").email("julia.wagner@roteskreuz.at")
						.telefon("+43 732 333333").startDatum(new GregorianCalendar(2025, Calendar.AUGUST, 10))
						.endDatum(new GregorianCalendar(2025, Calendar.AUGUST, 10))
						.startZeit(new GregorianCalendar(0, 0, 0, 11, 0)).endZeit(new GregorianCalendar(0, 0, 0, 17, 0))
						.ressource(infostand).build();

				infostandLinz.setOrganisation(organisation);
				organisation.addErstellteAktivitaeten(infostandLinz);
				aktivitaetRepository.save(infostandLinz);
			}
		}
	}

	private void createBaumpatenschaftAktivitaeten() {
		Optional<Benutzer> baumpatenschaftBenutzer = benutzerService.getOrganisationen().stream()
				.filter(org -> org.getName().equals("Linzer Baumpatenschaft")).findFirst();

		if (baumpatenschaftBenutzer.isPresent()) {
			Benutzer organisation = baumpatenschaftBenutzer.get();
			boolean isAktivitaet = !CollectionUtils.isEmpty(organisation.getErstellteAktivitaeten())
					&& organisation.getErstellteAktivitaeten().stream().filter(Objects::nonNull)
							.anyMatch(e -> e.getName().equals("Baumpflanzaktion Frühling"));
			boolean isAktivitaet2 = !CollectionUtils.isEmpty(organisation.getErstellteAktivitaeten())
					&& organisation.getErstellteAktivitaeten().stream().filter(Objects::nonNull)
							.anyMatch(e -> e.getName().equals("Baumpflege im Sommer"));
			boolean isAktivitaet3 = !CollectionUtils.isEmpty(organisation.getErstellteAktivitaeten())
					&& organisation.getErstellteAktivitaeten().stream().filter(Objects::nonNull)
							.anyMatch(e -> e.getName().equals("Infotag Stadtbegrünung"));

			if (!isAktivitaet) {
				Ressource werkzeug = new RessourceBuilder().name("Pflanzwerkzeug")
						.beschreibung("Werkzeuge für Baumpflanzaktionen.").strasse("Volksgartenstraße").hausnummer("20")
						.plz("4020").ort("Linz").vorname("Florian").nachname("Maier")
						.email("florian.maier@baumpatenschaft.at").telefon("+43 732 444555")
						.materialien("Spaten, Gießkanne, Handschuhe")
						.sicherheitsanforderungen("Feste Schuhe, Gartenhandschuhe")
						.anmerkung("Werkzeug wird zentral bereitgestellt").build();

				Aktivitaet pflanzaktion = new AktivitaetBuilder().name("Baumpflanzaktion Frühling")
						.beschreibung("Pflanzen junger Bäume im Stadtpark gemeinsam mit Freiwilligen.")
						.strasse("Parkstraße").hausnummer("9").plz("4020").ort("Linz").teilnehmeranzahl(15)
						.transport("Öffi").verpflegung("Snacks & Wasser").vorname("Florian").nachname("Maier")
						.email("florian.maier@baumpatenschaft.at").telefon("+43 732 444555")
						.startDatum(new GregorianCalendar(2025, Calendar.APRIL, 15))
						.endDatum(new GregorianCalendar(2025, Calendar.APRIL, 15))
						.startZeit(new GregorianCalendar(0, 0, 0, 9, 0)).endZeit(new GregorianCalendar(0, 0, 0, 14, 0))
						.ressource(werkzeug).build();

				pflanzaktion.setOrganisation(organisation);
				organisation.addErstellteAktivitaeten(pflanzaktion);
				aktivitaetRepository.save(pflanzaktion);
			}

			if (!isAktivitaet2) {
				Ressource pflegeSet = new RessourceBuilder().name("Baumpflege-Set")
						.beschreibung("Material für Pflege bestehender Bäume.").strasse("Beethovengasse")
						.hausnummer("17").plz("4020").ort("Linz").vorname("Eva").nachname("Koller")
						.email("eva.koller@baumpatenschaft.at").telefon("+43 732 444556")
						.materialien("Gießkanne, Mulch, Düngemittel")
						.sicherheitsanforderungen("Schutzbrille bei Düngung empfohlen")
						.anmerkung("Nach Aktion bitte wieder abgeben").build();

				Aktivitaet baumpflege = new AktivitaetBuilder().name("Baumpflege im Sommer")
						.beschreibung("Pflege bestehender Stadtbäume und Bewässerung.").strasse("Museumstraße")
						.hausnummer("31").plz("4020").ort("Linz").teilnehmeranzahl(10).transport("Fahrrad möglich")
						.verpflegung("Wasser wird gestellt").vorname("Eva").nachname("Koller")
						.email("eva.koller@baumpatenschaft.at").telefon("+43 732 444556")
						.startDatum(new GregorianCalendar(2025, Calendar.JULY, 1))
						.endDatum(new GregorianCalendar(2025, Calendar.JULY, 1))
						.startZeit(new GregorianCalendar(0, 0, 0, 8, 30)).endZeit(new GregorianCalendar(0, 0, 0, 12, 0))
						.ressource(pflegeSet).build();

				baumpflege.setOrganisation(organisation);
				organisation.addErstellteAktivitaeten(baumpflege);
				aktivitaetRepository.save(baumpflege);
			}

			if (!isAktivitaet3) {
				Ressource infomaterial = new RessourceBuilder().name("Infomaterial Nachhaltigkeit")
						.beschreibung("Flyer und Poster zu Baumpatenschaft und Klimaschutz.").strasse("Promenade")
						.hausnummer("33").plz("4020").ort("Linz").vorname("Lukas").nachname("Wiesinger")
						.email("lukas.wiesinger@baumpatenschaft.at").telefon("+43 732 444557")
						.materialien("Flyer, Poster, Banner").sicherheitsanforderungen("Keine")
						.anmerkung("Für Infoveranstaltungen im Freien geeignet").build();

				Aktivitaet infotag = new AktivitaetBuilder().name("Infotag Stadtbegrünung")
						.beschreibung("Informationsstand zur Baumpatenschaft und Klimaschutz.")
						.strasse("Landwiedstraße").hausnummer("70").plz("4020").ort("Linz").teilnehmeranzahl(5)
						.transport("Öffi").verpflegung("Keine").vorname("Lukas").nachname("Wiesinger")
						.email("lukas.wiesinger@baumpatenschaft.at").telefon("+43 732 444557")
						.startDatum(new GregorianCalendar(2025, Calendar.SEPTEMBER, 12))
						.endDatum(new GregorianCalendar(2025, Calendar.SEPTEMBER, 12))
						.startZeit(new GregorianCalendar(0, 0, 0, 10, 0)).endZeit(new GregorianCalendar(0, 0, 0, 16, 0))
						.ressource(infomaterial).build();

				infotag.setOrganisation(organisation);
				organisation.addErstellteAktivitaeten(infotag);
				aktivitaetRepository.save(infotag);
			}
		}
	}

	private void createVolkshilfeAktivitaeten() {
		Optional<Benutzer> volkshilfeBenutzer = benutzerService.getOrganisationen().stream()
				.filter(org -> org.getName().equals("Volkshilfe Oberösterreich")).findFirst();

		if (volkshilfeBenutzer.isPresent()) {
			Benutzer organisation = volkshilfeBenutzer.get();
			boolean isAktivitaet = !CollectionUtils.isEmpty(organisation.getErstellteAktivitaeten())
					&& organisation.getErstellteAktivitaeten().stream().filter(Objects::nonNull)
							.anyMatch(e -> e.getName().equals("Besuchsdienst im Seniorenheim"));
			boolean isAktivitaet2 = !CollectionUtils.isEmpty(organisation.getErstellteAktivitaeten())
					&& organisation.getErstellteAktivitaeten().stream().filter(Objects::nonNull)
							.anyMatch(e -> e.getName().equals("Kinderworkshop - Kreatives Gestalten"));
			boolean isAktivitaet3 = !CollectionUtils.isEmpty(organisation.getErstellteAktivitaeten())
					&& organisation.getErstellteAktivitaeten().stream().filter(Objects::nonNull)
							.anyMatch(e -> e.getName().equals("Beratung zur Arbeitssuche"));

			if (!isAktivitaet) {
				Ressource pflegeMaterial = new RessourceBuilder().name("Pflegehilfsmittel")
						.beschreibung("Ausstattung für Betreuung in Pflegeeinrichtungen.").strasse("Gruberstraße")
						.hausnummer("45").plz("4020").ort("Linz").vorname("Andrea").nachname("Leitner")
						.email("andrea.leitner@volkshilfe.at").telefon("+43 732 555111")
						.materialien("Rollstühle, Pflegebetten, Erste-Hilfe-Set")
						.sicherheitsanforderungen("Pflegeerfahrung wünschenswert")
						.anmerkung("Nur für autorisiertes Personal").build();

				Aktivitaet seniorenBesuch = new AktivitaetBuilder().name("Besuchsdienst im Seniorenheim")
						.beschreibung("Zeit mit älteren Menschen verbringen und kleine Tätigkeiten übernehmen.")
						.strasse("Lederergasse").hausnummer("9").plz("4020").ort("Linz").teilnehmeranzahl(6)
						.transport("Öffi").verpflegung("Kaffee & Kuchen").vorname("Andrea").nachname("Leitner")
						.email("andrea.leitner@volkshilfe.at").telefon("+43 732 555111")
						.startDatum(new GregorianCalendar(2025, Calendar.MARCH, 8))
						.endDatum(new GregorianCalendar(2025, Calendar.MARCH, 8))
						.startZeit(new GregorianCalendar(0, 0, 0, 14, 0)).endZeit(new GregorianCalendar(0, 0, 0, 17, 0))
						.ressource(pflegeMaterial).build();

				seniorenBesuch.setOrganisation(organisation);
				organisation.addErstellteAktivitaeten(seniorenBesuch);
				aktivitaetRepository.save(seniorenBesuch);
			}

			if (!isAktivitaet2) {
				Ressource kindermaterial = new RessourceBuilder().name("Bastelmaterial")
						.beschreibung("Materialien für kreative Kinderworkshops.").strasse("Mozartstraße")
						.hausnummer("6").plz("4020").ort("Linz").vorname("Sarah").nachname("Kogler")
						.email("sarah.kogler@volkshilfe.at").telefon("+43 732 555112")
						.materialien("Papier, Farben, Scheren, Kleber")
						.sicherheitsanforderungen("Kinderaufsicht erforderlich")
						.anmerkung("Material aus Spendenbestand").build();

				Aktivitaet kinderworkshop = new AktivitaetBuilder().name("Kinderworkshop - Kreatives Gestalten")
						.beschreibung("Bastelnachmittag für Kinder aus betreuten Familien.").strasse("Humboldtstraße")
						.hausnummer("18").plz("4020").ort("Linz").teilnehmeranzahl(8).transport("Keine")
						.verpflegung("Snacks & Getränke").vorname("Sarah").nachname("Kogler")
						.email("sarah.kogler@volkshilfe.at").telefon("+43 732 555112")
						.startDatum(new GregorianCalendar(2025, Calendar.MAY, 18))
						.endDatum(new GregorianCalendar(2025, Calendar.MAY, 18))
						.startZeit(new GregorianCalendar(0, 0, 0, 13, 0)).endZeit(new GregorianCalendar(0, 0, 0, 17, 0))
						.ressource(kindermaterial).build();

				kinderworkshop.setOrganisation(organisation);
				organisation.addErstellteAktivitaeten(kinderworkshop);
				aktivitaetRepository.save(kinderworkshop);
			}

			if (!isAktivitaet3) {
				Ressource arbeitsberatung = new RessourceBuilder().name("Jobberatungsausstattung")
						.beschreibung("Arbeitsmittel für Jobcoaching und Bewerbungsunterstützung.")
						.strasse("Südtiroler Straße").hausnummer("31").plz("4020").ort("Linz").vorname("Martin")
						.nachname("Bauer").email("martin.bauer@volkshilfe.at").telefon("+43 732 555113")
						.materialien("Laptop, Drucker, Bewerbungsunterlagen")
						.sicherheitsanforderungen("Datenschutz beachten").anmerkung("Nur intern verwendbar").build();

				Aktivitaet jobhilfe = new AktivitaetBuilder().name("Beratung zur Arbeitssuche")
						.beschreibung("Begleitung von Menschen bei Bewerbungen und Jobcoaching.")
						.strasse("Nietzschestraße").hausnummer("31").plz("4020").ort("Linz").teilnehmeranzahl(4)
						.transport("Öffi").verpflegung("Keine").vorname("Martin").nachname("Bauer")
						.email("martin.bauer@volkshilfe.at").telefon("+43 732 555113")
						.startDatum(new GregorianCalendar(2025, Calendar.JUNE, 30))
						.endDatum(new GregorianCalendar(2025, Calendar.JUNE, 30))
						.startZeit(new GregorianCalendar(0, 0, 0, 9, 0)).endZeit(new GregorianCalendar(0, 0, 0, 13, 0))
						.ressource(arbeitsberatung).build();

				jobhilfe.setOrganisation(organisation);
				organisation.addErstellteAktivitaeten(jobhilfe);
				aktivitaetRepository.save(jobhilfe);
			}
		}
	}

	private void createJugendzentrumAktivitaeten() {
		Optional<Benutzer> jugendzentrenBenutzer = benutzerService.getOrganisationen().stream()
				.filter(org -> org.getName().equals("Verein Jugendzentren & Freizeit")).findFirst();

		if (jugendzentrenBenutzer.isPresent()) {
			Benutzer organisation = jugendzentrenBenutzer.get();
			boolean isAktivitaet = !CollectionUtils.isEmpty(organisation.getErstellteAktivitaeten())
					&& organisation.getErstellteAktivitaeten().stream().filter(Objects::nonNull)
							.anyMatch(e -> e.getName().equals("Jugendsporttag im Park"));
			boolean isAktivitaet2 = !CollectionUtils.isEmpty(organisation.getErstellteAktivitaeten())
					&& organisation.getErstellteAktivitaeten().stream().filter(Objects::nonNull)
							.anyMatch(e -> e.getName().equals("Musikworkshop für Jugendliche"));
			boolean isAktivitaet3 = !CollectionUtils.isEmpty(organisation.getErstellteAktivitaeten())
					&& organisation.getErstellteAktivitaeten().stream().filter(Objects::nonNull)
							.anyMatch(e -> e.getName().equals("Freiwilligentag im Jugendzentrum"));

			if (!isAktivitaet) {
				Ressource sportausstattung = new RessourceBuilder().name("Sportausrüstung")
						.beschreibung("Ausrüstung für Jugend-Sporttage.").strasse("Wiener Straße").hausnummer("131")
						.plz("4020").ort("Linz").vorname("Daniel").nachname("Pichler")
						.email("daniel.pichler@jugendzentrum.at").telefon("+43 732 666777")
						.materialien("Bälle, Netze, Trikots").sicherheitsanforderungen("Sporttaugliche Kleidung")
						.anmerkung("Nur bei trockenem Wetter nutzbar").build();

				Aktivitaet sporttag = new AktivitaetBuilder().name("Jugendsporttag im Park")
						.beschreibung("Gemeinsamer Sporttag mit Fußball und Volleyball.").strasse("Kudlichstraße")
						.hausnummer("25").plz("4020").ort("Linz").teilnehmeranzahl(25).transport("Selbstanreise")
						.verpflegung("Wasser & Obst").vorname("Daniel").nachname("Pichler")
						.email("daniel.pichler@jugendzentrum.at").telefon("+43 732 666777")
						.startDatum(new GregorianCalendar(2025, Calendar.APRIL, 20))
						.endDatum(new GregorianCalendar(2025, Calendar.APRIL, 20))
						.startZeit(new GregorianCalendar(0, 0, 0, 11, 0)).endZeit(new GregorianCalendar(0, 0, 0, 16, 0))
						.ressource(sportausstattung).build();

				sporttag.setOrganisation(organisation);
				organisation.addErstellteAktivitaeten(sporttag);
				aktivitaetRepository.save(sporttag);
			}

			if (!isAktivitaet2) {
				Ressource musikEquipment = new RessourceBuilder().name("Musik-Equipment")
						.beschreibung("Technik für Musikworkshops und Jugendveranstaltungen.").strasse("Herrenstraße")
						.hausnummer("19").plz("4020").ort("Linz").vorname("Johanna").nachname("Schuster")
						.email("johanna.schuster@jugendzentrum.at").telefon("+43 732 666778")
						.materialien("Lautsprecher, Mikrofone, Mischpult")
						.sicherheitsanforderungen("Kenntnisse in Tontechnik empfohlen")
						.anmerkung("Wird von Technikteam gewartet").build();

				Aktivitaet musikWorkshop = new AktivitaetBuilder().name("Musikworkshop für Jugendliche")
						.beschreibung("Musikproduktion mit regionalen KünstlerInnen.").strasse("Franckstraße")
						.hausnummer("45").plz("4020").ort("Linz").teilnehmeranzahl(12).transport("Keine")
						.verpflegung("Pizza & Getränke").vorname("Johanna").nachname("Schuster")
						.email("johanna.schuster@jugendzentrum.at").telefon("+43 732 666778")
						.startDatum(new GregorianCalendar(2025, Calendar.JULY, 12))
						.endDatum(new GregorianCalendar(2025, Calendar.JULY, 12))
						.startZeit(new GregorianCalendar(0, 0, 0, 10, 0)).endZeit(new GregorianCalendar(0, 0, 0, 14, 0))
						.ressource(musikEquipment).build();

				musikWorkshop.setOrganisation(organisation);
				organisation.addErstellteAktivitaeten(musikWorkshop);
				aktivitaetRepository.save(musikWorkshop);
			}

			if (!isAktivitaet3) {
				Ressource infostand = new RessourceBuilder().name("Infostand Jugendzentren")
						.beschreibung("Materialien für Öffentlichkeitsarbeit und Informationsstände.")
						.strasse("Stockhofstraße").hausnummer("9").plz("4020").ort("Linz").vorname("Lena")
						.nachname("Huber").email("lena.huber@jugendzentrum.at").telefon("+43 732 666779")
						.materialien("Tische, Banner, Flyer").sicherheitsanforderungen("Keine")
						.anmerkung("Für Freiwilligentage und Infoaktionen").build();

				Aktivitaet freiwilligentag = new AktivitaetBuilder().name("Freiwilligentag im Jugendzentrum")
						.beschreibung("Gemeinsame Aktionstag für Freiwillige, Basteln & Sport.")
						.strasse("Blumauerstraße").hausnummer("43").plz("4020").ort("Linz").teilnehmeranzahl(10)
						.transport("Öffi").verpflegung("Snacks & Getränke").vorname("Lena").nachname("Huber")
						.email("lena.huber@jugendzentrum.at").telefon("+43 732 666779")
						.startDatum(new GregorianCalendar(2025, Calendar.SEPTEMBER, 5))
						.endDatum(new GregorianCalendar(2025, Calendar.SEPTEMBER, 5))
						.startZeit(new GregorianCalendar(0, 0, 0, 10, 0)).endZeit(new GregorianCalendar(0, 0, 0, 15, 0))
						.ressource(infostand).build();

				freiwilligentag.setOrganisation(organisation);
				organisation.addErstellteAktivitaeten(freiwilligentag);
				aktivitaetRepository.save(freiwilligentag);
			}
		}
	}

	private void createFreiwillige() {
		List<Benutzer> freiwilligen = Optional.ofNullable(benutzerService.getFreiwillige())
				.orElse(Collections.emptyList());

		Aktivitaet aktivitaet = aktivitaetRepository.findAll().stream().filter(Objects::nonNull)
				.filter(e -> e.getName().equals("Lebensmittelverteilung an Bedürftige")).findAny().get();
		Aktivitaet aktivitaet2 = aktivitaetRepository.findAll().stream().filter(Objects::nonNull)
				.filter(e -> e.getName().equals("Kleiderspenden sortieren")).findAny().get();
		Aktivitaet aktivitaet3 = aktivitaetRepository.findAll().stream().filter(Objects::nonNull)
				.filter(e -> e.getName().equals("Sozialberatung unterstützen")).findAny().get();

		boolean muratExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Murat"));
		if (!muratExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("Murat").password("aaa").vorname("Murat")
					.nachname("Demir").geburtsDatum(new GregorianCalendar(1990, Calendar.MAY, 15))
					.email("murat.demir.1905@gmail.com").telefon("06501234567").beschreibung("Hallo ich bin Murat")
					.strasse("Nietzschestraße").hausnummer("40").plz("4020").ort("Linz")
					.verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.JANUARY, 1))
					.verfuegbarBisDatum(new GregorianCalendar(2026, Calendar.JANUARY, 1))
					.verfuegbarVonZeit(vormittagsZeitVon()).verfuegbarBisZeit(vormittagsZeitBis()).build();
			aktivitaet.addTeilnehmer(b);
		}

		boolean nerimanExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Neriman"));
		if (!nerimanExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("Neriman").password("aaa").vorname("Neriman")
					.nachname("Demir").geburtsDatum(new GregorianCalendar(1997, Calendar.APRIL, 5))
					.email("neriman.demir@example.com").telefon("06505551234")
					.beschreibung("Ich helfe gerne in sozialen Bereichen und bin sehr kommunikativ.")
					.strasse("Goethestraße").hausnummer("12").plz("4020").ort("Linz")
					.verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.FEBRUARY, 1))
					.verfuegbarBisDatum(new GregorianCalendar(2025, Calendar.DECEMBER, 31))
					.verfuegbarVonZeit(mittagsZeitVon()).verfuegbarBisZeit(mittagsZeitBis()).build();
			aktivitaet.addTeilnehmer(b);
		}

		boolean annaExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Anna"));
		if (!annaExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("Anna").password("aaa").vorname("Anna")
					.nachname("Huber").geburtsDatum(new GregorianCalendar(1998, Calendar.MARCH, 12))
					.email("anna.huber@example.com").telefon("06505551234")
					.beschreibung("Ich helfe gerne in sozialen Bereichen und bin sehr kommunikativ.")
					.strasse("Goethestraße").hausnummer("12").plz("4020").ort("Linz")
					.verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.FEBRUARY, 1))
					.verfuegbarBisDatum(new GregorianCalendar(2025, Calendar.DECEMBER, 31))
					.verfuegbarVonZeit(mittagsZeitVon()).verfuegbarBisZeit(mittagsZeitBis()).build();
			aktivitaet2.addTeilnehmer(b);
		}

		boolean lukasExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Lukas"));
		if (!lukasExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("Lukas").password("aaa").vorname("Lukas")
					.nachname("Wagner").geburtsDatum(new GregorianCalendar(1995, Calendar.JULY, 4))
					.email("lukas.wagner@example.com").telefon("06601234567")
					.beschreibung("Sportlicher junger Mann, der gerne mit anpackt.").strasse("Mozartstraße")
					.hausnummer("5").plz("4020").ort("Linz")
					.verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.JANUARY, 10))
					.verfuegbarBisDatum(new GregorianCalendar(2026, Calendar.APRIL, 1))
					.verfuegbarVonZeit(nachmittagsZeitVon()).verfuegbarBisZeit(nachmittagsZeitBis()).build();
			aktivitaet2.addTeilnehmer(b);
		}

		boolean sarahExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Sarah"));
		if (!sarahExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("Sarah").password("aaa").vorname("Sarah")
					.nachname("Leitner").geburtsDatum(new GregorianCalendar(2000, Calendar.JANUARY, 22))
					.email("sarah.leitner@example.com").telefon("06781234567")
					.beschreibung("Ich arbeite gerne mit Kindern und Tieren.").strasse("Hauptstraße").hausnummer("33")
					.plz("4020").ort("Linz").verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.MARCH, 5))
					.verfuegbarBisDatum(new GregorianCalendar(2026, Calendar.FEBRUARY, 20))
					.verfuegbarVonZeit(vormittagsZeitVon()).verfuegbarBisZeit(vormittagsZeitBis()).build();
			aktivitaet3.addTeilnehmer(b);
		}

		boolean davidExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("David"));
		if (!davidExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("David").password("aaa").vorname("David")
					.nachname("Schmid").geburtsDatum(new GregorianCalendar(1992, Calendar.SEPTEMBER, 18))
					.email("david.schmid@example.com").telefon("06504443322")
					.beschreibung("Technikbegeistert und hilfsbereit, besonders bei Veranstaltungen.")
					.strasse("Fadingerstraße").hausnummer("18").plz("4020").ort("Linz")
					.verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.APRIL, 1))
					.verfuegbarBisDatum(new GregorianCalendar(2026, Calendar.APRIL, 1))
					.verfuegbarVonZeit(mittagsZeitVon()).verfuegbarBisZeit(mittagsZeitBis()).build();
			aktivitaet3.addTeilnehmer(b);
		}

		Aktivitaet aktivitaet4 = aktivitaetRepository.findAll().stream().filter(Objects::nonNull)
				.filter(e -> e.getName().equals("Blutspendeaktion Linz")).findAny().get();
		Aktivitaet aktivitaet5 = aktivitaetRepository.findAll().stream().filter(Objects::nonNull)
				.filter(e -> e.getName().equals("Erste-Hilfe-Training für Freiwillige")).findAny().get();
		Aktivitaet aktivitaet6 = aktivitaetRepository.findAll().stream().filter(Objects::nonNull)
				.filter(e -> e.getName().equals("Infostand am Hauptplatz")).findAny().get();

		boolean juliaExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Julia"));
		if (!juliaExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("Julia").password("aaa").vorname("Julia")
					.nachname("Aigner").geburtsDatum(new GregorianCalendar(1999, Calendar.AUGUST, 9))
					.email("julia.aigner@example.com").telefon("06761239876")
					.beschreibung("Ruhige, freundliche Person, die gerne im sozialen Bereich unterstützt.")
					.strasse("Wiener Straße").hausnummer("101").plz("4020").ort("Linz")
					.verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.JANUARY, 15))
					.verfuegbarBisDatum(new GregorianCalendar(2026, Calendar.JANUARY, 15))
					.verfuegbarVonZeit(vormittagsZeitVon()).verfuegbarBisZeit(vormittagsZeitBis()).build();
			aktivitaet4.addTeilnehmer(b);
		}

		boolean mariaExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Maria"));
		if (!mariaExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("Maria").password("aaa").vorname("Maria")
					.nachname("Koller").geburtsDatum(new GregorianCalendar(1997, Calendar.APRIL, 3))
					.email("maria.koller@example.com").telefon("06507774411")
					.beschreibung("Engagierte Studentin, die gerne mit älteren Menschen arbeitet.")
					.strasse("Landstraße").hausnummer("45").plz("4020").ort("Linz")
					.verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.FEBRUARY, 5))
					.verfuegbarBisDatum(new GregorianCalendar(2026, Calendar.FEBRUARY, 5))
					.verfuegbarVonZeit(mittagsZeitVon()).verfuegbarBisZeit(mittagsZeitBis()).build();
			aktivitaet4.addTeilnehmer(b);
		}

		boolean benjaminExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Benjamin"));
		if (!benjaminExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("Benjamin").password("aaa")
					.vorname("Benjamin").nachname("Maier")
					.geburtsDatum(new GregorianCalendar(1999, Calendar.JANUARY, 9)).email("benjamin.maier@example.com")
					.telefon("06765553322").beschreibung("Hilft gerne bei körperlichen Aufgaben und liebt Teamarbeit.")
					.strasse("Wankmüllerhofstraße").hausnummer("22").plz("4020").ort("Linz")
					.verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.MARCH, 10))
					.verfuegbarBisDatum(new GregorianCalendar(2026, Calendar.MARCH, 10))
					.verfuegbarVonZeit(nachmittagsZeitVon()).verfuegbarBisZeit(nachmittagsZeitBis()).build();
			aktivitaet5.addTeilnehmer(b);
		}

		boolean lauraExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Laura"));
		if (!lauraExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("Laura").password("aaa").vorname("Laura")
					.nachname("Schuster").geburtsDatum(new GregorianCalendar(2001, Calendar.JUNE, 29))
					.email("laura.schuster@example.com").telefon("06503334455")
					.beschreibung("Kreative junge Frau, die gerne bei Veranstaltungen unterstützt.")
					.strasse("Kärntner Straße").hausnummer("8").plz("4020").ort("Linz")
					.verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.JANUARY, 20))
					.verfuegbarBisDatum(new GregorianCalendar(2026, Calendar.JANUARY, 20))
					.verfuegbarVonZeit(vormittagsZeitVon()).verfuegbarBisZeit(vormittagsZeitBis()).build();
			aktivitaet5.addTeilnehmer(b);
		}

		boolean jonasExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Jonas"));
		if (!jonasExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("Jonas").password("aaa").vorname("Jonas")
					.nachname("Hartl").geburtsDatum(new GregorianCalendar(1996, Calendar.OCTOBER, 5))
					.email("jonas.hartl@example.com").telefon("06770001122")
					.beschreibung("Technikaffiner Helfer, der gerne improvisiert.").strasse("Museumstraße")
					.hausnummer("3").plz("4020").ort("Linz")
					.verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.APRIL, 15))
					.verfuegbarBisDatum(new GregorianCalendar(2026, Calendar.MARCH, 15))
					.verfuegbarVonZeit(nachmittagsZeitVon()).verfuegbarBisZeit(nachmittagsZeitBis()).build();
			aktivitaet6.addTeilnehmer(b);
		}

		boolean katharinaExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Katharina"));
		if (!katharinaExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("Katharina").password("aaa")
					.vorname("Katharina").nachname("Stadlmayr")
					.geburtsDatum(new GregorianCalendar(1993, Calendar.DECEMBER, 13))
					.email("katharina.stadlmayr@example.com").telefon("06765557788")
					.beschreibung("Geduldig und freundlich, unterstützt gerne Kinder und Familien.")
					.strasse("Hafenstraße").hausnummer("70").plz("4020").ort("Linz")
					.verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.JUNE, 1))
					.verfuegbarBisDatum(new GregorianCalendar(2026, Calendar.JUNE, 1))
					.verfuegbarVonZeit(vormittagsZeitVon()).verfuegbarBisZeit(vormittagsZeitBis()).build();
			aktivitaet6.addTeilnehmer(b);
		}

		Aktivitaet aktivitaet7 = aktivitaetRepository.findAll().stream().filter(Objects::nonNull)
				.filter(e -> e.getName().equals("Baumpflanzaktion Frühling")).findAny().get();
		Aktivitaet aktivitaet8 = aktivitaetRepository.findAll().stream().filter(Objects::nonNull)
				.filter(e -> e.getName().equals("Baumpflege im Sommer")).findAny().get();
		Aktivitaet aktivitaet9 = aktivitaetRepository.findAll().stream().filter(Objects::nonNull)
				.filter(e -> e.getName().equals("Infotag Stadtbegrünung")).findAny().get();

		boolean thomasExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Thomas"));
		if (!thomasExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("Thomas").password("aaa").vorname("Thomas")
					.nachname("Bauer").geburtsDatum(new GregorianCalendar(1988, Calendar.MAY, 17))
					.email("thomas.bauer@example.com").telefon("06601112233")
					.beschreibung("Ruhiger, verlässlicher Helfer mit viel Erfahrung.").strasse("Garnisonstraße")
					.hausnummer("14").plz("4020").ort("Linz")
					.verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.JANUARY, 5))
					.verfuegbarBisDatum(new GregorianCalendar(2026, Calendar.JANUARY, 5))
					.verfuegbarVonZeit(mittagsZeitVon()).verfuegbarBisZeit(mittagsZeitBis()).build();
			aktivitaet7.addTeilnehmer(b);
		}

		boolean ninaExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Nina"));
		if (!ninaExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("Nina").password("aaa").vorname("Nina")
					.nachname("Wolf").geburtsDatum(new GregorianCalendar(2002, Calendar.FEBRUARY, 8))
					.email("nina.wolf@example.com").telefon("06781230987")
					.beschreibung("Aufgeschlossene junge Frau, die gerne im Team arbeitet.").strasse("Ferihumerstraße")
					.hausnummer("27").plz("4020").ort("Linz")
					.verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.MARCH, 25))
					.verfuegbarBisDatum(new GregorianCalendar(2026, Calendar.MARCH, 25))
					.verfuegbarVonZeit(vormittagsZeitVon()).verfuegbarBisZeit(vormittagsZeitBis()).build();
			aktivitaet7.addTeilnehmer(b);
		}

		boolean patrickExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Patrick"));
		if (!patrickExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("Patrick").password("aaa").vorname("Patrick")
					.nachname("Steiner").geburtsDatum(new GregorianCalendar(1991, Calendar.SEPTEMBER, 30))
					.email("patrick.steiner@example.com").telefon("06605556677")
					.beschreibung("Outdoorliebhaber, der gerne körperliche Arbeit erledigt.").strasse("Industriezeile")
					.hausnummer("90").plz("4020").ort("Linz")
					.verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.APRIL, 2))
					.verfuegbarBisDatum(new GregorianCalendar(2026, Calendar.APRIL, 2))
					.verfuegbarVonZeit(mittagsZeitVon()).verfuegbarBisZeit(mittagsZeitBis()).build();
			aktivitaet8.addTeilnehmer(b);
		}

		boolean sophieExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Sophie"));
		if (!sophieExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("Sophie").password("aaa").vorname("Sophie")
					.nachname("Holzer").geburtsDatum(new GregorianCalendar(1999, Calendar.APRIL, 19))
					.email("sophie.holzer@example.com").telefon("06775551234")
					.beschreibung("Kunstinteressierte Helferin, die gerne kreativ unterstützt.")
					.strasse("Auerspergstraße").hausnummer("19").plz("4020").ort("Linz")
					.verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.JULY, 10))
					.verfuegbarBisDatum(new GregorianCalendar(2026, Calendar.JULY, 10))
					.verfuegbarVonZeit(vormittagsZeitVon()).verfuegbarBisZeit(vormittagsZeitBis()).build();
			aktivitaet8.addTeilnehmer(b);
		}

		boolean danielExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Daniel"));
		if (!danielExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("Daniel").password("aaa").vorname("Daniel")
					.nachname("Weber").geburtsDatum(new GregorianCalendar(1990, Calendar.MARCH, 14))
					.email("daniel.weber@example.com").telefon("06504445566")
					.beschreibung("Sehr zuverlässig, hilft gerne bei Organisation und Planung.").strasse("Pfarrplatz")
					.hausnummer("6").plz("4020").ort("Linz")
					.verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.SEPTEMBER, 1))
					.verfuegbarBisDatum(new GregorianCalendar(2026, Calendar.SEPTEMBER, 1))
					.verfuegbarVonZeit(mittagsZeitVon()).verfuegbarBisZeit(mittagsZeitBis()).build();
			aktivitaet9.addTeilnehmer(b);
		}

		boolean elenaExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Elena"));
		if (!elenaExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("Elena").password("aaa").vorname("Elena")
					.nachname("Brandl").geburtsDatum(new GregorianCalendar(1998, Calendar.JULY, 2))
					.email("elena.brandl@example.com").telefon("06761230011")
					.beschreibung("Naturverbundene Helferin, die gerne mit anpackt.").strasse("Bismarckstraße")
					.hausnummer("16").plz("4020").ort("Linz")
					.verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.MAY, 2))
					.verfuegbarBisDatum(new GregorianCalendar(2026, Calendar.MAY, 2))
					.verfuegbarVonZeit(mittagsZeitVon()).verfuegbarBisZeit(mittagsZeitBis()).build();
			aktivitaet9.addTeilnehmer(b);
		}

		Aktivitaet aktivitaet10 = aktivitaetRepository.findAll().stream().filter(Objects::nonNull)
				.filter(e -> e.getName().equals("Besuchsdienst im Seniorenheim")).findAny().get();
		Aktivitaet aktivitaet11 = aktivitaetRepository.findAll().stream().filter(Objects::nonNull)
				.filter(e -> e.getName().equals("Kinderworkshop - Kreatives Gestalten")).findAny().get();
		Aktivitaet aktivitaet12 = aktivitaetRepository.findAll().stream().filter(Objects::nonNull)
				.filter(e -> e.getName().equals("Beratung zur Arbeitssuche")).findAny().get();

		boolean matthiasExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Matthias"));
		if (!matthiasExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("Matthias").password("aaa")
					.vorname("Matthias").nachname("Hager").geburtsDatum(new GregorianCalendar(1993, Calendar.MARCH, 21))
					.email("matthias.hager@example.com").telefon("06507773344")
					.beschreibung("Teamorientierter Helfer mit viel Motivation.").strasse("Hamerlingstraße")
					.hausnummer("41").plz("4020").ort("Linz")
					.verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.JUNE, 12))
					.verfuegbarBisDatum(new GregorianCalendar(2026, Calendar.JUNE, 12))
					.verfuegbarVonZeit(nachmittagsZeitVon()).verfuegbarBisZeit(nachmittagsZeitBis()).build();
			aktivitaet10.addTeilnehmer(b);
		}

		boolean evaExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Eva"));
		if (!evaExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("Eva").password("aaa").vorname("Eva")
					.nachname("Schober").geburtsDatum(new GregorianCalendar(1997, Calendar.DECEMBER, 5))
					.email("eva.schober@example.com").telefon("06781112233")
					.beschreibung("Lebhafte und hilfsbereite Person, die gerne organisiert.").strasse("Schillerstraße")
					.hausnummer("23").plz("4020").ort("Linz")
					.verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.AUGUST, 1))
					.verfuegbarBisDatum(new GregorianCalendar(2026, Calendar.AUGUST, 1))
					.verfuegbarVonZeit(vormittagsZeitVon()).verfuegbarBisZeit(vormittagsZeitBis()).build();
			aktivitaet10.addTeilnehmer(b);
		}

		boolean simonExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Simon"));
		if (!simonExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("Simon").password("aaa").vorname("Simon")
					.nachname("Pfister").geburtsDatum(new GregorianCalendar(1990, Calendar.APRIL, 30))
					.email("simon.pfister@example.com").telefon("06607778899")
					.beschreibung("Ruhiger, analytischer Helfer, der gerne unterstützt.").strasse("Rudolfstraße")
					.hausnummer("4").plz("4020").ort("Linz")
					.verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.SEPTEMBER, 10))
					.verfuegbarBisDatum(new GregorianCalendar(2026, Calendar.SEPTEMBER, 10))
					.verfuegbarVonZeit(mittagsZeitVon()).verfuegbarBisZeit(mittagsZeitBis()).build();
			aktivitaet11.addTeilnehmer(b);
		}

		boolean hannahExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Hannah"));
		if (!hannahExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("Hannah").password("aaa").vorname("Hannah")
					.nachname("Reiter").geburtsDatum(new GregorianCalendar(2003, Calendar.JANUARY, 16))
					.email("hannah.reiter@example.com").telefon("06501114455")
					.beschreibung("Jung, motiviert und sehr kommunikativ.").strasse("Harrachstraße").hausnummer("32")
					.plz("4020").ort("Linz").verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.JULY, 3))
					.verfuegbarBisDatum(new GregorianCalendar(2026, Calendar.JULY, 3))
					.verfuegbarVonZeit(vormittagsZeitVon()).verfuegbarBisZeit(vormittagsZeitBis()).build();
			aktivitaet11.addTeilnehmer(b);
		}

		boolean florianExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Florian"));
		if (!florianExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("Florian").password("aaa").vorname("Florian")
					.nachname("Eder").geburtsDatum(new GregorianCalendar(1999, Calendar.SEPTEMBER, 7))
					.email("florian.eder@example.com").telefon("06768889900")
					.beschreibung("Engagierter junger Mann, der gerne praktisch hilft und stets motiviert ist.")
					.strasse("Stockhofstraße").hausnummer("12").plz("4020").ort("Linz")
					.verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.APRIL, 10))
					.verfuegbarBisDatum(new GregorianCalendar(2026, Calendar.APRIL, 10))
					.verfuegbarVonZeit(nachmittagsZeitVon()).verfuegbarBisZeit(nachmittagsZeitBis()).build();
			aktivitaet12.addTeilnehmer(b);
		}

		boolean mayaExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Maya"));
		if (!mayaExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("Maya").password("aaa").vorname("Maya")
					.nachname("Ertl").geburtsDatum(new GregorianCalendar(1994, Calendar.SEPTEMBER, 27))
					.email("maya.ertl@example.com").telefon("06765553311")
					.beschreibung("Hilfsbereite, offene Person, die gerne Verantwortung übernimmt.")
					.strasse("Kellergasse").hausnummer("13").plz("4020").ort("Linz")
					.verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.APRIL, 7))
					.verfuegbarBisDatum(new GregorianCalendar(2026, Calendar.APRIL, 7))
					.verfuegbarVonZeit(vormittagsZeitVon()).verfuegbarBisZeit(vormittagsZeitBis()).build();
			aktivitaet12.addTeilnehmer(b);
		}

		Aktivitaet aktivitaet13 = aktivitaetRepository.findAll().stream().filter(Objects::nonNull)
				.filter(e -> e.getName().equals("Jugendsporttag im Park")).findAny().get();
		Aktivitaet aktivitaet14 = aktivitaetRepository.findAll().stream().filter(Objects::nonNull)
				.filter(e -> e.getName().equals("Musikworkshop für Jugendliche")).findAny().get();
		Aktivitaet aktivitaet15 = aktivitaetRepository.findAll().stream().filter(Objects::nonNull)
				.filter(e -> e.getName().equals("Freiwilligentag im Jugendzentrum")).findAny().get();

		boolean sebastianExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Sebastian"));
		if (!sebastianExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("Sebastian").password("aaa")
					.vorname("Sebastian").nachname("Lindner")
					.geburtsDatum(new GregorianCalendar(1987, Calendar.JUNE, 6)).email("sebastian.lindner@example.com")
					.telefon("06602221144").beschreibung("Verlässlicher, praktisch veranlagter Helfer.")
					.strasse("Untere Donaulände").hausnummer("55").plz("4020").ort("Linz")
					.verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.JANUARY, 25))
					.verfuegbarBisDatum(new GregorianCalendar(2026, Calendar.JANUARY, 25))
					.verfuegbarVonZeit(nachmittagsZeitVon()).verfuegbarBisZeit(nachmittagsZeitBis()).build();
			aktivitaet13.addTeilnehmer(b);
		}

		boolean claraExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Clara"));
		if (!claraExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("Clara").password("aaa").vorname("Clara")
					.nachname("Moser").geburtsDatum(new GregorianCalendar(2001, Calendar.FEBRUARY, 2))
					.email("clara.moser@example.com").telefon("06770005544")
					.beschreibung("Junge, kreative Helferin, die gerne neue Ideen einbringt.")
					.strasse("Elisabethstraße").hausnummer("21").plz("4020").ort("Linz")
					.verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.FEBRUARY, 18))
					.verfuegbarBisDatum(new GregorianCalendar(2026, Calendar.FEBRUARY, 18))
					.verfuegbarVonZeit(mittagsZeitVon()).verfuegbarBisZeit(mittagsZeitBis()).build();
			aktivitaet13.addTeilnehmer(b);
		}

		boolean oliverExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Oliver"));
		if (!oliverExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("Oliver").password("aaa").vorname("Oliver")
					.nachname("Berger").geburtsDatum(new GregorianCalendar(1992, Calendar.NOVEMBER, 23))
					.email("oliver.berger@example.com").telefon("06502223344")
					.beschreibung("Technisch versierter Helfer, der gerne Probleme löst.").strasse("Gruberstraße")
					.hausnummer("9").plz("4020").ort("Linz")
					.verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.MARCH, 30))
					.verfuegbarBisDatum(new GregorianCalendar(2026, Calendar.MARCH, 30))
					.verfuegbarVonZeit(nachmittagsZeitVon()).verfuegbarBisZeit(nachmittagsZeitBis()).build();
			aktivitaet14.addTeilnehmer(b);
		}

		boolean selinaExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Selina"));
		if (!selinaExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("Selina").password("aaa").vorname("Selina")
					.nachname("Hofer").geburtsDatum(new GregorianCalendar(1998, Calendar.MAY, 11))
					.email("selina.hofer@example.com").telefon("06761112200")
					.beschreibung("Sozial engagierte Helferin, die sehr empathisch ist.").strasse("Seilerstätte")
					.hausnummer("30").plz("4020").ort("Linz")
					.verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.AUGUST, 5))
					.verfuegbarBisDatum(new GregorianCalendar(2026, Calendar.AUGUST, 5))
					.verfuegbarVonZeit(vormittagsZeitVon()).verfuegbarBisZeit(vormittagsZeitBis()).build();
			aktivitaet14.addTeilnehmer(b);
		}

		boolean fabianExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Fabian"));
		if (!fabianExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("Fabian").password("aaa").vorname("Fabian")
					.nachname("Egger").geburtsDatum(new GregorianCalendar(1995, Calendar.APRIL, 26))
					.email("fabian.egger@example.com").telefon("06504442211")
					.beschreibung("Motivierter Helfer mit Organisationstalent.").strasse("Blumauerstraße")
					.hausnummer("18").plz("4020").ort("Linz")
					.verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.JULY, 14))
					.verfuegbarBisDatum(new GregorianCalendar(2026, Calendar.JULY, 14))
					.verfuegbarVonZeit(mittagsZeitVon()).verfuegbarBisZeit(mittagsZeitBis()).build();
			aktivitaet15.addTeilnehmer(b);
		}

		boolean jasminExists = freiwilligen.stream().filter(Objects::nonNull).map(Benutzer::getVorname)
				.filter(Objects::nonNull).anyMatch(name -> name.equalsIgnoreCase("Jasmin"));
		if (!jasminExists) {
			Benutzer b = new FreiwilligenBuilder(benutzerRepository).login("Jasmin").password("aaa").vorname("Jasmin")
					.nachname("Feichtner").geburtsDatum(new GregorianCalendar(2000, Calendar.JANUARY, 28))
					.email("jasmin.feichtner@example.com").telefon("06769993322")
					.beschreibung("Freundliche und engagierte Helferin, die gerne Menschen unterstützt.")
					.strasse("Bethlehemstraße").hausnummer("44").plz("4020").ort("Linz")
					.verfuegbarVonDatum(new GregorianCalendar(2025, Calendar.SEPTEMBER, 3))
					.verfuegbarBisDatum(new GregorianCalendar(2026, Calendar.SEPTEMBER, 3))
					.verfuegbarVonZeit(vormittagsZeitVon()).verfuegbarBisZeit(vormittagsZeitBis()).build();
			aktivitaet15.addTeilnehmer(b);
		}

	}

	private GregorianCalendar vormittagsZeitVon() {
		GregorianCalendar c = new GregorianCalendar();
		c.set(Calendar.HOUR_OF_DAY, 7);
		c.set(Calendar.MINUTE, 0);
		c.set(Calendar.SECOND, 0);
		return c;
	}

	private GregorianCalendar vormittagsZeitBis() {
		GregorianCalendar c = new GregorianCalendar();
		c.set(Calendar.HOUR_OF_DAY, 11);
		c.set(Calendar.MINUTE, 30);
		c.set(Calendar.SECOND, 0);
		return c;
	}

	private GregorianCalendar mittagsZeitVon() {
		GregorianCalendar c = new GregorianCalendar();
		c.set(Calendar.HOUR_OF_DAY, 11);
		c.set(Calendar.MINUTE, 30);
		c.set(Calendar.SECOND, 0);
		return c;
	}

	private GregorianCalendar mittagsZeitBis() {
		GregorianCalendar c = new GregorianCalendar();
		c.set(Calendar.HOUR_OF_DAY, 13);
		c.set(Calendar.MINUTE, 15);
		c.set(Calendar.SECOND, 0);
		return c;
	}

	private GregorianCalendar nachmittagsZeitVon() {
		GregorianCalendar c = new GregorianCalendar();
		c.set(Calendar.HOUR_OF_DAY, 13);
		c.set(Calendar.MINUTE, 00);
		c.set(Calendar.SECOND, 0);
		return c;
	}

	private GregorianCalendar nachmittagsZeitBis() {
		GregorianCalendar c = new GregorianCalendar();
		c.set(Calendar.HOUR_OF_DAY, 16);
		c.set(Calendar.MINUTE, 45);
		c.set(Calendar.SECOND, 0);
		return c;
	}

}
