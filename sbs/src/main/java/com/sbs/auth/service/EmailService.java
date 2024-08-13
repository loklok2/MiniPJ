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
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Please verify your email");
        message.setText("Click the link to verify your email: " + verificationLink);
        message.setFrom("your-email@gmail.com");

        javamailSender.send(message);
    }

    public void sendPasswordResetMail(String toEmail, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("비밀번호 재설정 안내");
        message.setText("비밀번호를 재설정하려면 다음 링크를 클릭하세요: " + resetLink);
        message.setFrom("your-email@gmail.com");

        javamailSender.send(message);        
    }
}
