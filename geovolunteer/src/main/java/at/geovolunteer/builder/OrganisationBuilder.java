package at.geovolunteer.builder;

import at.geovolunteer.model.Benutzer;
import at.geovolunteer.model.Rolle;
import at.geovolunteer.model.repo.BenutzerRepository;

public class OrganisationBuilder extends AbstractBenutzerBuilder<OrganisationBuilder> {

	private String name;
	private String webseite;

	public OrganisationBuilder(BenutzerRepository benutzerRepository) {
		super(benutzerRepository);
		this.rolle = Rolle.ORGANISATION;
	}

	public OrganisationBuilder name(String name) {
		this.name = name;
		return self();
	}

	public OrganisationBuilder webseite(String webseite) {
		this.webseite = webseite;
		return self();
	}

	@Override
	public Benutzer build() {
		Benutzer b = new Benutzer();
		applyCommonFields(b);
		b.setName(name);
		b.setWebseite(webseite);
		b.setRolle(Rolle.ORGANISATION);
		return benutzerRepository.save(b);
	}

}
