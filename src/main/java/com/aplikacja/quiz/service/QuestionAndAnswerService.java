package com.aplikacja.quiz.service;

import com.aplikacja.quiz.model.QuestionAndAnswer;
import com.aplikacja.quiz.repository.QuestionAndAnswerRepository;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class QuestionAndAnswerService {

    private final static String DELIMITER = "'";

    private final static int QUESTION = 0;

    private final static int  ANSWER_A = 1;

    private final static int ANSWER_B = 2;

    private final static int ANSWER_C = 3;

    private final static int ANSWER_D = 4;

    private final static int CORRECT_ANSWER = 5;

    private final static int CATEGORY = 6;








    private QuestionAndAnswerRepository questionAndAnswerRepository;

    public QuestionAndAnswerService(QuestionAndAnswerRepository questionAndAnswerRepository) {
        this.questionAndAnswerRepository = questionAndAnswerRepository;
    }

    public void save() {
        List<QuestionAndAnswer> questionAndAnswers = getFromFile("src\\main\\resources\\static\\Dane testowe.csv");
        questionAndAnswerRepository.saveAll(questionAndAnswers);
    }
    private List<QuestionAndAnswer> getFromFile(String fileToParse) {
        BufferedReader fileReader = null;
        List<QuestionAndAnswer> questionAndAnswers = new ArrayList<>();
        try {
            fileReader = new BufferedReader((new FileReader(fileToParse)));
            String line;
            String [] tokens;
            while ((line = fileReader.readLine()) != null) {
                tokens = line.split(DELIMITER);
                QuestionAndAnswer questionAndAnswer = new QuestionAndAnswer(tokens[QUESTION], tokens[ANSWER_A],
                        tokens[ANSWER_B], tokens[ANSWER_C], tokens[ANSWER_D], tokens[CORRECT_ANSWER],tokens[CATEGORY]);
                questionAndAnswers.add(questionAndAnswer);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            if (fileReader != null) {
                try {
                    fileReader.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return questionAndAnswers;
    }

    public List<QuestionAndAnswer>getQuestions() {
        return questionAndAnswerRepository.findAll();
    }
    private QuestionAndAnswer drawQuestion() {
        Random random = new Random();
        List<QuestionAndAnswer> questionAndAnswers = questionAndAnswerRepository.findAll();
        int numberOfQuestion = random.nextInt(questionAndAnswers.size());
        return questionAndAnswers.get(numberOfQuestion);
    }
}
