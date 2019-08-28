package com.aplikacja.quiz.controller;

import com.aplikacja.quiz.model.Question;
import com.aplikacja.quiz.service.DataInFile;
import com.aplikacja.quiz.service.QuestionAndAnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/questionAndAnswer")
public class QuestionAndAnswerController {

    private QuestionAndAnswerService questionAndAnswerService;

    private DataInFile dataInFile;

    @Autowired
    public QuestionAndAnswerController(QuestionAndAnswerService questionAndAnswerService, DataInFile dataInFile) {
        this.questionAndAnswerService = questionAndAnswerService;
        this.dataInFile = dataInFile;
    }

    @RequestMapping(value = "/add-all", method = RequestMethod.POST)
    public List<Question>  addAll() {
        List<String[]> dataList = dataInFile.getData("src\\main\\resources\\static\\Dane testowe.csv");
        List<Question> questions = questionAndAnswerService.create(dataList);
        return questionAndAnswerService.addAll(questions);
    }

    @RequestMapping(value = "/get", method = RequestMethod.GET)
    public List<Question> getQuestionsAndAnswers() {
       return questionAndAnswerService.getQuestions();
    }
}
