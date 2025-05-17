package at.geovolunteer.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import at.geovolunteer.model.repo.AktivitaetRepository;
import at.geovolunteer.rest.model.Aktivitaet;

@Service
public class AktivitaetService {

	@Autowired
	private AktivitaetRepository repository;

	public Aktivitaet create(Aktivitaet model) {
		return repository.save(model);
	}

	public List<Aktivitaet> getAll() {
		return repository.findAll();
	}

	public Optional<Aktivitaet> getById(long id) {
		return repository.findById(id);
	}

}
