"""Race-safe persistence policy shared by avatar-writing endpoints."""

from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy import select, text

from backend.models import User
from backend.services.avatar_config import sanitize_avatar_config_for_save
from backend.services.avatar_entitlements import find_locked_avatar_items_for_save


LOCKED_AVATAR_ITEMS_ERROR_CODE = 'avatar_items_locked'


async def prepare_avatar_config_write(db, user: User, proposed_config: dict) -> User:
    """Acquire the database write guard and stage an authoritative avatar update.

    SQLite ignores ``SELECT FOR UPDATE``. Ending the request's stale read
    transaction and acquiring ``BEGIN IMMEDIATE`` before the authoritative read
    prevents another writer from committing between that read and the caller's
    commit. Other databases use a conventional row lock.
    """
    try:
        dialect_name = db.get_bind().dialect.name
    except AttributeError:
        # Lightweight policy unit tests use a session-shaped fake.
        dialect_name = None

    authoritative_user = user
    if dialect_name is not None:
        user_id = user.id
        await db.rollback()
        if dialect_name == 'sqlite':
            await db.execute(text('BEGIN IMMEDIATE'))
            query = select(User).where(User.id == user_id)
        else:
            query = select(User).where(User.id == user_id).with_for_update()
        authoritative_user = (await db.execute(
            query.execution_options(populate_existing=True)
        )).scalar_one()

    new_config = sanitize_avatar_config_for_save(
        proposed_config,
        authoritative_user.avatar_config,
    )
    blocked_items = await find_locked_avatar_items_for_save(
        db,
        authoritative_user,
        new_config,
    )
    if blocked_items:
        raise HTTPException(
            status_code=403,
            detail={'code': LOCKED_AVATAR_ITEMS_ERROR_CODE},
        )

    authoritative_user.avatar_config = new_config
    authoritative_user.updated_at = datetime.now(timezone.utc)
    return authoritative_user
