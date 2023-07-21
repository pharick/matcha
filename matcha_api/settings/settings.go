package settings

import (
	"github.com/go-playground/validator/v10"
	"github.com/knadh/koanf/parsers/dotenv"
	"github.com/knadh/koanf/providers/env"
	"github.com/knadh/koanf/providers/file"
	"github.com/knadh/koanf/v2"
)

type Settings struct {
	PostgresUser     string `koanf:"POSTGRES_USER" validate:"required"`
	PostgresPassword string `koanf:"POSTGRES_PASSWORD" validate:"required"`
	PostgresDb       string `koanf:"POSTGRES_DB" validate:"required"`
	JWTSecret        string `koanf:"JWT_SECRET" validate:"required"`
	SMTPHost         string `koanf:"SMTP_HOST" validate:"required"`
	SMTPPort         int    `koanf:"SMTP_PORT" validate:"required"`
	SMTPEmail        string `koanf:"SMTP_EMAIL" validate:"required"`
	SMTPPassword     string `koanf:"SMTP_PASSWORD" validate:"required"`
	FrontBaseUrl     string `koanf:"FRONT_BASE_URL" validate:"required"`
}

func LoadSettings() (settings Settings, err error) {
	k := koanf.New(".")

	k.Load(file.Provider("../.env"), dotenv.Parser())
	k.Load(env.Provider("", ".", nil), nil)
	err = k.Unmarshal("", &settings)
	if err != nil {
		return
	}

	validate := validator.New()
	err = validate.Struct(settings)
	return
}
