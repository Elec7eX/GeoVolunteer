package at.geovolunteer.config;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

public class CalendarTimeSerializer extends JsonSerializer<Calendar> {
	private static final DateFormat timeFormat = new SimpleDateFormat("HH:mm");

	@Override
	public void serialize(Calendar value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
		if (value != null) {
			String timeStr = timeFormat.format(value.getTime());
			gen.writeString(timeStr);
		} else {
			gen.writeNull();
		}
	}
}
