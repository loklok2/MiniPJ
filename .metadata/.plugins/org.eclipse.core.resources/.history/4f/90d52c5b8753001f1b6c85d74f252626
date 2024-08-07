package com.sbs.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sbs.domain.Board;
import com.sbs.persistence.BoardRepository;

@Service
public class BoardService {
	
	@Autowired
	private BoardRepository boardRepo;
	
	
	//전체 보드 조회
	public List<Board> getAllBoards(){
		return boardRepo.findAll();
	}
	
	//id로 게시글 조회
	public Board getBoardById(Long id) {
		return boardRepo.findById(id).orElse(null);
	}
	
	//게시글 작성
	public Board createBoard(Board board) {
		board.setCreateDate(LocalDateTime.now());
		return boardRepo.save(board);
	}
	
	//게시글 업데이트(수정)
	public Board updateBoard(Long id, Board board2) {
		Board board = boardRepo.findById(id).orElse(null);
		if(board != null) {
			board.setTitle(board2.getTitle());
			board.setContent(board2.getContent());
			board.setUpdateDate(LocalDateTime.now());
			return boardRepo.save(board);
		}
		return null;
	}
	
	//게시글 삭제
	public boolean deleteBoard(Long id) {
		if (boardRepo.existsById(id)) {
			boardRepo.deleteById(id);
			return true;
		}
		return false;
	}

}
