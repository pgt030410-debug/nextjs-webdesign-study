# B2B SaaS Backend Guidelines (FastAPI)

## 1. Architecture (Domain-Driven Design - DDD)
- [cite_start]**Domain-Based Organization**: All features must be organized by domain (e.g., `/campaigns`, `/users`) to ensure modularity. [cite: 102]
- [cite_start]**File Separation**: Inside each domain folder, separate code into `router.py` (routing), `service.py` (business logic), and `models.py` (data structures). [cite: 98, 112]
- [cite_start]**Terminology Alignment**: Maintain strict consistency between business terminology and code naming to prevent AI hallucinations. [cite: 102, 116]

## 2. Typing & Security
- [cite_start]**Strict Typing**: Use **Pydantic** models to strictly define all request and response types, providing a clear "manual" for the AI. [cite: 59, 61]
- [cite_start]**Authorization Logic**: Every data retrieval process must include an explicit check to verify if the user has permission to access that specific information. [cite: 5]
- [cite_start]**Secret Management**: Never hardcode sensitive information such as API keys or passwords; these must be kept out of the codebase. [cite: 4, 6]

## 3. Implementation Details
- [cite_start]**Asynchronous Operations**: Write all routers and database interactions using `async def` to maximize performance and handle concurrent requests efficiently. [cite: 56]
- [cite_start]**SQLModel Integration**: Utilize **SQLModel** for database interactions to ensure type safety by merging Pydantic models with SQLAlchemy. [cite: 60, 61]