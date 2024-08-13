package com.sbs.auth.service;

//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.stereotype.Service;
//
//@Service
//public class EmailService {
//
//    @Autowired
//    private JavaMailSender javamailSender;
//
//    public void sendVerificationEmail(String toEmail, String verificationLink) {
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(toEmail);
//        message.setSubject("Please verify your email");
//        message.setText("Click the link to verify your email: " + verificationLink);
//        message.setFrom("your-email@gmail.com");
//
//        javamailSender.send(message);
//    }
//
//    public void sendPasswordResetMail(String toEmail, String resetLink) {
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(toEmail);
//        message.setSubject("비밀번호 재설정 안내");
//        message.setText("비밀번호를 재설정하려면 다음 링크를 클릭하세요: " + resetLink);
//        message.setFrom("your-email@gmail.com");
//
//        javamailSender.send(message);        
//    }
//}

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

    public void sendVerificationEmail(String toEmail, String verificationLink) {
        String subject = "Please verify your email";
        String content = "<p>Click the link to verify your email:</p>"
                       + "<a href=\"" + verificationLink + "\">Verify</a>";
        sendEmail(toEmail, subject, content);
    }

    public void sendPasswordResetMail(String toEmail, String resetLink) {
        String subject = "비밀번호 재설정 안내";
        String content = "<p>비밀번호를 재설정하려면 다음 링크를 클릭하세요:</p>"
                       + "<a href=\"" + resetLink + "\">비밀번호 재설정</a>";
        sendEmail(toEmail, subject, content);
    }

    private void sendEmail(String toEmail, String subject, String content) {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper;
        try {
            helper = new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setText(content, true); // true indicates the text is HTML
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setFrom("your-email@gmail.com");
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("이메일 전송 중 오류가 발생했습니다.", e);
        }
    }
}

