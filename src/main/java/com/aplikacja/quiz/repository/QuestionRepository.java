package com.aplikacja.quiz.repository;

import com.aplikacja.quiz.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionAndAnswerRepository extends JpaRepository<Question, Long> {

}
