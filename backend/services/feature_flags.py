import json
import os
from pathlib import Path


BAD_BEHAVIOR_FLAG = "bad_behavior_enabled"
SUPPORTED_FILE_FLAGS = {BAD_BEHAVIOR_FLAG}
DEFAULT_FEATURE_FLAGS_PATH = os.environ.get(
    "FEATURE_FLAGS_PATH",
    "/srv/chorequest/features.json",
)


def _as_feature_bool(value) -> str:
    if isinstance(value, bool):
        return "true" if value else "false"
    text = str(value).strip().lower()
    return "true" if text in {"1", "true", "yes", "on", "enabled"} else "false"


def read_file_feature_flags(source: str) -> dict[str, str]:
    source = source.strip()
    if not source:
        return {}

    try:
        parsed = json.loads(source)
    except json.JSONDecodeError:
        parsed = {}
        for line in source.splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            parsed[key.strip()] = value.strip()

    if not isinstance(parsed, dict):
        return {}

    return {
        key: _as_feature_bool(value)
        for key, value in parsed.items()
        if key in SUPPORTED_FILE_FLAGS
    }


def load_file_feature_flags(path: str | Path = DEFAULT_FEATURE_FLAGS_PATH) -> dict[str, str]:
    try:
        source = Path(path).read_text(encoding="utf-8")
    except OSError:
        return {}
    return read_file_feature_flags(source)


def is_bad_behavior_enabled(path: str | Path = DEFAULT_FEATURE_FLAGS_PATH) -> bool:
    return load_file_feature_flags(path).get(BAD_BEHAVIOR_FLAG) == "true"
