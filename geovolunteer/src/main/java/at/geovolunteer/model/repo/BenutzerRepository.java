package at.geovolunteer.model.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import at.geovolunteer.model.Benutzer;

public interface BenutzerRepository extends JpaRepository<Benutzer, Long> {

	List<Benutzer> findByLogin(String login);

}
