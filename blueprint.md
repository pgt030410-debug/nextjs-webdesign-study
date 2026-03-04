# Project Blueprint: AI Marketing Performance Platform

## Overview
This is a B2B SaaS dashboard designed for AI Marketing Performance management. It integrates a Next.js frontend with a FastAPI backend to manage and visualize marketing campaigns.

## Key Features
- **Real-time Dashboard:** Displays key marketing metrics (Spend, CTR, Conversions) and performance trends.
- **Campaign Management:**
    - List all active campaigns for a specific organization.
    - **Add Campaign (New):** Create new campaigns with details like name, advertiser, budget, and target ROAS.
    - **Delete Campaign (New):** Remove existing campaigns with a single click and confirmation.
- **Visual Analytics:** Interactive charts showing performance trends over time.
- **AI Insights:** Automated performance analysis and recommendations.

## Implemented Design & Styles
- **Minimalist UI:** Clean spacing, modern typography (bold headlines), and subtle shadows.
- **Color Palette:** Professional blue and gray tones.
- **Responsive Components:** Cards, tables, and modals that adapt to different screen sizes.
- **Interactive Feedback:** Hover effects, loading spinners, and instant data refresh after mutations.

## Current Progress: Campaign CRUD Completion
### Step 1: Backend API (FastAPI)
- Added `GET /campaigns/`, `POST /campaigns/`, and `DELETE /campaigns/{id}` endpoints.
- Implemented asynchronous database operations using SQLAlchemy and SQLite.
- Strict Pydantic models for data validation.

### Step 2: Next.js API Routes (Proxy)
- `src/app/api/campaigns/route.ts`: Handles `GET` (fetch list) and `POST` (create).
- `src/app/api/campaigns/[id]/route.ts`: Handles `DELETE` (remove).
- Centralized `BACKEND_URL` for easy configuration.

### Step 3: Frontend UI Components
- **CampaignModal:** Modern, accessible dialog for campaign creation.
- **CampaignTable Updates:** Added action column with a delete icon.
- **Dashboard Integration:** Centralized data fetching and state management for seamless user experience.

### Step 4: Database Migration & Stability (Supabase)
- **Database Connection Fix (Latest):** Resolved the `unexpected keyword argument 'sslmode'` error by:
    - Structurally stripping all query parameters (like `?sslmode=require`) from the `DATABASE_URL` string using string splitting.
    - Removing `connect_args` from the `create_async_engine` call to prevent driver-level parameter conflicts.
    - Standardizing the URL prefix to `postgresql+asyncpg://` for consistent asynchronous communication.
- **Strict Type Hinting (SDD/DDD):**
    - Applied `AsyncGenerator[AsyncSession, None]` to database session factories to enhance code reliability and AI analysis accuracy.
- **Automated Schema Synchronization:** Verified that `SQLModel.metadata.create_all` correctly initializes tables upon backend startup.
- Provided `.env.example` and updated `.gitignore` to securely track configuration templates while protecting secrets.

### Step 5: Animations & Micro-Interactions (Framer Motion)
- **Page Transitions:** Adopted a premium, Apple-like `scale: 0.98 -> 1` and opacity fade across the `template.tsx` wrapper for all sub-routes.
- **Performance Optimizations:** 
    - Eliminated layout thrashing and "Flash of Unstyled Content" (FOUC) during SSR hydration by forcing an `opacity-0` to `opacity-100` delay transition mechanism based on a strict `isMounted` state.
    - Mitigated massive Main Thread JS blocking (stutter) by replacing heavy `<motion.div staggerChildren>` structures with flat Tween-based animations.
    - Enforced CSS GPU acceleration using `will-change: transform, opacity`.
- **Recharts Thread Relief:** Safely insulated the heavy initial SVG resize & calculations of the `ResponsiveContainer` by delaying the chart mount by `900ms` (post-transition).
- **Interactive States:** Handled hover/tap feedback efficiently on data table rows and actionable buttons without physics-engine overhead.

### Step 6: Workflow Automation (Phase 14) [LATEST]
- **Approval Logic:** Implemented `status` field expansion in `Campaign` model and RBAC-protected endpoints for approval/rejection.
- **Comments Subsystem:** Added `CampaignComment` model and CRUD API for internal team discussions.
- **Kanban Board:** Developed a highly interactive board view using `@dnd-kit/core` and `@dnd-kit/sortable`.
- **UI View Toggle:** Integrated a view-switching mechanism (Table vs Board) in the main campaign list.

## Technical Stack
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Lucide Icons, `@dnd-kit`.
- **Backend:** FastAPI, Python, SQLAlchemy, SQLModel, PostgreSQL (Supabase).
- **Database Driver:** `asyncpg` for asynchronous PostgreSQL communication.
- **Communication:** Proxy pattern and Server Actions for unified API access.

## MCP Optimizations (Model Context Protocol)
- **Database Access:** SQLite/PostgreSQL servers integrated via Antigravity config for direct DB queries and schema validation without going through the backend.
- **AI Agent Tooling:** Leverages native agentic capabilities for terminal execution, precise code editing, and full-browser test automation (E2E).
