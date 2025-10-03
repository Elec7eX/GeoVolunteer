package at.geovolunteer.config;

import java.io.IOException;

import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.io.geojson.GeoJsonWriter;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class GeometrySerializer extends JsonSerializer<Geometry> {

	private final GeoJsonWriter writer = new GeoJsonWriter();
	private final ObjectMapper mapper = new ObjectMapper();

	@Override
	public void serialize(Geometry value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
		if (value == null) {
			gen.writeNull();
			return;
		}

		// Pure Geometry in GeoJSON
		String geoJson = writer.write(value);
		ObjectNode geomNode = (ObjectNode) mapper.readTree(geoJson);

		// Feature erstellen
		ObjectNode feature = mapper.createObjectNode();
		feature.put("type", "Feature");
		feature.set("geometry", geomNode);

		// Hier wird "radius" ins properties geschrieben
		ObjectNode props = mapper.createObjectNode();

		// Trick: Radius aus der Entity über SerializerProvider holen
		Object bean = gen.currentValue();
		try {
			Double radius = (Double) bean.getClass().getMethod("getRadius").invoke(bean);
			if (radius != null) {
				props.put("radius", radius);
			}
		} catch (Exception ignore) {
		}

		feature.set("properties", props);

		gen.writeTree(feature);
	}
}