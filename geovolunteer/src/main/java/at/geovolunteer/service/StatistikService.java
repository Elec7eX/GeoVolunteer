package at.geovolunteer.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import at.geovolunteer.model.Aktivitaet;
import at.geovolunteer.model.Benutzer;

@Service
public class StatistikService {

	@Autowired
	private BenutzerService benutzerService;

	public List<Map<String, Object>> getAktivitaetenByKategorien() {
		Benutzer benutzer = benutzerService.getActive();
		return benutzer.getTeilnahmen().stream()
				.collect(Collectors.groupingBy(Aktivitaet::getKategorie, Collectors.counting())).entrySet().stream()
				.map(entry -> {
					Map<String, Object> map = new HashMap<>();
					map.put("kategorie", entry.getKey().name());
					map.put("count", entry.getValue());
					return map;
				}).toList();
	}

}
