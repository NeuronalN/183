package com.security3;
/*
import com.security3.model.Event;
import com.security3.model.Group;
import com.security3.model.GroupRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Collections;
import java.util.stream.Stream;

@Component
class Initializer implements CommandLineRunner {

    private final GroupRepository repository;

    public Initializer(GroupRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... strings) {
        Stream.of("Boston", "Washington").forEach(name ->
                repository.save(new Group(name))
        );

        Group djug = repository.findByName("Boston");
        Event e = Event.builder().title("Full Stack Reactive")
                .description("Reactive with Spring Boot")
                .build();
        djug.setEvents(Collections.singleton(e));
        repository.save(djug);

        repository.findAll().forEach(System.out::println);
    }
}
*/