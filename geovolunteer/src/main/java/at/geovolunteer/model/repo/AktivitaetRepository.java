package at.geovolunteer.model.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import at.geovolunteer.model.Aktivitaet;

public interface AktivitaetRepository extends JpaRepository<Aktivitaet, Long> {

}
