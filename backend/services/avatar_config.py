"""Server-side normalization for avatar configuration writes."""

from collections.abc import Mapping


_MISSING = object()


def sanitize_avatar_config_for_save(
    proposed_config: Mapping | None,
    existing_config: Mapping | None,
) -> dict:
    """Ignore client-owned pet XP fields and restore authoritative server data.

    Legacy single-pet XP is migrated to the pet that was equipped before the
    edit, so changing pets cannot discard that progress. ``pet_xp`` remains a
    derived compatibility alias for the newly equipped pet.
    """
    sanitized = dict(proposed_config or {})
    sanitized.pop("pet_xp_map", None)
    sanitized.pop("pet_xp", None)

    existing = existing_config or {}
    existing_map = existing.get("pet_xp_map", _MISSING)
    legacy_xp = existing.get("pet_xp", _MISSING)

    if existing_map is _MISSING and legacy_xp is _MISSING:
        return sanitized

    if existing_map is _MISSING:
        authoritative_map = {}
        existing_pet = existing.get("pet")
        if isinstance(existing_pet, str) and existing_pet and existing_pet != "none":
            authoritative_map[existing_pet] = legacy_xp
    elif isinstance(existing_map, Mapping):
        authoritative_map = dict(existing_map)
    else:
        authoritative_map = {}

    sanitized["pet_xp_map"] = authoritative_map
    selected_pet = sanitized.get("pet")
    if isinstance(selected_pet, str) and selected_pet and selected_pet != "none":
        sanitized["pet_xp"] = authoritative_map.get(selected_pet, 0)
    elif legacy_xp is not _MISSING and not authoritative_map:
        sanitized["pet_xp"] = legacy_xp

    return sanitized
