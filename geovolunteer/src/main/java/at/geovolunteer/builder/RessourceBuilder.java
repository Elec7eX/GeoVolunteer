package at.geovolunteer.builder;

import at.geovolunteer.model.Ressource;

/**
 * Builder für Ressource-Objekte.
 */
public class RessourceBuilder extends AbstractAktivitaetBuilder<Ressource, RessourceBuilder> {

	public RessourceBuilder() {
		super(new Ressource());
	}

	public RessourceBuilder materialien(String materialien) {
		entity.setMaterialien(materialien);
		return this;
	}

	public RessourceBuilder sicherheitsanforderungen(String sicherheitsanforderungen) {
		entity.setSicherheitsanforderungen(sicherheitsanforderungen);
		return this;
	}

	public RessourceBuilder anmerkung(String anmerkung) {
		entity.setAnmerkung(anmerkung);
		return this;
	}

	@Override
	public Ressource build() {
		return entity;
	}
}