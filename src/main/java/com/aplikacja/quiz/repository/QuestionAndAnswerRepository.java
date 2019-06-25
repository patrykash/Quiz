package com.aplikacja.quiz.repository;

import com.aplikacja.quiz.model.QuestionAndAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionAndAnswerRepository extends JpaRepository<QuestionAndAnswer, Long> {

}
