package at.geovolunteer.config;

import org.locationtech.jts.geom.Geometry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.bedatadriven.jackson.datatype.jts.JtsModule;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Configuration
public class JacksonConfig {

	@Bean
	public ObjectMapper objectMapper() {
		ObjectMapper mapper = new ObjectMapper();

		// Java 8 Date/Time Unterstützung
		mapper.registerModule(new JavaTimeModule());

		// Geometry Serializer + Deserializer
		SimpleModule module = new SimpleModule();
		module.addDeserializer(Geometry.class, new GeometryDeserializer());
		module.addSerializer(Geometry.class, new GeometrySerializer());
		mapper.registerModule(module);

		// GeoJSON-Unterstützung (Jackson-JTS)
		mapper.registerModule(new JtsModule());

		return mapper;
	}

}
