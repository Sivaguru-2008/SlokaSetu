# SlokaSetu: REST API Documentation

Base URL: `http://localhost:5000/api`

## Public Endpoints

### 1. Occasion Endpoints
- `GET /api/occasions`
  - Query Parameters: `category`, `institution` (`amrita` | `general`), `year`, `region`, `search`
  - Response: Array of occasions with associated dates, categories, institutions, and sloka counts.
- `GET /api/occasions/:slugOrId`
  - Returns detailed occasion entity, parayanam slokas with relationship types, and linked PDF resources.
- `GET /api/occasions/:id/slokas`
  - Returns associated slokas ordered by liturgical `displayOrder`.
- `GET /api/occasions/:id/dates`
  - Returns all historical and future observance dates.

### 2. Sloka Knowledge Library Endpoints
- `GET /api/slokas`
  - Query Parameters: `page`, `limit`, `search`, `deity`, `category`, `language`, `script`, `occasion`, `hasPdf`, `sort`
  - Response: Paginated array of slokas with `pagination` metadata (`totalCount`, `totalPages`, `currentPage`).
- `GET /api/slokas/:slugOrId`
  - Returns canonical sloka details, background, significance, all published versions, and PDF resources.
- `GET /api/slokas/:id/versions`
  - Returns multilingual versions with language and script details and verse arrays.
- `GET /api/slokas/:id/related`
  - Returns related slokas and associated occasions.
- `GET /api/slokas/daily`
  - Returns daily featured sloka rotated deterministically by day-of-year.

### 3. Search & Discovery Endpoints
- `GET /api/search?q=...&type=all|sloka|occasion`
  - Full indexed search across canonical titles, aliases, background notes, and festival names.

### 4. Resource & Download Endpoints
- `GET /api/resources/:id/download`
  - Securely streams the requested PDF resource with headers:
    - `Content-Type: application/pdf`
    - `Content-Disposition: attachment; filename="..."`
  - Increments download counter.
  - Validates path to prevent directory traversal.

### 5. Metadata Endpoints
- `GET /api/metadata`
  - Returns categories, deities, languages, scripts, and institutions for frontend filters.
- `GET /api/stats`
  - Returns public platform statistics.

---

## Administrative Endpoints (Protected by JWT)

Headers: `Authorization: Bearer <jwt-token>`

- `POST /api/admin/login`: Authenticates administrator with email & password.
- `GET /api/admin/me`: Returns active session profile.
- `GET /api/admin/stats`: Returns database metrics (published slokas, drafts, pending reviews).
- `POST /api/admin/occasions`: Creates a new occasion.
- `PATCH /api/admin/occasions/:id`: Updates an occasion.
- `POST /api/admin/slokas`: Creates a new canonical sloka.
- `PATCH /api/admin/slokas/:id`: Updates sloka metadata.
- `POST /api/admin/occasions/:id/slokas`: Associates a sloka with an occasion (`relationshipType`, `displayOrder`).
- `DELETE /api/admin/occasions/:id/slokas/:slokaId`: Removes a sloka association.
- `GET /api/admin/reviews`: Returns moderation queue of content reviews.
- `POST /api/admin/reviews`: Submits a verification decision (`PUBLISHED`, `VERIFIED`, `REJECTED`).
- `POST /api/admin/resources`: Uploads a new permitted PDF resource (max 25MB).
