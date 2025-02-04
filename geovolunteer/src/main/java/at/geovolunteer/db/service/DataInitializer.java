package at.geovolunteer.db.service;

import java.time.LocalDate;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import at.geovolunteer.model.Benutzer;
import at.geovolunteer.model.repo.BenutzerRepository;

@Component
public class DataInitializer implements CommandLineRunner{
	
	
	private final BenutzerRepository benutzerRepository;
	
	public DataInitializer(BenutzerRepository benutzerRepository) {
        this.benutzerRepository = benutzerRepository;
    }

	@Override
	public void run(String... args) throws Exception {
		if (benutzerRepository.count() == 0) {
			Benutzer benutzer = new Benutzer();
	    	benutzer.setVorname("Murat");
	    	benutzer.setNachname("Demir");
	    	benutzer.setEmail("murat.demir@hotmail.com");
	    	benutzer.setUsername("user");
	    	benutzer.setPassword("aaa");
	    	benutzer.setGeburtsDatum(LocalDate.of(1990, 5, 15));
			benutzerRepository.save(benutzer);
        }		
	}

}
