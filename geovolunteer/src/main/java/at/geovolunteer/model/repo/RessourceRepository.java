package at.geovolunteer.model.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import at.geovolunteer.rest.model.Ressource;

public interface RessourceRepository extends JpaRepository<Ressource, Long> {

}
