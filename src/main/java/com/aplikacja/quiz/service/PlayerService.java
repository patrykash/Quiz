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
        List<Player> playerList = getPlayers();
        int playersNumber = playerList.size();
        Player lastPlayer = playerList.get(playersNumber - 1);
        if (playersNumber < 10) {
            playerRepository.save(player);
        } else if (lastPlayer.getPoints() < player.getPoints()) {
            playerRepository.save(player);
        }
    }

    public List<Player> getPlayers() {
        return playerRepository.findAll(Sort.by(Sort.Direction.DESC, "points"));
    }

}
