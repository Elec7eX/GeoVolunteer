package at.geovolunteer.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.FluentQuery.FetchableFluentQuery;
import org.springframework.stereotype.Service;

import at.geovolunteer.model.Benutzer;
import at.geovolunteer.model.repo.BenutzerRepository;

@Service
public class BenutzerService implements BenutzerRepository {
	
	@Autowired
	private BenutzerRepository benutzerRepository;
	
	public Benutzer authenticate(String username, String password) {
		Optional<Benutzer> benutzer = benutzerRepository.findByUsername(username).stream().findFirst();
		if(benutzer.isPresent() && passwordMatches(password, benutzer.get().getPassword())) {
			return benutzer.get();
		}
		return null;
     }

	@Override
	public List<Benutzer> findByUsername(String username) {
		List<Benutzer> benutzer = new ArrayList<Benutzer>();
		benutzerRepository.findByUsername(username).forEach(benutzer::add);
		return benutzer;
	}

     private boolean passwordMatches(String rawPassword, String hashedPassword) {
         return rawPassword.toLowerCase().equals(hashedPassword.toLowerCase());
     }

	@Override
	public List<Benutzer> findByVorname(String vorname) {
		List<Benutzer> benutzer = new ArrayList<Benutzer>();
		benutzerRepository.findByVorname(vorname).forEach(benutzer::add);
		return benutzer;
	}

	@Override
	public List<Benutzer> findByNachname(String nachname) {
		List<Benutzer> benutzer = new ArrayList<Benutzer>();
		benutzerRepository.findByNachname(nachname).forEach(benutzer::add);
		return benutzer;
	}
	
	@Override
	public List<Benutzer> findByGeburtsDatum(LocalDate geburtsDatum) {
		List<Benutzer> benutzer = new ArrayList<Benutzer>();
		benutzerRepository.findByGeburtsDatum(geburtsDatum).forEach(benutzer::add);
		return benutzer;
	}

	@Override
	public List<Benutzer> findByEmail(String email) {
		List<Benutzer> benutzer = new ArrayList<Benutzer>();
		benutzerRepository.findByEmail(email).forEach(benutzer::add);
		return benutzer;
	}

	@Override
	public <S extends Benutzer> List<S> saveAll(Iterable<S> entities) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Benutzer> findAll() {
		List<Benutzer> tutorials = new ArrayList<Benutzer>();
		benutzerRepository.findAll().forEach(tutorials::add);
		return tutorials;
	}

	@Override
	public List<Benutzer> findAllById(Iterable<Long> ids) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public <S extends Benutzer> S save(S entity) {
		return benutzerRepository.save(entity);
	}

	@Override
	public Optional<Benutzer> findById(Long id) {
		return Optional.of(benutzerRepository.findById(id).orElseThrow());
	}

	@Override
	public boolean existsById(Long id) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public long count() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public void deleteById(Long id) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void delete(Benutzer entity) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void deleteAllById(Iterable<? extends Long> ids) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void deleteAll(Iterable<? extends Benutzer> entities) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void deleteAll() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public List<Benutzer> findAll(Sort sort) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Page<Benutzer> findAll(Pageable pageable) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public <S extends Benutzer> Optional<S> findOne(Example<S> example) {
		// TODO Auto-generated method stub
		return Optional.empty();
	}

	@Override
	public <S extends Benutzer> Page<S> findAll(Example<S> example, Pageable pageable) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public <S extends Benutzer> long count(Example<S> example) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public <S extends Benutzer> boolean exists(Example<S> example) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public <S extends Benutzer, R> R findBy(Example<S> example, Function<FetchableFluentQuery<S>, R> queryFunction) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void flush() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public <S extends Benutzer> S saveAndFlush(S entity) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public <S extends Benutzer> List<S> saveAllAndFlush(Iterable<S> entities) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void deleteAllInBatch(Iterable<Benutzer> entities) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void deleteAllByIdInBatch(Iterable<Long> ids) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void deleteAllInBatch() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public Benutzer getOne(Long id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Benutzer getById(Long id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Benutzer getReferenceById(Long id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public <S extends Benutzer> List<S> findAll(Example<S> example) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public <S extends Benutzer> List<S> findAll(Example<S> example, Sort sort) {
		// TODO Auto-generated method stub
		return null;
	}

}
