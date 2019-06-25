package com.aplikacja.quiz;

import com.aplikacja.quiz.repository.QuestionAndAnswerRepository;
import com.aplikacja.quiz.service.QuestionAndAnswerService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class QuizApplication {

    public static void main(String[] args) {
        SpringApplication.run(QuizApplication.class, args);
    }

}
