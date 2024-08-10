package com.sbs.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javamailSender;

    public void sendVerificationEmail(String toEmail, String verificationLink) {
        // 이메일 인증을 위한 메일 전송
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Please verify your email");
        message.setText("Click the link to verify your email: " + verificationLink);
        message.setFrom("your-email@gmail.com");

        javamailSender.send(message);
    }

    public void sendTemporaryPasswordEmail(String toEmail, String tempPassword) {
        // 임시 비밀번호 전송 메일
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("임시 비밀번호 안내");
        message.setText("임시 비밀번호는: " + tempPassword + " 입니다. 로그인 후 비밀번호를 변경해 주세요.");
        message.setFrom("your-email@gmail.com");

        javamailSender.send(message);
    }

    public void sendPasswordResetMail(String toEmail, String resetLink) {
        // 비밀번호 재설정 메일 전송
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("비밀번호 재설정 안내");
        message.setText("비밀번호를 재설정하려면 다음 링크를 클릭하세요: " + resetLink);
        message.setFrom("your-email@gmail.com");

        javamailSender.send(message);        
    }
}
