package at.geovolunteer.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import at.geovolunteer.model.Benutzer;
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

	public Benutzer create(Benutzer benutzer) {
		Benutzer entity = new Benutzer();
		entity.setRolle(benutzer.getRolle());
		entity.setLogin(benutzer.getLogin());
		entity.setEmail(benutzer.getEmail());
		entity.setPassword(benutzer.getPassword());
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
		if (benutzer.isPresent()) {
			Benutzer entity = benutzer.get();
			entity.setVorname(user.getVorname());
			entity.setNachname(user.getNachname());
			entity.setGeburtsDatum(user.getGeburtsDatum());
			entity.setVerfuegbarVonDatum(user.getVerfuegbarVonDatum());
			entity.setVerfuegbarBisDatum(user.getVerfuegbarBisDatum());
			entity.setVerfuegbarVonZeit(user.getVerfuegbarVonZeit());
			entity.setVerfuegbarBisZeit(user.getVerfuegbarBisZeit());
			entity.setLogin(user.getLogin());
			entity.setPassword(user.getPassword());
			entity.setEmail(user.getEmail());
			entity.setTelefon(user.getTelefon());
			entity.setStrasse(user.getStrasse());
			entity.setHausnummer(user.getHausnummer());
			entity.setPlz(user.getPlz());
			entity.setOrt(user.getOrt());
			entity.setLatitude(user.getLatitude());
			entity.setLongitude(user.getLongitude());
			entity.setRadius(user.getRadius());
			entity.setLand(user.getLand());
			entity.setName(user.getName());
			entity.setWebseite(user.getWebseite());
			entity.setBeschreibung(user.getBeschreibung());
			benutzerRepository.saveAndFlush(entity);
			return entity;
		}
		return null;
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
