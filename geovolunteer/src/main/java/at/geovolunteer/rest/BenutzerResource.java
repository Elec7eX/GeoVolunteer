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
import at.geovolunteer.service.BenutzerService;

@RestController
@RequestMapping("/api")
public class BenutzerResource {
	
	@Autowired
	private BenutzerService service;
	
	@PostMapping("/auth")
	public ResponseEntity<?> login(@RequestBody LoginType request) {
		System.out.println("AAAAA");
        Benutzer benutzer = service.authenticate(request.getUsername(), request.getPassword());
        if (benutzer != null) {
            return ResponseEntity.ok(request);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Ungültige Anmeldedaten");
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

	@GetMapping("/{id}")
	public ResponseEntity<Benutzer> getBenutzerById(@PathVariable("id") long id) {
		Optional<Benutzer> tutorialData = service.findById(id);

		if (tutorialData.isPresent()) {
			return new ResponseEntity<>(tutorialData.get(), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@PostMapping("/create")
	public ResponseEntity<Benutzer> create(@RequestBody Benutzer user) {
		try {
			Benutzer _user = new Benutzer();
			_user.setVorname(user.getVorname());
			_user.setNachname(user.getNachname());
			_user.setGeburtsDatum(user.getGeburtsDatum());
			service.save(_user);
			return new ResponseEntity<>(_user, HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PutMapping("/update/{id}")
	public ResponseEntity<Benutzer> updateTutorial(@PathVariable("id") long id, @RequestBody Benutzer user) {
		Optional<Benutzer> tutorialData = service.findById(id);

		if (tutorialData.isPresent()) {
			Benutzer _user = tutorialData.get();
			_user.setVorname(user.getVorname());
			_user.setNachname(user.getNachname());
			_user.setGeburtsDatum(user.getGeburtsDatum());
			return new ResponseEntity<>(service.save(_user), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@DeleteMapping("/remove/{id}")
	public ResponseEntity<HttpStatus> deleteTutorial(@PathVariable("id") long id) {
		try {
			service.deleteById(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/deleteAll")
	public ResponseEntity<HttpStatus> deleteAllTutorials() {
		try {
			service.deleteAll();
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
}
