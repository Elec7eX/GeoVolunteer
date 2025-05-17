package at.geovolunteer.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import at.geovolunteer.model.Benutzer;
import at.geovolunteer.model.repo.BenutzerRepository;

@Service
public class BenutzerService {

	@Autowired
	private BenutzerRepository benutzerRepository;

	public Benutzer authenticate(String username, String password) {
		Optional<Benutzer> benutzer = benutzerRepository.findByUsername(username).stream().findFirst();
		if (benutzer.isPresent() && passwordMatches(password, benutzer.get().getPassword())) {
			return benutzer.get();
		}
		return null;
	}

	public List<Benutzer> findByUsername(String username) {
		List<Benutzer> benutzer = new ArrayList<Benutzer>();
		benutzerRepository.findByUsername(username).forEach(benutzer::add);
		return benutzer;
	}

	private boolean passwordMatches(String rawPassword, String hashedPassword) {
		return rawPassword.toLowerCase().equals(hashedPassword.toLowerCase());
	}

	public List<Benutzer> findByVorname(String vorname) {
		List<Benutzer> benutzer = new ArrayList<Benutzer>();
		benutzerRepository.findByVorname(vorname).forEach(benutzer::add);
		return benutzer;
	}

	public List<Benutzer> findByNachname(String nachname) {
		List<Benutzer> benutzer = new ArrayList<Benutzer>();
		benutzerRepository.findByNachname(nachname).forEach(benutzer::add);
		return benutzer;
	}

	public List<Benutzer> findByGeburtsDatum(LocalDate geburtsDatum) {
		List<Benutzer> benutzer = new ArrayList<Benutzer>();
		benutzerRepository.findByGeburtsDatum(geburtsDatum).forEach(benutzer::add);
		return benutzer;
	}

	public List<Benutzer> findByEmail(String email) {
		List<Benutzer> benutzer = new ArrayList<Benutzer>();
		benutzerRepository.findByEmail(email).forEach(benutzer::add);
		return benutzer;
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
