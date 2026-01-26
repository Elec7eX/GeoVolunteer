package at.geovolunteer.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.locationtech.jts.geom.Geometry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import at.geovolunteer.model.Aktivitaet;
import at.geovolunteer.model.Benutzer;
import at.geovolunteer.model.Rolle;
import at.geovolunteer.util.GeoUtil;

@Service
public class StatistikService {

	@Autowired
	private BenutzerService benutzerService;

	public List<Map<String, Object>> getAktivitaetenByKategorien() {
		Benutzer benutzer = benutzerService.getActive();

		List<Aktivitaet> aktivitaeten;
		if (benutzer.isOrganisation()) {
			aktivitaeten = benutzer.getErstellteAktivitaeten();
		} else if (benutzer.isFreiwillige()) {
			aktivitaeten = benutzer.getTeilnahmen();
		} else {
			throw new IllegalArgumentException("Not implemented!");
		}
		return aktivitaeten.stream().collect(Collectors.groupingBy(Aktivitaet::getKategorie, Collectors.counting()))
				.entrySet().stream().map(entry -> {
					Map<String, Object> map = new HashMap<>();
					map.put("kategorie", entry.getKey().name());
					map.put("count", entry.getValue());
					return map;
				}).toList();
	}

	public Map<String, Double> getAktionsradius() {
		Benutzer benutzer = benutzerService.getActive();

		if (benutzer.getTeilnahmen().isEmpty() || benutzer.getShape() == null) {
			return Map.of("avg", 0.0, "max", 0.0, "median", 0.0);
		}

		double vLat = benutzer.getShape().getCoordinate().getY();
		double vLon = benutzer.getShape().getCoordinate().getX();

		List<Double> dists = benutzer.getTeilnahmen().stream().filter(a -> a.getShape() != null).map(a -> GeoUtil
				.haversineKm(vLat, vLon, a.getShape().getCoordinate().getY(), a.getShape().getCoordinate().getX()))
				.sorted().toList();

		if (dists.isEmpty()) {
			return Map.of("avg", 0.0, "max", 0.0, "median", 0.0);
		}

		double avg = dists.stream().mapToDouble(d -> d).average().orElse(0);
		double max = dists.get(dists.size() - 1);

		double median = dists.size() % 2 == 0 ? (dists.get(dists.size() / 2 - 1) + dists.get(dists.size() / 2)) / 2
				: dists.get(dists.size() / 2);

		return Map.of("avg", round(avg), "max", round(max), "median", round(median));
	}

	private double round(double v) {
		return Math.round(v * 10.0) / 10.0;
	}

	public List<Map<String, Object>> getAktionsradiusVerlauf() {
		Benutzer benutzer = benutzerService.getActive();

		if (benutzer.getTeilnahmen().isEmpty() || benutzer.getShape() == null) {
			return List.of();
		}

		double vLat = benutzer.getShape().getCoordinate().getY();
		double vLon = benutzer.getShape().getCoordinate().getX();

		return benutzer.getTeilnahmen().stream().filter(a -> a.getShape() != null)
				.sorted(Comparator.comparing(Aktivitaet::getStartDatum)).map(a -> {
					Map<String, Object> map = new HashMap<>();
					double dist = GeoUtil.haversineKm(vLat, vLon, a.getShape().getCoordinate().getY(),
							a.getShape().getCoordinate().getX());
					map.put("name", a.getName());
					map.put("distanz", Math.round(dist * 10.0) / 10.0);
					return map;
				}).toList();
	}

	public List<Map<String, Object>> getOrganisationenDistanz() {
		Benutzer benutzer = benutzerService.getActive();
		Geometry freiwilligePoint = benutzer.getShape();

		return benutzerService.findAll().stream().filter(b -> Rolle.ORGANISATION.equals(b.getRolle()))
				.filter(b -> b.getShape() != null).map(b -> {
					double distanceKm = freiwilligePoint.distance(b.getShape()) * 111.0;
					distanceKm = Math.round(distanceKm * 100.0) / 100.0;
					Map<String, Object> map = new HashMap<>();
					map.put("id", b.getId());
					map.put("name", b.getName());
					map.put("distanz", distanceKm);
					return map;
				}).sorted(Comparator.comparingDouble(m -> (double) m.get("distanz"))).limit(5).toList();
	}

	public double getDurchschnittsDistanz() {
		double avg = getOrganisationenDistanz().stream().mapToDouble(m -> (double) m.get("distanz")).average()
				.orElse(0);
		return Math.round(avg * 100.0) / 100.0;
	}

	public Map<String, Long> getFreiwilligenDistanz() {
		Benutzer benutzer = benutzerService.getActive();
		Geometry orgPoint = benutzer.getShape();

		List<Benutzer> freiwillige = benutzerService.getAllFreiwillige();

		long unter5 = 0;
		long zwischen5und10 = 0;
		long ueber10 = 0;

		for (Benutzer b : freiwillige) {
			if (b.getShape() == null) {
				continue;
			}

			double distanceKm = GeoUtil.haversineKm(orgPoint.getCoordinate().getY(), orgPoint.getCoordinate().getX(),
					b.getShape().getCoordinate().getY(), b.getShape().getCoordinate().getX());

			if (distanceKm < 5) {
				unter5++;
			} else if (distanceKm <= 10) {
				zwischen5und10++;
			} else {
				ueber10++;
			}
		}

		return Map.of("aUnter5", unter5, "bZwischen5und10", zwischen5und10, "cUeber10", ueber10);
	}

	public Map<String, Long> getFreiwilligenAktivitaetenDistance() {
		List<Aktivitaet> aktivitaeten = benutzerService.getActive().getErstellteAktivitaeten();
		List<Double> distancesKm = new ArrayList<>();

		for (Aktivitaet aktivitaet : aktivitaeten) {
			Geometry aktivitaetShape = aktivitaet.getShape();
			for (Benutzer v : aktivitaet.getTeilnehmer()) {
				Geometry freiwilligeShape = v.getShape();
				double distanceKm = GeoUtil.haversineKm(freiwilligeShape.getCoordinate().getY(),
						freiwilligeShape.getCoordinate().getX(), aktivitaetShape.getCoordinate().getY(),
						aktivitaetShape.getCoordinate().getX());
				distancesKm.add(distanceKm);
			}
		}

		// 3. Histogramm berechnen
		Map<String, Long> histogram = new LinkedHashMap<>();
		histogram.put("0-1 km", distancesKm.stream().filter(d -> d <= 1).count());
		histogram.put("1-3 km", distancesKm.stream().filter(d -> d > 1 && d <= 3).count());
		histogram.put("3-5 km", distancesKm.stream().filter(d -> d > 3 && d <= 5).count());
		histogram.put("5-10 km", distancesKm.stream().filter(d -> d > 5 && d <= 10).count());
		histogram.put(">10 km", distancesKm.stream().filter(d -> d > 10).count());

		return histogram;
	}

}
