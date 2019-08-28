package com.aplikacja.quiz.controller;

import com.aplikacja.quiz.model.Question;
import com.aplikacja.quiz.repository.QuestionRepository;
import com.aplikacja.quiz.service.DataInFile;
import com.aplikacja.quiz.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/question")
public class QuestionController {

    private QuestionService questionService;

    private DataInFile dataInFile;

    private QuestionRepository questionRepository;

    @Autowired
    public QuestionController(QuestionService questionService, DataInFile dataInFile, QuestionRepository questionRepository) {
        this.questionService = questionService;
        this.dataInFile = dataInFile;
        this.questionRepository = questionRepository;
    }

    @RequestMapping(value = "/add-all", method = RequestMethod.POST)
    public List<Question>  addAll() {
        List<String[]> dataList = dataInFile.getData("src\\main\\resources\\static\\Dane testowe.csv");
        List<Question> questions = questionService.createQuestions(dataList);
        return questionRepository.saveAll(questions);
    }

    @RequestMapping(value = "/get", method = RequestMethod.GET)
    public List<Question> getQuestions() {
       return questionRepository.findAll();
    }
}
