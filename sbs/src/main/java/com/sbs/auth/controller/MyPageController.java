package com.sbs.auth.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sbs.auth.domain.UserInfo;
import com.sbs.auth.domain.Member;
import com.sbs.auth.repository.MemberRepository;
import com.sbs.auth.service.MemberService;
import com.sbs.board.domain.Board;
import com.sbs.board.domain.Comment;
import com.sbs.board.repository.BoardRepository;
import com.sbs.board.repository.CommentRepository;

@RestController
@RequestMapping("/api/mypage")
public class MyPageController {

    @Autowired
    private MemberService memberService;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private CommentRepository commentRepository;
    
    // ���� �α��ε� ������� ������ ��ȯ�մϴ�.
    @GetMapping("/info")
    public ResponseEntity<UserInfo> getMyInfo(Authentication authentication) {
        String username = authentication.getName();
        UserInfo userInfo = memberService.getUserInfo(username);
        return new ResponseEntity<>(userInfo, HttpStatus.OK);
    }
    
    // ���� �α��ε� ����ڰ� �ۼ��� �Խñ� ��� ��ȯ
    @GetMapping("/my-boards")
    public ResponseEntity<List<Board>> getMyBoards(Authentication authentication) {
        String username = authentication.getName();
        Member member = memberRepository.findByUsername(username).orElse(null);

        if (member == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<Board> boards = boardRepository.findByAuthor(member);
        return new ResponseEntity<>(boards, HttpStatus.OK);
    }
    
    // ���� �α��ε� ����ڰ� �ۼ��� ��� ��� ��ȯ
    @GetMapping("/my-comments")
    public ResponseEntity<List<Comment>> getMyComments(Authentication authentication) {
        String username = authentication.getName();
        Member member = memberRepository.findByUsername(username).orElse(null);

        if (member == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<Comment> comments = commentRepository.findByAuthor(member);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }
}
