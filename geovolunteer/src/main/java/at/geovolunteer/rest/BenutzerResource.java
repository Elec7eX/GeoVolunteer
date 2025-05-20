package at.geovolunteer.rest;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import at.geovolunteer.model.Benutzer;
import at.geovolunteer.model.Einheit;
import at.geovolunteer.service.BenutzerService;

@RestController
@RequestMapping("/geo/benutzer")
public class BenutzerResource {

	@Autowired
	private BenutzerService service;

	@PostMapping("/login")
	public ResponseEntity<Benutzer> login(@RequestBody LoginType loginRequest) {
		Benutzer benutzer = service.authenticate(loginRequest);
		if (benutzer != null) {
			return ResponseEntity.ok(benutzer);
		} else {
			return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
		}
	}

	@PostMapping("/logout")
	public ResponseEntity<Benutzer> logout() {
		Benutzer benutzer = service.logout();
		if (benutzer != null) {
			return ResponseEntity.ok(benutzer);
		} else {
			return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
		}
	}

	@PostMapping("/create")
	public ResponseEntity<?> create(@RequestBody Benutzer user) {
		try {
			Benutzer entity = service.create(user);
			return new ResponseEntity<>(entity, HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping(value = "/benutzer", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Benutzer>> getAllBenutzer() {
		try {
			if (service.findAll().isEmpty()) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}
			return new ResponseEntity<>(service.findAll(), HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping(value = "/freiwillige", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Benutzer>> getFreiwillige() {
		try {
			List<Benutzer> freiwillige = service.getFreiwillige();
			if (freiwillige.isEmpty()) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}
			return new ResponseEntity<>(freiwillige, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/{id}")
	public ResponseEntity<Benutzer> getBenutzerById(@PathVariable("id") long id) {
		Optional<Benutzer> benutzer = service.findById(id);
		if (benutzer.isPresent()) {
			Benutzer benutzerModel = benutzer.get();
			if (Einheit.KM.equals(benutzerModel.getEinheit())) {
				benutzerModel.setRadius(benutzerModel.getRadius() / 1000);
			}
			return new ResponseEntity<>(benutzer.get(), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@PutMapping("/update/{id}")
	public ResponseEntity<Benutzer> update(@PathVariable("id") long id, @RequestBody Benutzer user) {
		try {
			Benutzer entity = service.update(user);
			if (entity != null) {
				return ResponseEntity.ok(entity);
			}
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/remove/{id}") 
	public ResponseEntity<HttpStatus> deleteTutorial(@PathVariable("id") long id) {
		try {
			// service.deleteById(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/deleteAll")
	public ResponseEntity<HttpStatus> deleteAllTutorials() {
		try {
			// service.deleteAll();
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
}
