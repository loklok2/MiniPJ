package com.sbs.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

// 8/5 추가: Gmail SMTP를 사용하여 이메일 전송을 처리하는 서비스 클래스.
@Service
public class EmailService {

	@Autowired
	private JavaMailSender javamailSender;  // JavaMailSender를 자동으로 주입받습니다.

	// 이메일 인증을 위한 메일을 전송하는 메서드
	public void sendVerificationEmail(String toEmail, String verificationLink) {
		SimpleMailMessage message = new SimpleMailMessage();  // 간단한 텍스트 이메일 메시지를 생성합니다.
		message.setTo(toEmail);  // 수신자 이메일 주소를 설정합니다.
		message.setSubject("Please verify your email");  // 이메일 제목을 설정합니다.
		message.setText("Click the link to verify your email: " + verificationLink);  // 이메일 본문에 인증 링크를 추가합니다.
		message.setFrom("your-email@gmail.com");  // 발신자 이메일 주소를 설정합니다.

		javamailSender.send(message);  // 이메일을 전송합니다.
	}
	// 임시 비밀번호를 포함한 이메일을 전송하는 메서드, @param toEmail 수신자 이메일 주소, @param tempPassword 임시 비밀번호
	public void sendTemporaryPasswordEmail(String toEmail, String tempPassword) {
		SimpleMailMessage message = new SimpleMailMessage();	// 간단한 텍스트 이메일 메시지를 생성합니다.
		message.setTo(toEmail);	// 수신자 이메일 주소를 설정합니다.
		message.setSubject("임시 비밀번호 안내");		// 이메일 제목을 설정합니다.
		message.setText("임시 비밀번호는: " + tempPassword + " 입니다. 로그인 후 비밀번호를 변경해 주세요.");	// 이메일 본문에 임시 비밀번호를 추가합니다.
		message.setFrom("your-email@gmail.com");	// 발신자 이메일 주소를 설정합니다.

		javamailSender.send(message);	// 이메일을 전송합니다.
	}

	// 비밀번호 재설정 링크를 포함한 이메일을 전송하는 메서드, @param toEmail 수신자 이메일 주소, @param resetLink 비밀번호 재설정 링크
	public void sendPasswordResetMail(String toEmail, String resetLink) {
		SimpleMailMessage message = new SimpleMailMessage();  // 간단한 텍스트 이메일 메시지를 생성합니다.
		message.setTo(toEmail);  // 수신자 이메일 주소를 설정합니다.
		message.setSubject("비밀번호 재설정 안내");  // 이메일 제목을 설정합니다.
		message.setText("비밀번호를 재설정하려면 다음 링크를 클릭하세요: " + resetLink);  // 이메일 본문에 비밀번호 재설정 링크를 추가합니다.
		message.setFrom("your-email@gmail.com");  // 발신자 이메일 주소를 설정합니다.

		javamailSender.send(message);  // 이메일을 전송합니다.		
	}

}
