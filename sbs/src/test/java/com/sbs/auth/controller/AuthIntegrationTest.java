package com.sbs.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sbs.board.domain.Board;
import com.sbs.board.domain.BoardDTO;
import com.sbs.board.domain.Comment;
import com.sbs.board.domain.CommentDTO;
import com.sbs.board.repository.BoardRepository;
import com.sbs.board.repository.CommentRepository;
import com.sbs.auth.domain.Member;
import com.sbs.auth.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private MemberRepository memberRepository;

    private Long testBoardId;
    private Long testCommentId;

    @BeforeEach
    public void setup() {
        // 테스트용 사용자 생성
        Member member = memberRepository.findByUsername("testuser")
                .orElseGet(() -> {
                    Member newMember = new Member();
                    newMember.setUsername("testuser");
                    newMember.setPassword("testpassword");
                    newMember.setNickname("Test User");
                    return memberRepository.save(newMember);
                });

        // 테스트용 게시글 생성
        Board board = new Board();
        board.setTitle("Test Board Title");
        board.setContent("Test Board Content");
        board.setAuthor(member);
        board.setAuthorNickname(member.getNickname());
        board.setCreateDate(LocalDateTime.now());
        board.setUpdateDate(LocalDateTime.now());
        board = boardRepository.save(board);
        testBoardId = board.getId();

        // 테스트용 댓글 생성
        Comment comment = new Comment();
        comment.setContent("Test Comment Content");
        comment.setBoard(board);
        comment.setAuthor(member);
        comment.setAuthorNickname(member.getNickname());
        comment = commentRepository.save(comment);
        testCommentId = comment.getId();
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    public void testCreateBoard() throws Exception {
        BoardDTO boardDTO = new BoardDTO();
        boardDTO.setTitle("New Test Board Title");
        boardDTO.setContent("New Test Board Content");

        mockMvc.perform(post("/api/boards/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(boardDTO)))
                .andExpect(MockMvcResultMatchers.status().isCreated());
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    public void testGetBoardById() throws Exception {
        mockMvc.perform(get("/api/boards/{id}", testBoardId))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    public void testUpdateBoard() throws Exception {
        BoardDTO boardDTO = new BoardDTO();
        boardDTO.setTitle("Updated Board Title");
        boardDTO.setContent("Updated Board Content");

        mockMvc.perform(put("/api/boards/{id}", testBoardId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(boardDTO)))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    public void testDeleteBoard() throws Exception {
        mockMvc.perform(delete("/api/boards/{id}", testBoardId))
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    public void testGetMyInfo() throws Exception {
        mockMvc.perform(get("/api/mypage/info"))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    public void testCreateComment() throws Exception {
        CommentDTO commentDTO = new CommentDTO();
        commentDTO.setContent("New Test Comment Content");
        commentDTO.setBoardId(testBoardId);

        mockMvc.perform(post("/api/comments/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(commentDTO)))
                .andExpect(MockMvcResultMatchers.status().isCreated());
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    public void testUpdateComment() throws Exception {
        String newContent = "Updated Comment Content";

        mockMvc.perform(put("/api/comments/{id}", testCommentId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(newContent))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    public void testDeleteComment() throws Exception {
        mockMvc.perform(delete("/api/comments/{id}", testCommentId))
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }
}
