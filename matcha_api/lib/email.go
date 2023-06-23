package lib

import (
	"fmt"
	"net/smtp"
)

func SendActivationEmail(
	smtpHost string,
	smtpPort int,
	emailFrom string,
	password string,
	emailTo string,
	token string,
) error {
	auth := smtp.PlainAuth("", emailFrom, password, smtpHost)
	text := fmt.Sprintf("Please, use this token to verify your email: %s", token)
	msg := fmt.Sprintf("Subject: Matcha email verification\n\n%s", text)
	err := smtp.SendMail(
		fmt.Sprintf("%s:%d", smtpHost, smtpPort),
		auth,
		emailFrom,
		[]string{emailTo},
		[]byte(msg),
	)
	return err
}
