package at.geovolunteer.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import at.geovolunteer.rest.model.AktivitaetModel;

@RestController
@RequestMapping("/api")
public class AktivitaetRessource {

	@PostMapping("/aktivitaet/create")
	public ResponseEntity<?> create(@RequestBody AktivitaetModel request) {
		System.out.println(request);

		return ResponseEntity.ok(request);
	}

}
