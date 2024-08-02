package com.sbs.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sbs.domain.Board;
import com.sbs.service.BoardService;

@RestController
@RequestMapping("/api/boards")
public class BoardController {

	@Autowired
	private BoardService boardService;
	
	@GetMapping
	public ResponseEntity<List<Board>> getAllBoards() {
		return new ResponseEntity<>(boardService.getAllBoards(), HttpStatus.OK);
	}
	
	//@PathVariable를 써야지 url에 매개변수로 값전달이 가능함
	@GetMapping("/{id}")
	public ResponseEntity<Board> getBoardById(@PathVariable Long id) {
		Board board = boardService.getBoardById(id);
		if (board != null) {
			return new ResponseEntity<>(board, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
	
	@PostMapping
	public ResponseEntity<Board> createBoard(@RequestBody Board board) {
		return new ResponseEntity<>(boardService.createBoard(board), HttpStatus.CREATED);
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<Board> updateBoard(@PathVariable Long id, @RequestBody Board board2) {
		Board updatedBoard = boardService.updateBoard(id, board2);
		if (updatedBoard != null) {
			return new ResponseEntity<>(updatedBoard, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteBoard(@PathVariable Long id) {
		if (boardService.deleteBoard(id)) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
}
