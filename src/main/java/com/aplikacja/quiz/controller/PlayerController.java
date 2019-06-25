package com.aplikacja.quiz.controller;

import com.aplikacja.quiz.model.Player;
import com.aplikacja.quiz.service.PlayerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/players")
public class PlayerController {

    private PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @RequestMapping(value = "/save", method = RequestMethod.POST)
    public ResponseEntity<?> savePlayer(@RequestBody Player player) {
        Player newPlayer = new Player();
        System.out.println(player.getNickName());
        newPlayer.setNickName(player.getNickName());
        newPlayer.setPoints(player.getPoints());
        playerService.addPlayer(newPlayer);
        Map<String, String> result = new HashMap<>();
        result.put("result", "success");
        return ResponseEntity.accepted().body(result);
    }


    @RequestMapping(value = "/get", method = RequestMethod.GET)
    public List<Player> getPlayers() {
        return  playerService.getPlayers();
    }
}
