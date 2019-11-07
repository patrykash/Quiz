package com.aplikacja.quiz.controller;

import com.aplikacja.quiz.model.Question;
import com.aplikacja.quiz.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/question")
public class QuestionController {


    private QuestionRepository questionRepository;

    @Autowired
    public QuestionController(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @RequestMapping(value = "/get", method = RequestMethod.GET)
    public List<Question> getQuestions() {
       return questionRepository.findAll();
    }
}
