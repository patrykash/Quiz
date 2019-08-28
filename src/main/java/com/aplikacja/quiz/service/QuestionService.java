package com.aplikacja.quiz.service;

import com.aplikacja.quiz.model.Question;
import com.aplikacja.quiz.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class QuestionService {

    private final static int QUESTION = 0;

    private final static int  ANSWER_A = 1;

    private final static int ANSWER_B = 2;

    private final static int ANSWER_C = 3;

    private final static int ANSWER_D = 4;

    private final static int CORRECT_ANSWER = 5;

    public List<Question> createQuestions(List<String[]> data) {
        List<Question> questions = new ArrayList<>();
        for (String[] questionAndAnswerData : data) {
            Question question = new Question(questionAndAnswerData[QUESTION],
                    questionAndAnswerData[ANSWER_A], questionAndAnswerData[ANSWER_B], questionAndAnswerData[ANSWER_C],
                    questionAndAnswerData[ANSWER_D], questionAndAnswerData[CORRECT_ANSWER]);
            questions.add(question);
        }
        return questions;
    }


}
