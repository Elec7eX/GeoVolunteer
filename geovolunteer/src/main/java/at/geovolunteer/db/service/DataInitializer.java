package at.geovolunteer.db.service;

import java.util.Calendar;

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
			benutzer.setVorname("Murat");
			benutzer.setNachname("Demir");
			benutzer.setEmail("murat.demir@hotmail.com");
			benutzer.setLogin("user");
			benutzer.setPassword("aaa");

			Calendar c = Calendar.getInstance();
			c.set(1990, 4, 15);
			benutzer.setGeburtsDatum(c);
			benutzerRepository.save(benutzer);

			Benutzer benutzer2 = new Benutzer();
			benutzer2.setRolle(Rolle.ORGANISATION);
			benutzer2.setVorname("Mustermann");
			benutzer2.setNachname("Muster");
			benutzer2.setEmail("mde@hotmail.com");
			benutzer2.setLogin("murat");
			benutzer2.setPassword("aaa");
			benutzer2.setGeburtsDatum(c);
			benutzerRepository.save(benutzer2);
		}
	}

}
