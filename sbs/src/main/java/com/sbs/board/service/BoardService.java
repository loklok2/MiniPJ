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
import com.sbs.board.domain.Image;
import com.sbs.board.repository.BoardRepository;
import com.sbs.board.repository.ImageRepository;

@Service
public class BoardService {

    @Autowired
    private BoardRepository boardRepo;
    
    @Autowired
    private ImageRepository imageRepo;

    // 모든 게시글을 조회하여 DTO로 반환
    public List<BoardDTO> getAllBoards() {
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

    // 게시글을 ID로 조회하고 조회수를 증가시키며, DTO로 반환
    public BoardDTO getBoardById(Long id) {
        Board board = boardRepo.findById(id).orElse(null);
        if (board != null) {
            board.setViewCount(board.getViewCount() + 1); // 조회수 증가
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

    // 게시글을 생성하고, 이미지를 저장하며, DTO로 반환
    public BoardDTO createBoard(BoardDTO boardDTO, Member member, List<MultipartFile> images) {
        Board board = new Board();
        board.setTitle(boardDTO.getTitle());
        board.setContent(boardDTO.getContent());
        board.setAuthor(member);
        board.setAuthorNickname(member.getNickname());
        board.setCreateDate(LocalDateTime.now());
        board.setUpdateDate(LocalDateTime.now());
        board.setViewCount(boardDTO.getViewCount());
        board.setLikeCount(boardDTO.getLikeCount());
        
        Board createdBoard = boardRepo.save(board);

        // 이미지를 저장
        if (images != null && !images.isEmpty()) {
            for (MultipartFile imageFile : images) {
                Image image = new Image();
                image.setFilename(imageFile.getOriginalFilename());
                try {
                    image.setData(imageFile.getBytes());
                } catch (Exception e) {
                    e.printStackTrace();
                }
                image.setBoard(createdBoard);
                imageRepo.save(image);
            }
        }

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

    // 게시글을 수정하는 메서드. 작성자와 현재 사용자를 비교하여 권한이 있는 경우에만 수정
    public BoardDTO updateBoard(Long id, BoardDTO boardDTO, List<MultipartFile> images, String currentUsername) {
        Board board = boardRepo.findById(id).orElse(null);
        if (board != null && board.getAuthor().getUsername().equals(currentUsername)) {
            board.setTitle(boardDTO.getTitle());
            board.setContent(boardDTO.getContent());
            board.setUpdateDate(LocalDateTime.now());
            Board updatedBoard = boardRepo.save(board);

            // 이미지 업데이트 로직
            if (images != null && !images.isEmpty()) {
                imageRepo.deleteByBoard(updatedBoard); // 기존 이미지를 삭제하고
                for (MultipartFile imageFile : images) {
                    Image image = new Image();
                    image.setFilename(imageFile.getOriginalFilename());
                    try {
                        image.setData(imageFile.getBytes());
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    image.setBoard(updatedBoard);
                    imageRepo.save(image);
                }
            }

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
        return null; // 권한이 없거나 게시글이 없는 경우 null 반환
    }

    // 게시글을 삭제하는 메서드. 작성자와 현재 사용자를 비교하여 권한이 있는 경우에만 삭제
    public boolean deleteBoard(Long id, String currentUsername) {
        Board board = boardRepo.findById(id).orElse(null);
        if (board != null && board.getAuthor().getUsername().equals(currentUsername)) {
            imageRepo.deleteByBoard(board); // 관련 이미지 삭제
            boardRepo.deleteById(id); // 게시글 삭제
            return true;
        }
        return false; // 권한이 없거나 게시글이 없는 경우 false 반환
    }
    
    // 게시글 좋아요 수 증가
    public BoardDTO likeBoard(Long id) {
        Board board = boardRepo.findById(id).orElse(null);
        if (board != null) {
            board.setLikeCount(board.getLikeCount() + 1);
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
