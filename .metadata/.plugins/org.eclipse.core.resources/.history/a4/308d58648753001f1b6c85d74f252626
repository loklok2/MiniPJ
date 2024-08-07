package com.sbs.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


// 8/5 추가  Gmail SMTP를 사용하여 이메일 전송을 처리하는 서비스 클래스.
@Service
public class EmailService {
	
	@Autowired
	private JavaMailSender javamailSender;
	
	public void sendVerificationEmail(String toEmail, String verificationLink) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(toEmail);
		message.setSubject("Please verify your email");
		message.setText("Click the link to verify your email:" + verificationLink);
		message.setFrom("your-email@gmail.com");
		
		javamailSender.send(message);
	}
	
}
