import os
from sqlalchemy import create_engine, text
from sqlmodel import SQLModel
# Import all models so they are registered
from src.domains.auth.models import *
from src.domains.campaigns.models import *
from src.domains.audit.models import *
from src.domains.settings.models import *

from src.database import engine

def apply_migrations():
    with engine.connect().execution_options(isolation_level="AUTOCOMMIT") as conn:
        print("Checking tables and altering if necessary...")
        # Add role and subscription_tier to user table if they don't exist
        try:
            conn.execute(text('ALTER TABLE "user" ADD COLUMN role VARCHAR DEFAULT \'viewer\';'))
            print("Added 'role' column to 'user'.")
        except Exception as e:
            print("Skipped 'role' column (might exist):", str(e))
            
        try:
            conn.execute(text('ALTER TABLE "user" ADD COLUMN subscription_tier VARCHAR DEFAULT \'starter\';'))
            print("Added 'subscription_tier' column to 'user'.")
        except Exception as e:
            print("Skipped 'subscription_tier' column (might exist):", str(e))
            
        print("Checking Enum types...")
        # Add new Enum values for campaignstatus
        enum_values = ['draft', 'pending_approval', 'rejected', 'DRAFT', 'PENDING_APPROVAL', 'REJECTED']
        for val in enum_values:
            try:
                # PostgreSQL 12+ supports IF NOT EXISTS for ADD VALUE
                conn.execute(text(f"ALTER TYPE campaignstatus ADD VALUE IF NOT EXISTS '{val}';"))
                print(f"Added '{val}' to campaignstatus enum.")
            except Exception as e:
                print(f"Skipped adding '{val}' to enum:", str(e))

        print("Creating all tables (does nothing for existing)...")
        SQLModel.metadata.create_all(engine)
        print("Done.")

if __name__ == "__main__":
    apply_migrations()
