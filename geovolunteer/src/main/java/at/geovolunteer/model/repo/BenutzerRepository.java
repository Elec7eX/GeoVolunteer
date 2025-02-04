package at.geovolunteer.model.repo;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import at.geovolunteer.model.Benutzer;

public interface BenutzerRepository extends JpaRepository<Benutzer, Long>{
	
	List<Benutzer> findByVorname(String vorname);
	
	List<Benutzer> findByNachname(String nachname);
	
	List<Benutzer> findByGeburtsDatum(LocalDate geburtsDatum);
	
	List<Benutzer> findByEmail(String email);
	
	List<Benutzer> findByUsername(String username);
	
}
