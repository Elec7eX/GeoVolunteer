package at.geovolunteer.rest;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import at.geovolunteer.service.StatistikService;

@RestController
@RequestMapping("/geo/statistik")
public class StatistikRessource {

	@Autowired
	private StatistikService statistikService;

	@GetMapping("/aktivitaetenByKategorien")
	public List<Map<String, Object>> getAktivitaetenByKategorien() {
		return statistikService.getAktivitaetenByKategorien();
	}

}
