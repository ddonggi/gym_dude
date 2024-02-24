package com.weight.gym_dude.util;

import com.weight.gym_dude.util.BusinessLogicException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * PackageName : com.weight.gym_dude.user
 * FileName : MailService
 * Author : dglee
 * Create : 2/24/24 4:54 PM
 * Description :
 **/

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender emailSender;

    /*sendEmail( ): 이메일을 발송하는 메서드 파라미터로 이메일 주소, 이메일 제목, 이메일 내용을 입력 받아 creataEmailForm() 메서드로 넘겨준다.
    * createForm() 메서드가 SimpleMailMessage 객체를 생성하여 반환하면 주입 받은 emailSender.send() 메서드에 담아 메일을 발송한다.
    */
    public void sendEmail(String toEmail,
                          String title,
                          String text) {
        SimpleMailMessage emailForm = createEmailForm(toEmail, title, text);
        try {
            emailSender.send(emailForm);
        } catch (RuntimeException e) {
            log.debug("MailService.sendEmail exception occur toEmail: {}, " +
                    "title: {}, text: {}", toEmail, title, text);
            throw new BusinessLogicException("UNABLE_TO_SEND_EMAIL");
        }
    }

    // 발신할 이메일 데이터 세팅
    /*createEmailForm(): 발송할 이메일 데이터를 설정하는 메서드이다. 수신자 이메일 주소, 이메일 제목, 이메일 내용을 입력 받아 SimpleMailMessage 객체를 생성하여 반환한다.*/
    private SimpleMailMessage createEmailForm(String toEmail,
                                              String title,
                                              String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(title);
        message.setText(text);

        return message;
    }
}
