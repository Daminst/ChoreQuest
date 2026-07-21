import tempfile
import unittest
from pathlib import Path
from unittest.mock import AsyncMock, patch

from sqlalchemy import select
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from backend.models import User, UserRole
from backend.routers.avatar import AvatarConfig, save_avatar
from backend.services.pet_leveling import award_pet_xp_db


class AvatarConfigConcurrencyTests(unittest.IsolatedAsyncioTestCase):
    async def test_stale_avatar_save_preserves_pet_xp_committed_by_another_session(self):
        with tempfile.TemporaryDirectory() as directory:
            database_path = Path(directory, 'avatar-race.db')
            database_url = database_path.as_uri().replace('file:', 'sqlite+aiosqlite:')
            engine = create_async_engine(database_url)
            sessions = async_sessionmaker(engine, expire_on_commit=False)
            try:
                async with engine.begin() as connection:
                    await connection.run_sync(User.__table__.create)

                async with sessions() as setup_session:
                    setup_session.add(User(
                        username='race-user',
                        display_name='Race',
                        password_hash='not-used',
                        role=UserRole.parent,
                        avatar_config={
                            'hair': 'short',
                            'pet': 'cat',
                            'pet_xp': 0,
                            'pet_xp_map': {'cat': 0},
                        },
                    ))
                    await setup_session.commit()

                async with sessions() as stale_session, sessions() as xp_session:
                    stale_user = (await stale_session.execute(
                        select(User).where(User.username == 'race-user')
                    )).scalar_one()
                    xp_user = (await xp_session.execute(
                        select(User).where(User.id == stale_user.id)
                    )).scalar_one()

                    await award_pet_xp_db(xp_session, xp_user, 50)
                    await xp_session.commit()

                    with patch(
                        'backend.routers.avatar.ws_manager.broadcast',
                        new_callable=AsyncMock,
                    ):
                        await save_avatar(
                            AvatarConfig(config={'hair': 'long', 'pet': 'cat'}),
                            db=stale_session,
                            user=stale_user,
                        )

                async with sessions() as verification_session:
                    persisted = (await verification_session.execute(
                        select(User).where(User.username == 'race-user')
                    )).scalar_one()
                    self.assertEqual(persisted.avatar_config['hair'], 'long')
                    self.assertEqual(persisted.avatar_config['pet_xp_map'], {'cat': 50})
                    self.assertEqual(persisted.avatar_config['pet_xp'], 50)
            finally:
                await engine.dispose()


if __name__ == '__main__':
    unittest.main()
