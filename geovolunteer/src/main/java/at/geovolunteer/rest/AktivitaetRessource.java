package at.geovolunteer.rest;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import at.geovolunteer.model.Aktivitaet;
import at.geovolunteer.service.AktivitaetService;

@RestController
@RequestMapping("/geo/aktivitaet")
public class AktivitaetRessource {

	@Autowired
	private AktivitaetService service;

	@GetMapping(value = "/erstellteAktivitaeten", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Aktivitaet>> getErstellteAktivitaeten() {
		try {
			List<Aktivitaet> list = service.getErstellteAktivitaeten();
			if (CollectionUtils.isEmpty(list)) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}
			return new ResponseEntity<>(list, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping(value = "/aktivitaeten", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Aktivitaet>> getAktivitaten() {
		try {
			List<Aktivitaet> list = service.geAktivitaeten();
			if (CollectionUtils.isEmpty(list)) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}
			return new ResponseEntity<>(list, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/{id}")
	public ResponseEntity<Aktivitaet> getAktivitaetById(@PathVariable("id") long id) {
		Optional<Aktivitaet> entity = service.getById(id);
		if (entity.isPresent()) {
			return new ResponseEntity<>(entity.get(), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@PostMapping("/update")
	public ResponseEntity<Aktivitaet> update(@RequestBody Aktivitaet model) {
		Aktivitaet entity = service.update(model);
		if (entity.getId() == null) {
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
		}
		if (entity.getRessource() == null || entity.getRessource().getId() == null) {
			return new ResponseEntity<Aktivitaet>(HttpStatus.UNAUTHORIZED);
		}
		return new ResponseEntity<>(entity, HttpStatus.CREATED);
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<HttpStatus> delete(@PathVariable("id") long id) {
		try {
			service.delete(id);
			return new ResponseEntity<>(HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
