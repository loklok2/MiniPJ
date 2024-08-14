package com.sbs.board.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sbs.auth.domain.Member;
import com.sbs.board.domain.Board;
import com.sbs.board.domain.BoardDTO;
import com.sbs.board.repository.BoardRepository;

@Service
public class BoardService {

    @Autowired
    private BoardRepository boardRepo;

    public List<BoardDTO> getAllBoards() {
        // 전체 게시글 목록을 조회하고, BoardDTO로 변환하여 반환합니다.
        return boardRepo.findAll().stream().map(board -> {
            BoardDTO dto = new BoardDTO();
            dto.setId(board.getId());
            dto.setTitle(board.getTitle());
            dto.setContent(board.getContent());
            dto.setAuthorNickname(board.getAuthorNickname());
            dto.setAuthorId(board.getAuthor().getId());
            dto.setCreateDate(board.getCreateDate());
            dto.setUpdateDate(board.getUpdateDate());
            dto.setViewCount(board.getViewCount());
            dto.setLikeCount(board.getLikeCount());
            return dto;
        }).collect(Collectors.toList());
    }

    public BoardDTO getBoardById(Long id) {
        // ID로 특정 게시글을 조회하고, BoardDTO로 변환하여 반환합니다.
        Board board = boardRepo.findById(id).orElse(null);
        if (board != null) {
            board.setViewCount(board.getViewCount() + 1); // 조회수 증가 로직
            boardRepo.save(board); // 저장
            BoardDTO dto = new BoardDTO();
            dto.setId(board.getId());
            dto.setTitle(board.getTitle());
            dto.setContent(board.getContent());
            dto.setAuthorNickname(board.getAuthorNickname());
            dto.setAuthorId(board.getAuthor().getId());
            dto.setCreateDate(board.getCreateDate());
            dto.setUpdateDate(board.getUpdateDate());
            dto.setViewCount(board.getViewCount());
            dto.setLikeCount(board.getLikeCount());
            return dto;
        }
        return null;
    }

    public BoardDTO createBoard(BoardDTO boardDTO, Member member) {
        // 새로운 게시글을 작성하고, BoardDTO로 반환합니다.
        Board board = new Board();
        board.setTitle(boardDTO.getTitle());
        board.setContent(boardDTO.getContent());
        board.setAuthor(member);  // 작성자 설정
        board.setAuthorNickname(member.getNickname());  // 닉네임 설정
        board.setCreateDate(LocalDateTime.now());
        board.setUpdateDate(boardDTO.getUpdateDate());
        board.setViewCount(boardDTO.getViewCount());
        board.setLikeCount(boardDTO.getLikeCount());
        
        Board createdBoard = boardRepo.save(board);

        BoardDTO dto = new BoardDTO();
        dto.setId(createdBoard.getId());
        dto.setTitle(createdBoard.getTitle());
        dto.setContent(createdBoard.getContent());
        dto.setAuthorNickname(createdBoard.getAuthorNickname());
        dto.setAuthorId(createdBoard.getAuthor().getId());
        dto.setCreateDate(createdBoard.getCreateDate());
        dto.setUpdateDate(createdBoard.getUpdateDate());
        dto.setViewCount(createdBoard.getViewCount());
        dto.setLikeCount(createdBoard.getLikeCount());
        return dto;
    }

    public BoardDTO updateBoard(Long id, BoardDTO boardDTO) {
        // 기존 게시글을 수정하고, BoardDTO로 반환합니다.
        Board board = boardRepo.findById(id).orElse(null);
        if (board != null) {
            board.setTitle(boardDTO.getTitle());
            board.setContent(boardDTO.getContent());
            board.setUpdateDate(LocalDateTime.now());
            Board updatedBoard = boardRepo.save(board);

            BoardDTO dto = new BoardDTO();
            dto.setId(updatedBoard.getId());
            dto.setTitle(updatedBoard.getTitle());
            dto.setContent(updatedBoard.getContent());
            dto.setAuthorNickname(updatedBoard.getAuthorNickname());
            dto.setAuthorId(updatedBoard.getAuthor().getId());
            dto.setCreateDate(updatedBoard.getCreateDate());
            dto.setUpdateDate(updatedBoard.getUpdateDate());
            dto.setViewCount(updatedBoard.getViewCount());
            dto.setLikeCount(updatedBoard.getLikeCount());
            return dto;
        }
        return null;
    }

    public boolean deleteBoard(Long id) {
        // 특정 ID의 게시글을 삭제합니다.
        if (boardRepo.existsById(id)) {
            boardRepo.deleteById(id);
            return true;
        }
        return false;
    }
    
    public BoardDTO likeBoard(Long id) {
        // 게시글 좋아요를 증가시키고, BoardDTO로 반환합니다.
        Board board = boardRepo.findById(id).orElse(null);
        if (board != null) {
            board.setLikeCount(board.getLikeCount() + 1); // 좋아요 수 증가 로직
            Board updatedBoard = boardRepo.save(board);

            BoardDTO dto = new BoardDTO();
            dto.setId(updatedBoard.getId());
            dto.setTitle(updatedBoard.getTitle());
            dto.setContent(updatedBoard.getContent());
            dto.setAuthorNickname(updatedBoard.getAuthorNickname());
            dto.setAuthorId(updatedBoard.getAuthor().getId());
            dto.setCreateDate(updatedBoard.getCreateDate());
            dto.setUpdateDate(updatedBoard.getUpdateDate());
            dto.setViewCount(updatedBoard.getViewCount());
            dto.setLikeCount(updatedBoard.getLikeCount());
            return dto;
        }
        return null;
    }
}
