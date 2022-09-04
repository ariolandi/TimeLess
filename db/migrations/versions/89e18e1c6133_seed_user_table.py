"""Seed user table

Revision ID: 89e18e1c6133
Revises: 5f32da55569b
Create Date: 2022-09-04 12:02:43.155299

"""
from alembic import op
import sqlalchemy as sa
import json

# revision identifiers, used by Alembic.
revision = '89e18e1c6133'
down_revision = '5f32da55569b'
branch_labels = None
depends_on = None


def upgrade():
    seed = open('db/seeds/users.json')
    data = json.load(seed)

    users_table = sa.table('users',
                           sa.Column('id', sa.Integer(), autoincrement=True,
                                     nullable=False),
                           sa.Column('username', sa.String(), nullable=False),
                           sa.Column('password', sa.String(), nullable=False)
                           )

    op.bulk_insert(users_table, data)


def downgrade():
    pass
