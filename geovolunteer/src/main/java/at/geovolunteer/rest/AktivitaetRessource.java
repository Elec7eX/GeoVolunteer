package at.geovolunteer.rest;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import at.geovolunteer.rest.model.Aktivitaet;
import at.geovolunteer.service.AktivitaetService;

@RestController
@RequestMapping("/api")
public class AktivitaetRessource {

	@Autowired
	private AktivitaetService service;

	@GetMapping(value = "/aktivitaeten", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Aktivitaet>> getAllBenutzer() {
		try {
			List<Aktivitaet> list = service.getAll();
			if (CollectionUtils.isEmpty(list)) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}
			return new ResponseEntity<>(list, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/aktivitaet/{id}")
	public ResponseEntity<Aktivitaet> getBenutzerById(@PathVariable("id") long id) {
		Optional<Aktivitaet> entity = service.getById(id);
		if (entity.isPresent()) {
			return new ResponseEntity<>(entity.get(), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@PostMapping("/aktivitaet/create")
	public ResponseEntity<?> create(@RequestBody Aktivitaet request) {
		System.out.println(request);
		Aktivitaet entity = service.create(request);
		if (entity.getId() == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Ungültige Aktivität");
		}
		if (entity.getRessource() == null || entity.getRessource().getId() == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body("Ungültige Ressource für Aktivität-ID: " + entity.getId());
		}
		return new ResponseEntity<>(entity, HttpStatus.CREATED);
	}

}
