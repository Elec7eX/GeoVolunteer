package at.geovolunteer.rest.model;

import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

public class CalendarTimeDeserializer extends JsonDeserializer<Calendar> {
	private static final DateFormat dateFormat = new SimpleDateFormat("HH:mm");

	@Override
	public Calendar deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
		String timeStr = p.getText();
		try {
			Date date = dateFormat.parse(timeStr);
			Calendar cal = Calendar.getInstance();
			cal.setTime(date);
			return cal;
		} catch (ParseException e) {
			throw new RuntimeException(e);
		}
	}
}
