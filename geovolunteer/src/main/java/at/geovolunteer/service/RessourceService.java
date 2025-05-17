package at.geovolunteer.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import at.geovolunteer.model.repo.RessourceRepository;
import at.geovolunteer.rest.model.Ressource;

@Service
public class RessourceService {

	@Autowired
	private RessourceRepository repository;

	public void create(Ressource entity) {
		repository.save(entity);
	}
}
