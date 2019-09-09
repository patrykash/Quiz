package com.aplikacja.quiz.service;

import com.aplikacja.quiz.model.Player;
import com.aplikacja.quiz.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PlayerService {

    private PlayerRepository playerRepository;

    @Autowired
    PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    public String addPlayer(Player player) {
        if (canAddPlayer(player)) {
            playerRepository.save(player);
            return "Player was added";
        } else {
            return "Player can't be added";
        }
    }

     boolean canAddPlayer(Player player) {
        List<Player> playerList = getSortDescPlayers();
        int playersNumber = playerList.size();
        if (playersNumber < 10) {
           return true;
        } else return playerList.get(playersNumber - 1).getPoints() < player.getPoints();
    }
    

    public List<Player> getSortDescPlayers() {
        return playerRepository.findAll(Sort.by(Sort.Direction.DESC, "points"));
    }

}
