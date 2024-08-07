package com.sbs.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

<<<<<<< HEAD

// 8/5 추가  Gmail SMTP를 사용하여 이메일 전송을 처리하는 서비스 클래스.
=======
// 8/5 추가: Gmail SMTP를 사용하여 이메일 전송을 처리하는 서비스 클래스.
>>>>>>> 39f029607ac6fbf2f2b70ef3312d7de8be263b46
@Service
public class EmailService {
	
	@Autowired
<<<<<<< HEAD
	private JavaMailSender javamailSender;
	
	public void sendVerificationEmail(String toEmail, String verificationLink) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(toEmail);
		message.setSubject("Please verify your email");
		message.setText("링크를 클릭하여 이메일을 확인하세요: \n" + verificationLink);
		message.setFrom("your-email@gmail.com");
		javamailSender.send(message);
		
=======
	private JavaMailSender javamailSender;  // JavaMailSender를 자동으로 주입받습니다.
	
	// 이메일 인증을 위한 메일을 전송하는 메서드
	public void sendVerificationEmail(String toEmail, String verificationLink) {
		SimpleMailMessage message = new SimpleMailMessage();  // 간단한 텍스트 이메일 메시지를 생성합니다.
		message.setTo(toEmail);  // 수신자 이메일 주소를 설정합니다.
		message.setSubject("Please verify your email");  // 이메일 제목을 설정합니다.
		message.setText("Click the link to verify your email: " + verificationLink);  // 이메일 본문에 인증 링크를 추가합니다.
		message.setFrom("your-email@gmail.com");  // 발신자 이메일 주소를 설정합니다.
		
		javamailSender.send(message);  // 이메일을 전송합니다.
>>>>>>> 39f029607ac6fbf2f2b70ef3312d7de8be263b46
	}
	
}
