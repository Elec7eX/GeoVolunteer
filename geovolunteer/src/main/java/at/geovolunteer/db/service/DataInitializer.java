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
						.beschreibung("Schulung in lebensrettenden Sofortmaßnahmen.").strasse("Dinghoferstraße")
						.hausnummer("48").plz("4020").ort("Linz").teilnehmeranzahl(20).transport("Individuell")
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

}
