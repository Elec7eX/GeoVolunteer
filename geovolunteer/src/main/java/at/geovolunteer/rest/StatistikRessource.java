package at.geovolunteer.rest;

import java.util.HashMap;
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

	@GetMapping("/radius")
	public Map<String, Double> getAktionsradius() {
		return statistikService.getAktionsradius();
	}

	@GetMapping("/radius/verlauf")
	public List<Map<String, Object>> getAktionsradiusVerlauf() {
		return statistikService.getAktionsradiusVerlauf();
	}

	@GetMapping("/organisationen/distanz")
	public Map<String, Object> getOrganisationenDistanz() {

		List<Map<String, Object>> list = statistikService.getOrganisationenDistanz();
		double avg = statistikService.getDurchschnittsDistanz();

		Map<String, Object> result = new HashMap<>();
		result.put("organisationen", list);
		result.put("durchschnittsDistanz", avg);

		return result;
	}

	@GetMapping("/organisation/freiwilligenDistanz")
	public Map<String, Long> getFreiwilligenDistanz() {
		return statistikService.getFreiwilligenDistanz();
	}

	@GetMapping("/organisation/freiwilligenAktivitaetenDistanz")
	public Map<String, Long> getFreiwilligenAktivitaetenDistanz() {
		return statistikService.getFreiwilligenAktivitaetenDistance();
	}

	@GetMapping("/organisation/freiwilligenRadiusAktivitaetenDistanz")
	public Map<String, Long> getFreiwilligenRadiusAktivitaetenDistanz() {
		return statistikService.getFreiwilligenRadiusAktivitaetenDistance();
	}

}
