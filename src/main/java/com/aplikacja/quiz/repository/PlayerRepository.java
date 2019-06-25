package com.aplikacja.quiz.repository;

import com.aplikacja.quiz.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlayerRepository extends JpaRepository<Player, Long> {


}
