package at.geovolunteer.model;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

public class CalendarSerializer extends JsonSerializer<Calendar> {

	private static final DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

	@Override
	public void serialize(Calendar value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
		if (value != null) {
			String dateStr = dateFormat.format(value.getTime());
			gen.writeString(dateStr);
		} else {
			gen.writeNull();
		}
	}

}
