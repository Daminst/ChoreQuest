SPECIAL_THEME_KEY = "special_theme"
SPECIAL_THEMES = (
    "none", "easter", "christmas", "birthday", "halloween",
    "april_fools", "wet_monday", "summer_vacation",
)


def normalize_special_theme(value: str) -> str:
    normalized = str(value).strip().lower()
    if normalized not in SPECIAL_THEMES:
        raise ValueError(f"Unsupported special theme: {value}")
    return normalized
