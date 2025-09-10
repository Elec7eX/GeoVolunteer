package at.geovolunteer.service;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;

import at.geovolunteer.model.Aktivitaet;

@Service
public class GeoService {

	private final GeometryFactory factory = new GeometryFactory();

	/*
	 * Hintergrund
	 * 
	 * Geokoordinaten werden in Grad angegeben: Breitengrad (Latitude) Längengrad
	 * (Longitude)
	 * 
	 * Entfernungen in der realen Welt wollen wir aber in Meter oder Kilometer
	 * berechnen.
	 * 
	 * Am Äquator gilt ungefähr: Einheit Länge 1° Latitude ~111 km 1° Longitude ~111
	 * km × cos(Breitengrad)
	 */

	public boolean isVolunteerWithin(Aktivitaet aktivitaet, double lat, double lon, double radiusMeters) {
		Point volunteer = factory.createPoint(new Coordinate(lon, lat));
		Geometry shape = aktivitaet.getShape();

		double radiusDegrees = radiusMeters / 111_000.0; // grobe Umrechnung Meter → Grad
		return volunteer.isWithinDistance(shape, radiusDegrees);
	}
}