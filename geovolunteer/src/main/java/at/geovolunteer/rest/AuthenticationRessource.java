package at.geovolunteer.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import at.geovolunteer.model.Benutzer;
import at.geovolunteer.service.BenutzerService;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationRessource {
	
	@Autowired
    private BenutzerService benutzerService;
	
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginType request) {
        Benutzer authenticate = benutzerService.authenticate(request.getUsername(), request.getPassword());
        if (authenticate != null) {
            return ResponseEntity.ok(request);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Ungültige Anmeldedaten");
        }
    }
}