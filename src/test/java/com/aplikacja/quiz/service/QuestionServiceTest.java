package com.aplikacja.quiz.service;

import com.aplikacja.quiz.model.Question;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class QuestionServiceTest {


    @Test
    void should_createQuestions() {
        QuestionService questionService = new QuestionService();
        String[] firstQuestionData = new String[]{"content", "answerA", "answerB", "answerC", "answerD", "correctAnswer"};
        List<String[]> dataQuestions = new ArrayList<>();
        dataQuestions.add(firstQuestionData);

        List<Question> createdQuestions = questionService.createQuestions(dataQuestions);
        assertAll("question",
                () -> assertEquals("content", createdQuestions.get(0).getContent()),
                () -> assertEquals("answerA", createdQuestions.get(0).getAnswerA()),
                () -> assertEquals("answerB", createdQuestions.get(0).getAnswerB()),
                () -> assertEquals("answerC", createdQuestions.get(0).getAnswerC()),
                () -> assertEquals("answerD", createdQuestions.get(0).getAnswerD()),
                () -> assertEquals("correctAnswer", createdQuestions.get(0).getGoodAnswer())
        );
    }


}