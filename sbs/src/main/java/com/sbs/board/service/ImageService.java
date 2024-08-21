package com.sbs.board.service;

import com.sbs.board.domain.Board;
import com.sbs.board.domain.Image;
import com.sbs.board.domain.ImageDTO;
import com.sbs.board.repository.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ImageService {

    @Autowired
    private ImageRepository imageRepo;

    private final String baseUrl = "http://localhost:8080/api/images/";

    // 특정 게시물에 이미지를 추가하는 메서드
    public void addImagesToBoard(Board board, List<MultipartFile> images) {
        if (images != null && !images.isEmpty()) {
            for (MultipartFile imageFile : images) {
                Image image = new Image();
                image.setFilename(imageFile.getOriginalFilename());
                try {
                    image.setData(imageFile.getBytes());
                    image.setMimeType(imageFile.getContentType());
                } catch (Exception e) {
                    e.printStackTrace();
                }
                image.setBoard(board);
                imageRepo.save(image);
            }
        }
    }

    // 특정 게시물에 연결된 이미지를 삭제하는 메서드
    public void deleteImagesByBoard(Board board) {
        imageRepo.deleteByBoard(board);
    }

    // 특정 게시물에 속한 이미지를 모두 조회하여 ImageDTO 리스트로 반환
    public List<ImageDTO> getImagesByBoardId(Long boardId) {
        return imageRepo.findByBoardId(boardId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // 개별 이미지 조회
    public ResponseEntity<byte[]> getImageById(Long id) {
        Image image = imageRepo.findById(id)
                // 이미지를 찾을 수 없을 때 404 Not Found 상태 코드 반환
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "이미지를 찾을 수 없습니다."));

        HttpHeaders headers = new HttpHeaders();
        MediaType mediaType = MediaType.parseMediaType(image.getMimeType());
        headers.setContentType(mediaType);
        return new ResponseEntity<>(image.getData(), headers, HttpStatus.OK);
    }

    // Image 엔티티를 ImageDTO로 변환하는 메서드
    private ImageDTO convertToDTO(Image image) {
        // 이미지 URL 생성
        String imageUrl = baseUrl + image.getId();
        return new ImageDTO(
                image.getId(),
                image.getFilename(),
                image.getMimeType(),
                imageUrl
        );
    }
}
