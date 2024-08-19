package com.sbs.board.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sbs.auth.domain.Member;
import com.sbs.board.domain.Board;
import com.sbs.board.domain.BoardDTO;
import com.sbs.board.domain.ImageDTO;
import com.sbs.board.repository.BoardRepository;

import jakarta.transaction.Transactional;

@Service
public class BoardService {

    @Autowired
    private BoardRepository boardRepo;
    
    @Autowired
    private ImageService imageService;

    // 모든 게시글을 조회하여 DTO로 반환
    public List<BoardDTO> getAllBoards() {
        return boardRepo.findAll().stream()
            .map(this::convertToDTO) // convertToDTO 메서드로 변환 작업을 통합
            .collect(Collectors.toList());
    }

    // 게시글을 ID로 조회하고 조회수를 증가시키며, DTO로 반환
    public BoardDTO getBoardById(Long id) {
        Board board = boardRepo.findById(id).orElse(null);
        
        if (board == null) {
            return null;
        }

        board.setViewCount(board.getViewCount() + 1);
        boardRepo.save(board);

        return convertToDTO(board); // 변환 작업을 통합
    }

    // 게시글을 생성하고, 이미지를 저장하며, DTO로 반환
    @Transactional
    public BoardDTO createBoard(BoardDTO boardDTO, Member member, List<MultipartFile> images) {
    	
    	
        Board board = new Board();
        board.setTitle(boardDTO.getTitle());
        board.setContent(boardDTO.getContent());
        board.setAuthor(member);
        board.setAuthorNickname(member.getNickname());
        board.setCreateDate(LocalDateTime.now());
        board.setUpdateDate(LocalDateTime.now());
        board.setViewCount(0);
        board.setLikeCount(0);
        
        Board createdBoard = boardRepo.save(board);

        // 새로 생성된 게시물에 이미지를 추가
        imageService.addImagesToBoard(createdBoard, images);

        return convertToDTO(createdBoard); // 변환 작업을 통합
    }

    // 게시글을 수정하는 메서드. 작성자와 현재 사용자를 비교하여 권한이 있는 경우에만 수정
    @Transactional
    public BoardDTO updateBoard(Long id, BoardDTO boardDTO, List<MultipartFile> images, String currentUsername) {
        Board board = boardRepo.findById(id).orElse(null);
        if (board != null && board.getAuthor().getUsername().equals(currentUsername)) {
            board.setTitle(boardDTO.getTitle());
            board.setContent(boardDTO.getContent());
            board.setUpdateDate(LocalDateTime.now());

            // 기존 이미지를 삭제하고 새로운 이미지를 추가
            if (images != null && !images.isEmpty()) {
                imageService.deleteImagesByBoard(board);
                imageService.addImagesToBoard(board, images);
            }

            Board updatedBoard = boardRepo.save(board);
            
            return convertToDTO(updatedBoard); // 변환 작업을 통합
        }
        return null; // 권한이 없거나 게시글이 없는 경우 null 반환
    }

    // 게시글을 삭제하는 메서드. 작성자와 현재 사용자를 비교하여 권한이 있는 경우에만 삭제
    @Transactional
    public boolean deleteBoard(Long id, String currentUsername) {
        Board board = boardRepo.findById(id).orElse(null);
        if (board != null && board.getAuthor().getUsername().equals(currentUsername)) {
            // 게시물에 연관된 이미지 모두 삭제
            imageService.deleteImagesByBoard(board);
            boardRepo.deleteById(id);
            return true;
        }
        return false; // 권한이 없거나 게시글이 없는 경우 false 반환
    }
    
    // 게시글 좋아요 수 증가
    public BoardDTO likeBoard(Long id) {
        Board board = boardRepo.findById(id).orElse(null);
        
        if (board == null) {
            return null;
        }

        board.setLikeCount(board.getLikeCount() + 1);
        Board updatedBoard = boardRepo.save(board);

        return convertToDTO(updatedBoard);
    }
    
    // 데이터베이스 엔티티(Board)를 클라이언트에 전달할 수 있는 형태(BoardDTO)로 변환하는 메서드
    private BoardDTO convertToDTO(Board board) {
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

        // 이미지 데이터를 DTO에 추가
        List<ImageDTO> images = imageService.getImagesByBoardId(board.getId());
        dto.setImages(images);

        return dto;
    }
    
}
