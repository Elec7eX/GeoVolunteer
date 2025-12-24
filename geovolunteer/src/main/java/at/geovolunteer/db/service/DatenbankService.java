package at.geovolunteer.db.service;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

public class DatenbankService {

	public static DataSource dataSource;

	public DatenbankService() {
		try {
			InitialContext ctx = new InitialContext();
			dataSource = (DataSource) ctx.lookup("java:/comp/env/jdbc/PostgresDB");
		} catch (NamingException e) {
			e.printStackTrace();
		}
	}

}
