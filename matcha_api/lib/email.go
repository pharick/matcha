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
) error {
	fmt.Println(smtpHost, smtpPort)
	auth := smtp.PlainAuth("", emailFrom, password, smtpHost)
	err := smtp.SendMail(
		fmt.Sprintf("%s:%d", smtpHost, smtpPort),
		auth,
		emailFrom,
		[]string{emailTo},
		[]byte("Test email"),
	)
	return err
}
