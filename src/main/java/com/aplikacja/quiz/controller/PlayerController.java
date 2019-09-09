package com.aplikacja.quiz.controller;

import com.aplikacja.quiz.model.Player;
import com.aplikacja.quiz.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/players")
public class PlayerController {

    private PlayerService playerService;


    @Autowired
    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @RequestMapping(value = "/save", method = RequestMethod.POST)
    public String savePlayer(@RequestBody Player player) {
        return playerService.addPlayer(player);
    }


    @RequestMapping(value = "/get", method = RequestMethod.GET)
    public List<Player> getPlayers() {
        return  playerService.getSortDescPlayers();
    }


}
