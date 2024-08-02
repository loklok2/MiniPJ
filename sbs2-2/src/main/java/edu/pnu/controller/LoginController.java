package edu.pnu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import edu.pnu.Service.MemberService;
import edu.pnu.domain.Member;


@Controller
public class LoginController {
	
	@Autowired
	private MemberService memberService;
	
	@GetMapping("/login")
	public void login() {
		System.out.println("login 요청");
	}
		
	@GetMapping("/loginSuccess")
	public void loginSuccess() {
		System.out.println("loginSuccess 요청");
	}
	
	
	//컨트롤러로 오기도전에 필터가 가로채서 무의미한 코드임
//	@PostMapping("/login/oauth2/code")
//	public String loginSuccess2(Member member) {
//	    try {
//	        memberService.save(member);
//	        return "redirect:/loginSuccess";
//	    } catch (Exception e) {
//	        System.err.println(e.getMessage());
//	        return "redirect:/error";
//	    }
//	}
	
	@GetMapping("/oauth")
	public @ResponseBody String auth(@AuthenticationPrincipal OAuth2User user) {
		if (user == null) {
			return "OAuth2:null";
		}
		
		System.out.println("attributes:" + user.getAttributes());
		
		return "OAuth2:" + user;
	}
}
