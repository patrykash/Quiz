package com.aplikacja.quiz.controller;

import com.aplikacja.quiz.model.QuestionAndAnswer;
import com.aplikacja.quiz.service.QuestionAndAnswerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/questionAndAnswer")
public class QuestionAndAnswerController {

    private QuestionAndAnswerService questionAndAnswerService;

    public QuestionAndAnswerController(QuestionAndAnswerService questionAndAnswerService) {
        this.questionAndAnswerService = questionAndAnswerService;
    }

    @RequestMapping(value = "/save", method = RequestMethod.GET)
    public ResponseEntity<?> saveQuestionsAndAnswers() {
        questionAndAnswerService.save();
        Map<String, String> result = new HashMap<>();
        result.put("result", "success");
        return ResponseEntity.accepted().body(result);
    }

    @RequestMapping(value = "/get", method = RequestMethod.GET)
    public List<QuestionAndAnswer> getQuestionsAndAnswers() {
       return questionAndAnswerService.getQuestions();
    }
}
