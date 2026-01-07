package at.geovolunteer.service;

import java.util.Calendar;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import at.geovolunteer.model.AbstractAktivitaet;
import at.geovolunteer.model.Aktivitaet;
import at.geovolunteer.model.Benutzer;
import at.geovolunteer.model.Ressource;
import at.geovolunteer.model.Rolle;
import at.geovolunteer.model.repo.AktivitaetRepository;

@Service
public class AktivitaetService {

	@Autowired
	private AktivitaetRepository repository;

	@Autowired
	private BenutzerService benutzerService;

	@Transactional
	public Aktivitaet update(Aktivitaet model) {
		Aktivitaet entity = getOrCreate(model);
		Benutzer benutzer = benutzerService.getOrganisation();
		entity.setOrganisation(benutzer);
		benutzer.addErstellteAktivitaeten(entity);
		return repository.save(entity);
	}

	public List<Aktivitaet> getLaufendeAktivitaeten() {
		return getFilteredAktivitaeten(this::isAktivitaetLaufend);
	}

	public List<Aktivitaet> getBevorstehendeAktivitaeten() {
		return getFilteredAktivitaeten(this::istAktivitaetBevorstehend);
	}

	public List<Aktivitaet> getAbgeschlosseneAktivitaeten() {
		return getFilteredAktivitaeten(this::istAktivitaetAbgeschlossen);
	}

	public List<Aktivitaet> getFilteredAktivitaeten(Predicate<Aktivitaet> filter) {
		Benutzer benutzer = benutzerService.getActive();

		if (benutzer.isOrganisation()) {
			return benutzer.getErstellteAktivitaeten().stream().filter(filter).collect(Collectors.toList());
		} else if (benutzer.isFreiwillige()) {
			return benutzer.getTeilnahmen().stream().filter(filter).collect(Collectors.toList());
		} else {
			throw new IllegalArgumentException("Not implemented!");
		}
	}

	public List<Aktivitaet> getAktivitaeten() {
		return benutzerService.getOrganisationen().stream().flatMap(e -> e.getErstellteAktivitaeten().stream())
				.filter(e -> !istAktivitaetAbgeschlossen(e))
				.filter(e -> e.getTeilnehmer().size() <= e.getTeilnehmeranzahl()).filter(e -> e.getTeilnehmer().stream()
						.noneMatch(b -> b.getId() == benutzerService.getActive().getId()))
				.collect(Collectors.toList());
	}

	public List<Aktivitaet> getLaufendeUndBevorstehendeAktivitaeten() {
		return Stream.concat(getLaufendeAktivitaeten().stream(), getBevorstehendeAktivitaeten().stream())
				.collect(Collectors.toList());
	}

	public List<Aktivitaet> getAllAktivitaeten() {
		return repository.findAll();
	}

	public boolean isAktivitaetLaufend(Aktivitaet akt) {
		return !istAktivitaetBevorstehend(akt) && !istAktivitaetAbgeschlossen(akt);
	}

	public boolean istAktivitaetAbgeschlossen(Aktivitaet akt) {
		Calendar jetzt = getJetztZeitpunkt();
		Calendar endZeitpunkt = getZeitpunkt(akt.getEndDatum(), akt.getEndZeit());
		return jetzt.after(endZeitpunkt);
	}

	public boolean istAktivitaetBevorstehend(Aktivitaet akt) {
		Calendar jetzt = getJetztZeitpunkt();
		Calendar startZeitpunkt = getZeitpunkt(akt.getStartDatum(), akt.getStartZeit());
		return jetzt.before(startZeitpunkt);
	}

	private Calendar getZeitpunkt(Calendar datum, Calendar zeit) {
		Calendar c = (Calendar) datum.clone();
		c.set(Calendar.HOUR_OF_DAY, zeit.get(Calendar.HOUR_OF_DAY));
		c.set(Calendar.MINUTE, zeit.get(Calendar.MINUTE));
		c.set(Calendar.SECOND, zeit.get(Calendar.SECOND));
		c.set(Calendar.MILLISECOND, 0);
		return c;
	}

	private Calendar getJetztZeitpunkt() {
		Calendar c = Calendar.getInstance();
		c.set(Calendar.MILLISECOND, 0);
		return c;
	}

	public Optional<Aktivitaet> getById(Long id) {
		if (id == null) {
			return Optional.empty();
		}
		return repository.findById(id);
	}

	public void delete(Long id) throws Exception {
		Optional<Aktivitaet> optional = getById(id);
		if (optional.isPresent()) {
			Aktivitaet entity = optional.get();
			if (!CollectionUtils.isEmpty(entity.getTeilnehmer())) {
				entity.getTeilnehmer().clear();
			}
			if (entity.getRessource() != null) {
				repository.deleteById(entity.getRessource().getId());
			}
			repository.deleteById(id);
		} else {
			throw new Exception("Aktivität nicht gefunden - ID: " + id);
		}
	}

	public boolean addTeilnehmer(Long id) {
		Benutzer benutzer = benutzerService.getActive();
		Optional<Aktivitaet> aktivitaet = getById(id);

		if (Rolle.FREIWILLIGE.equals(benutzer.getRolle()) && aktivitaet.isPresent()) {
			Aktivitaet entity = aktivitaet.get();
			boolean isNotTeilnehmer = aktivitaet.get().getTeilnehmer().stream()
					.noneMatch(b -> b.getId() == benutzer.getId());
			if (isNotTeilnehmer) {
				entity.addTeilnehmer(benutzer);
				repository.saveAndFlush(entity);
				return true;
			}
		}
		return false;
	}

	public boolean removeTeilnehmer(Long id) {
		Benutzer benutzer = benutzerService.getActive();
		Optional<Aktivitaet> aktivitaet = getById(id);

		if (Rolle.FREIWILLIGE.equals(benutzer.getRolle()) && aktivitaet.isPresent()) {
			Aktivitaet entity = aktivitaet.get();
			boolean isTeilnehmer = !aktivitaet.get().getTeilnehmer().stream()
					.noneMatch(b -> b.getId() == benutzer.getId());
			if (isTeilnehmer) {
				entity.removeTeilnehmer(benutzer);
				repository.saveAndFlush(entity);
				return true;
			}
		}
		return false;
	}

	private Aktivitaet getOrCreate(Aktivitaet model) {
		Aktivitaet entity = model.getId() == null ? new Aktivitaet()
				: getById(model.getId()).orElseThrow(
						() -> new NoSuchElementException("Aktivität nicht gefunden. ID: " + model.getId()));

		updateDefaultValues(entity, model);
		entity.setTeilnehmeranzahl(model.getTeilnehmeranzahl());
		entity.setTransport(model.getTransport());
		entity.setVerpflegung(model.getVerpflegung());
		entity.setKategorie(model.getKategorie());
		if (!isStartZeitpunktBeforeEndZeitpunkt(model)) {
			throw new IllegalArgumentException("Start-Zeitpunkt ist nach End-Zeitpunkt");
		}
		entity.setStartDatum(model.getStartDatum());
		entity.setEndDatum(model.getEndDatum());
		entity.setStartZeit(model.getStartZeit());
		entity.setEndZeit(model.getEndZeit());

		Ressource ressource;
		if (entity.getRessource() == null || entity.getRessource().getId() == null) {
			ressource = new Ressource();
			entity.setRessource(ressource);
		} else {
			ressource = entity.getRessource();
		}
		updateDefaultValues(ressource, model.getRessource());
		ressource.setMaterialien(model.getRessource().getMaterialien());
		ressource.setSicherheitsanforderungen(model.getRessource().getSicherheitsanforderungen());
		ressource.setAnmerkung(model.getRessource().getAnmerkung());
		return entity;
	}

	private void updateDefaultValues(AbstractAktivitaet entity, AbstractAktivitaet model) {
		entity.setName(model.getName());
		entity.setBeschreibung(model.getBeschreibung());
		entity.setStrasse(model.getStrasse());
		entity.setHausnummer(model.getHausnummer());
		entity.setPlz(model.getPlz());
		entity.setOrt(model.getOrt());
		entity.setShape(model.getShape());
		entity.setRadius(model.getRadius());
		entity.setVorname(model.getVorname());
		entity.setNachname(model.getNachname());
		entity.setEmail(model.getEmail());
		entity.setTelefon(model.getTelefon());
	}

	private boolean isStartZeitpunktBeforeEndZeitpunkt(Aktivitaet model) {
		Calendar startZeitpunkt = getZeitpunkt(model.getStartDatum(), model.getStartZeit());
		Calendar endZeitpunkt = getZeitpunkt(model.getEndDatum(), model.getEndZeit());
		return startZeitpunkt.before(endZeitpunkt);
	}

}
