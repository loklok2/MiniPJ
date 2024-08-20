package com.sbs.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

	@Autowired
	private JavaMailSender mailSender;

	// 이메일 인증 메일 전송
	public void sendVerificationEmail(String toEmail, String verificationLink) {
		String subject = "이메일 인증을 진행해 주세요";
		String content = "<p>아래 링크를 클릭하여 이메일 인증을 완료하세요:</p>" + "<a href=\"" + verificationLink + "\">이메일 인증</a>";
		sendEmail(toEmail, subject, content);
	}

	// 비밀번호 재설정 메일 전송
	public void sendPasswordResetMail(String toEmail, String resetLink) {
		String subject = "비밀번호 재설정 안내";
		String content = "<p>비밀번호를 재설정하려면 아래 링크를 클릭하세요:</p>" + "<a href=\"" + resetLink + "\">비밀번호 재설정</a>";
		sendEmail(toEmail, subject, content);
	}

	// 이메일 전송 메소드
	private void sendEmail(String toEmail, String subject, String content) {
		MimeMessage mimeMessage = mailSender.createMimeMessage();
		MimeMessageHelper helper;
		try {
			helper = new MimeMessageHelper(mimeMessage, "utf-8");
			helper.setText(content, true); // true는 HTML 형식의 텍스트임을 나타냄
			helper.setTo(toEmail);
			helper.setSubject(subject);
			helper.setFrom("your-email@gmail.com");
			mailSender.send(mimeMessage);
		} catch (MessagingException e) {
			throw new RuntimeException("이메일 전송 중 오류가 발생했습니다.", e);
		}
	}
}