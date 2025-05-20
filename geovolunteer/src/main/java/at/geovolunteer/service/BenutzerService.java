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
			return entity.get();
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

	public List<Benutzer> findByUsername(String login) {
		List<Benutzer> benutzer = new ArrayList<Benutzer>();
		benutzerRepository.findByLogin(login).forEach(benutzer::add);
		return benutzer;
	}

	private boolean passwordMatches(String rawPassword, String hashedPassword) {
		return rawPassword.toLowerCase().equals(hashedPassword.toLowerCase());
	}

	public List<Benutzer> findAll() {
		List<Benutzer> tutorials = new ArrayList<Benutzer>();
		benutzerRepository.findAll().forEach(tutorials::add);
		return tutorials;
	}

	public <S extends Benutzer> S save(S entity) {
		return benutzerRepository.save(entity);
	}

	public Optional<Benutzer> findById(Long id) {
		return Optional.of(benutzerRepository.findById(id).orElseThrow());
	}

}
