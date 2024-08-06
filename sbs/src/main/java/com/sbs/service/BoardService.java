package com.sbs.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sbs.domain.Board;
import com.sbs.persistence.BoardRepository;

@Service  // 이 클래스가 Spring의 서비스 레이어를 나타내며, 비즈니스 로직을 처리하는 클래스임을 나타냅니다.
public class BoardService {
	
	@Autowired  // BoardRepository를 자동으로 주입받습니다.
	private BoardRepository boardRepo;
	
	
	// 전체 게시글 목록을 조회하는 메서드
	public List<Board> getAllBoards(){
		// 모든 게시글을 데이터베이스에서 조회하여 반환합니다.
		return boardRepo.findAll();
	}
	
	// ID로 특정 게시글을 조회하는 메서드
	public Board getBoardById(Long id) {
		// 주어진 ID에 해당하는 게시글을 조회하여 반환합니다. 없을 경우 null을 반환합니다.
		return boardRepo.findById(id).orElse(null);
	}
	
	// 새로운 게시글을 작성하는 메서드
	public Board createBoard(Board board) {
		// 현재 시간을 게시글의 생성 시간으로 설정합니다.
		board.setCreateDate(LocalDateTime.now());
		// 게시글을 데이터베이스에 저장하고 저장된 객체를 반환합니다.
		return boardRepo.save(board);
	}
	
	// 기존 게시글을 수정하는 메서드
	public Board updateBoard(Long id, Board board2) {
		// 주어진 ID에 해당하는 게시글을 조회합니다.
		Board board = boardRepo.findById(id).orElse(null);
		if(board != null) {
			// 게시글이 존재하면 제목과 내용을 업데이트하고 수정 시간을 현재 시간으로 설정합니다.
			board.setTitle(board2.getTitle());
			board.setContent(board2.getContent());
			board.setUpdateDate(LocalDateTime.now());
			// 수정된 게시글을 데이터베이스에 저장하고 반환합니다.
			return boardRepo.save(board);
		}
		// 게시글이 존재하지 않으면 null을 반환합니다.
		return null;
	}
	
	// 특정 ID의 게시글을 삭제하는 메서드
	public boolean deleteBoard(Long id) {
		// 주어진 ID의 게시글이 존재하는지 확인합니다.
		if (boardRepo.existsById(id)) {
			// 게시글이 존재하면 삭제하고 true를 반환합니다.
			boardRepo.deleteById(id);
			return true;
		}
		// 게시글이 존재하지 않으면 false를 반환합니다.
		return false;
	}

}
