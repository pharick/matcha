package schemas

type FindTagData struct {
	Value string `json:"value" validate:"required"`
}

type TagsReturn struct {
	List []string `json:"list" validate:"required"`
}
