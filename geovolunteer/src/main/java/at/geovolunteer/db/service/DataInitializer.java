package at.geovolunteer.db.service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import at.geovolunteer.model.Benutzer;
import at.geovolunteer.model.Rolle;
import at.geovolunteer.model.repo.BenutzerRepository;

@Component
public class DataInitializer implements CommandLineRunner {

	private final BenutzerRepository benutzerRepository;

	public DataInitializer(BenutzerRepository benutzerRepository) {
		this.benutzerRepository = benutzerRepository;
	}

	@Override
	public void run(String... args) throws Exception {
		if (benutzerRepository.count() == 0) {
			Benutzer benutzer = new Benutzer();
			benutzer.setRolle(Rolle.FREIWILLIGE);
			benutzer.setLogin("user");
			benutzer.setEmail("mde@hotmail.com");
			benutzer.setPassword("aaa");
			benutzerRepository.save(benutzer);

			Benutzer benutzer2 = new Benutzer();
			benutzer2.setRolle(Rolle.ORGANISATION);
			benutzer2.setLogin("org");
			benutzer2.setEmail("org@rotes-kreuz.com");
			benutzer2.setPassword("aaa");
			benutzerRepository.save(benutzer2);
		}
	}

}
