package lib

import (
	"fmt"
	"net/smtp"
)

func SendEmail(
	smtpHost string,
	smtpPort int,
	emailFrom string,
	password string,
	emailTo string,
	subject string,
	body string,
) error {
	auth := smtp.PlainAuth("", emailFrom, password, smtpHost)
	msg := fmt.Sprintf("Subject: %s\n\n%s", subject, body)
	err := smtp.SendMail(
		fmt.Sprintf("%s:%d", smtpHost, smtpPort),
		auth,
		emailFrom,
		[]string{emailTo},
		[]byte(msg),
	)
	return err
}
