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
import org.springframework.web.bind.annotation.PutMapping;
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

	@GetMapping(value = "/laufendeAktivitaeten", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Aktivitaet>> getLaufendeAktivitaeten() {
		try {
			List<Aktivitaet> list = service.getLaufendeAktivitaeten();
			if (CollectionUtils.isEmpty(list)) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}
			return new ResponseEntity<>(list, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping(value = "/bevorstehendeAktivitaeten", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Aktivitaet>> getBevorstehendeAktivitaeten() {
		try {
			List<Aktivitaet> list = service.getBevorstehendeAktivitaeten();
			if (CollectionUtils.isEmpty(list)) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}
			return new ResponseEntity<>(list, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping(value = "/laufendeUndBevorstehendeAktivitaeten", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Aktivitaet>> getLaufendeUndBevorstehendeAktivitaeten() {
		try {
			List<Aktivitaet> list = service.getLaufendeUndBevorstehendeAktivitaeten();
			if (CollectionUtils.isEmpty(list)) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}
			return new ResponseEntity<>(list, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping(value = "/abgeschlosseneAktivitaeten", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Aktivitaet>> getAbgeschlosseneAktivitaeten() {
		try {
			List<Aktivitaet> list = service.getAbgeschlosseneAktivitaeten();
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
			List<Aktivitaet> list = service.getAktivitaeten();
			if (CollectionUtils.isEmpty(list)) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}
			return new ResponseEntity<>(list, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping(value = "/aktuelleAktivitaeten", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Aktivitaet>> getAktuelleAktivitaeten() {
		try {
			List<Aktivitaet> list = service.getLaufendeUndBevorstehendeAktivitaeten();
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

	@PutMapping("/addTeilnehmer/{id}")
	public ResponseEntity<Aktivitaet> addTeilnehmer(@PathVariable("id") long id) {
		if (service.addTeilnehmer(id)) {
			return new ResponseEntity<>(HttpStatus.ACCEPTED);
		}
		return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	}

	@PutMapping("/removeTeilnehmer/{id}")
	public ResponseEntity<Aktivitaet> removeTeilnehmer(@PathVariable("id") long id) {
		if (service.removeTeilnehmer(id)) {
			return new ResponseEntity<>(HttpStatus.ACCEPTED);
		}
		return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	}

//	@GetMapping("/aktivitaetImUmkreisVon")
//	public List<Aktivitaet> nearby(@RequestParam double lat, @RequestParam double lon,
//			@RequestParam double radiusMeters) {
//		return service.geAktivitaeten().stream().filter(a -> geoService.isVolunteerWithin(a, lat, lon, radiusMeters))
//				.collect(Collectors.toList());
//	}

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
