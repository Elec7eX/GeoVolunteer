package at.geovolunteer.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import at.geovolunteer.model.AbstractAktivitaet;
import at.geovolunteer.model.Aktivitaet;
import at.geovolunteer.model.Benutzer;
import at.geovolunteer.model.Ressource;
import at.geovolunteer.model.repo.AktivitaetRepository;

@Service
public class AktivitaetService {

	@Autowired
	private AktivitaetRepository repository;

	@Autowired
	private BenutzerService benutzerService;

	public Aktivitaet update(Aktivitaet model) {
		Aktivitaet entity = getOrCreate(model);
		Benutzer benutzer = benutzerService.getOrganisation();
		entity.setOrganisation(benutzer);
		benutzer.addErstellteAktivitaeten(entity);
		return repository.save(entity);
	}

	public List<Aktivitaet> getAll() {
		return benutzerService.getActive().getErstellteAktivitaeten();
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
			if (entity.getRessource() != null) {
				repository.deleteById(entity.getRessource().getId());
			}
			repository.deleteById(id);
		} else {
			throw new Exception("Aktivität nicht gefunden - ID: " + id);
		}
	}

	private Aktivitaet getOrCreate(Aktivitaet model) {
		Aktivitaet entity = model.getId() == null ? new Aktivitaet()
				: getById(model.getId()).orElseThrow(
						() -> new NoSuchElementException("Aktivität nicht gefunden. ID: " + model.getId()));

		updateDefaultValues(entity, model);
		entity.setTeilnehmeranzahl(model.getTeilnehmeranzahl());
		entity.setTransport(model.getTransport());
		entity.setVerpflegung(model.getVerpflegung());
		entity.setStartDatum(model.getStartDatum());
		entity.setEndDatum(model.getEndDatum());
		entity.setStartZeit(model.getStartZeit());
		entity.setEndZeit(model.getEndZeit());

		if (entity.getRessource() == null) {
			Ressource ressource = new Ressource();
			updateDefaultValues(ressource, model.getRessource());
			ressource.setMaterialien(model.getRessource().getMaterialien());
			ressource.setSicherheitsanforderungen(model.getRessource().getSicherheitsanforderungen());
			ressource.setAnmerkung(model.getRessource().getAnmerkung());
			entity.setRessource(ressource);
		}
		return entity;
	}

	private void updateDefaultValues(AbstractAktivitaet entity, AbstractAktivitaet model) {
		entity.setName(model.getName());
		entity.setBeschreibung(model.getBeschreibung());
		entity.setStrasse(model.getStrasse());
		entity.setHausnummer(model.getHausnummer());
		entity.setPlz(model.getPlz());
		entity.setOrt(model.getOrt());
		entity.setLatitude(model.getLatitude());
		entity.setLongitude(model.getLongitude());
		entity.setVorname(model.getVorname());
		entity.setNachname(model.getNachname());
		entity.setEmail(model.getEmail());
		entity.setTelefon(model.getTelefon());
	}

}
