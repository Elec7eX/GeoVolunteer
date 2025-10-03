package at.geovolunteer.config;

import java.io.IOException;

import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.io.geojson.GeoJsonReader;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;

public class GeometryDeserializer extends JsonDeserializer<Geometry> {

	private final GeoJsonReader reader = new GeoJsonReader();

	@Override
	public Geometry deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
		JsonNode feature = p.readValueAsTree();

		JsonNode geomNode = feature.has("geometry") ? feature.get("geometry") : feature;

		try {
			Geometry geom = reader.read(geomNode.toString());

			// Radius extrahieren und ins Parent-Objekt schreiben
			if (feature.has("properties") && feature.get("properties").has("radius")) {
				double radius = feature.get("properties").get("radius").asDouble();
				Object bean = p.currentValue();
				try {
					bean.getClass().getMethod("setRadius", Double.class).invoke(bean, radius);
				} catch (Exception ignore) {
				}
			}

			return geom;
		} catch (Exception e) {
			throw new RuntimeException("Fehler beim Parsen von GeoJSON Feature", e);
		}
	}
}