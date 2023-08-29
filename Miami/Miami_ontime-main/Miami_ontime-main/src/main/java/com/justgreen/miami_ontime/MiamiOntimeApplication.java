package com.justgreen.miami_ontime;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class MiamiOntimeApplication {

    public static void main(String[] args) {
        SpringApplication.run(MiamiOntimeApplication.class, args);
    }
}
