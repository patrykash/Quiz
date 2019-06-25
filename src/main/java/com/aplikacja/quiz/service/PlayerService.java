package com.aplikacja.quiz.service;

import com.aplikacja.quiz.model.Player;
import com.aplikacja.quiz.repository.PlayerRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlayerService {

    private PlayerRepository playerRepository;

    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    public void addPlayer(Player player) {
        playerRepository.save(player);
    }

    public List<Player> getPlayers() {
        return playerRepository.findAll(Sort.by(Sort.Direction.DESC, "points"));
    }

}
