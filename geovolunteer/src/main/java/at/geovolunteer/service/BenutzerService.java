package at.geovolunteer.service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import at.geovolunteer.model.Benutzer;
import at.geovolunteer.model.Einheit;
import at.geovolunteer.model.Rolle;
import at.geovolunteer.model.repo.BenutzerRepository;
import at.geovolunteer.rest.LoginType;

@Service
public class BenutzerService {

	@Autowired
	private BenutzerRepository benutzerRepository;

	public Benutzer authenticate(LoginType loginRequest) {
		Optional<Benutzer> entity = benutzerRepository.findByLogin(loginRequest.getLogin()).stream().findFirst();
		if (entity.isPresent() && passwordMatches(loginRequest.getPassword(), entity.get().getPassword())) {
			Benutzer benutzer = entity.get();
			benutzer.setActive(true);
			benutzerRepository.saveAndFlush(benutzer);
			return benutzer;
		}
		return null;
	}

	public Benutzer getActive() {
		return findBenutzerByCriteria(b -> b.isActive(), "Kein aktiver Benutzer gefunden!");
	}

	public Benutzer getOrganisation() {
		return findBenutzerByCriteria(b -> b.isActive() && Rolle.ORGANISATION.equals(b.getRolle()),
				"Kein aktiver Organisation gefunden!");
	}

	public List<Benutzer> getFreiwillige() {
		return findAll().stream().filter(b -> Rolle.FREIWILLIGE.equals(b.getRolle()))
				.filter(b -> b.getVorname() != null && b.getNachname() != null).collect(Collectors.toList());
	}

	private Benutzer findBenutzerByCriteria(Predicate<Benutzer> criteria, String errorMessage) {
		return findAll().stream().filter(criteria).findFirst()
				.orElseThrow(() -> new NoSuchElementException(errorMessage));
	}

	public Benutzer create(Benutzer benutzer) {
		Benutzer entity = new Benutzer();
		if (Rolle.FREIWILLIGE.equals(benutzer.getRolle())) {
			entity.setVorname(benutzer.getVorname());
			entity.setNachname(benutzer.getNachname());
		}
		entity.setRolle(benutzer.getRolle());
		entity.setLogin(benutzer.getLogin());
		entity.setEmail(benutzer.getEmail());
		entity.setPassword(benutzer.getPassword());
		entity.setActive(true);
		benutzerRepository.save(entity);
		return entity;
	}

	public Benutzer logout() {
		Optional<Benutzer> benutzer = findAll().stream().filter(b -> b.isActive()).findAny();
		if (benutzer.isPresent()) {
			Benutzer entity = benutzer.get();
			entity.setActive(false);
			benutzerRepository.saveAndFlush(entity);
			return entity;
		}
		return null;
	}

	public Benutzer update(Benutzer user) {
		Optional<Benutzer> benutzer = findById(user.getId());
		Benutzer entity = benutzer.isPresent() ? benutzer.get() : null;
		if (entity != null && entity.isActive()) {

			entity.setLogin(user.getLogin());
			entity.setPassword(user.getPassword());
			entity.setEmail(user.getEmail());
			entity.setTelefon(user.getTelefon());

			Rolle rolle = entity.getRolle();
			if (isFreiwilligeOrOrganisation(rolle)) {
				updateFreiwilligeOrOrganisation(entity, user, rolle);
			}
			benutzerRepository.saveAndFlush(entity);
			return entity;
		}
		return null;
	}

	private boolean isFreiwilligeOrOrganisation(Rolle rolle) {
		return Rolle.FREIWILLIGE.equals(rolle) || Rolle.ORGANISATION.equals(rolle);
	}

	private void updateFreiwilligeOrOrganisation(Benutzer entity, Benutzer user, Rolle rolle) {
		entity.setStrasse(user.getStrasse());
		entity.setHausnummer(user.getHausnummer());
		entity.setPlz(user.getPlz());
		entity.setOrt(user.getOrt());
		entity.setLatitude(user.getLatitude());
		entity.setLongitude(user.getLongitude());
		entity.setLand(user.getLand());
		if (Rolle.FREIWILLIGE.equals(rolle)) {
			updateFreiwillige(entity, user);
		} else if (Rolle.ORGANISATION.equals(rolle)) {
			updateOrganisation(entity, user);
		}
	}

	private void updateFreiwillige(Benutzer entity, Benutzer user) {
		entity.setVorname(user.getVorname());
		entity.setNachname(user.getNachname());
		entity.setGeburtsDatum(user.getGeburtsDatum());
		entity.setVerfuegbarVonDatum(user.getVerfuegbarVonDatum());
		entity.setVerfuegbarBisDatum(user.getVerfuegbarBisDatum());
		entity.setVerfuegbarVonZeit(user.getVerfuegbarVonZeit());
		entity.setVerfuegbarBisZeit(user.getVerfuegbarBisZeit());
		entity.setEinheit(user.getEinheit());
		entity.setRadius(Einheit.KM.equals(user.getEinheit()) ? user.getRadius() * 1000 : user.getRadius());
	}

	private void updateOrganisation(Benutzer entity, Benutzer user) {
		entity.setName(user.getName());
		entity.setWebseite(user.getWebseite());
		entity.setBeschreibung(user.getBeschreibung());
	}

	public List<Benutzer> findByUsername(String login) {
		List<Benutzer> benutzer = new ArrayList<Benutzer>();
		benutzerRepository.findByLogin(login).forEach(benutzer::add);
		return benutzer;
	}

	private boolean passwordMatches(String rawPassword, String hashedPassword) {
		return rawPassword.toLowerCase().equals(hashedPassword.toLowerCase());
	}

	public List<Benutzer> findAll() {
		List<Benutzer> benutzer = new ArrayList<Benutzer>();
		benutzerRepository.findAll().forEach(benutzer::add);
		return benutzer;
	}

	public <S extends Benutzer> S save(S entity) {
		return benutzerRepository.save(entity);
	}

	public Optional<Benutzer> findById(Long id) {
		return Optional.of(benutzerRepository.findById(id).orElseThrow());
	}

}
