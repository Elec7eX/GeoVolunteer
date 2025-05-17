package at.geovolunteer.rest.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "ressource")
public class Ressource extends AbstractAktivitaet {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String materialien;
	private String sicherheitsanforderungen;
	private String anmerkung;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

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
