package at.geovolunteer.rest.model;

public class RessourceModel extends AbstractAktivitaetModel {

	private String materialien;
	private String sicherheitsanforderungen;
	private String anmerkung;

	public String getMaterialien() {
		return materialien;
	}

	public void setMaterialien(String materialien) {
		this.materialien = materialien;
	}

	public String getSicherheitsanforderungen() {
		return sicherheitsanforderungen;
	}

	public void setSicherheitsanforderungen(String sicherheitsanforderungen) {
		this.sicherheitsanforderungen = sicherheitsanforderungen;
	}

	public String getAnmerkung() {
		return anmerkung;
	}

	public void setAnmerkung(String anmerkung) {
		this.anmerkung = anmerkung;
	}

}
