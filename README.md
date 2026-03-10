# Sambung Kata Helper

A web-based helper tool for playing Indonesian word-chain games ("sambung kata").

## Features

- Search words by prefix (starts with)
- Search words by suffix (ends with)
- Combine prefix and suffix for precise searches
- Returns up to 50 random matching words
- Server-side rendering for fast performance

## Tech Stack

- **Frontend + SSR:** Next.js 14 (App Router)
- **Database:** PostgreSQL 16 (external, via proxy-network)
- **Reverse Proxy:** Nginx Proxy Manager (external/VPS)
- **Containerization:** Docker + Docker Compose

## Prerequisites

- Docker and Docker Compose installed on VPS
- Existing PostgreSQL database accessible via `proxy-network`
- Nginx Proxy Manager running on your VPS

## Setup

### 1. Create Docker Network (if not exists)

```bash
docker network create proxy-network
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update database URL:

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgres://postgres:your_password@your_db_container:5432/dictionary
NODE_ENV=production
```

**Note:** Pastikan `your_db_container` adalah nama container/service PostgreSQL yang sudah terhubung ke `proxy-network`.

### 3. Build and Run

```bash
docker-compose up -d --build
```

Aplikasi akan berjalan di port 3000.

### 4. Configure Nginx Proxy Manager

1. Buka dashboard Nginx Proxy Manager
2. Add **Proxy Host** baru:
   - **Domain Names:** `sambungkata.yourdomain.com`
   - **Forward Hostname/IP:** `sambung-kata-helper-app-1` (nama container) atau `localhost`
   - **Forward Port:** `3000`
3. Enable SSL jika diperlukan

### 5. Rate Limiting (Optional)

Di tab **Advanced** NPM, tambahkan:

```nginx
limit_req_zone $binary_remote_addr zone=sambungkata:10m rate=5r/s;
limit_req zone=sambungkata burst=10 nodelay;
```

## Database Setup

Jika database kamu belum punya tabel dictionary:

```sql
-- Create table
CREATE TABLE IF NOT EXISTS public.dictionary (
    id bigserial NOT NULL,
    word varchar NULL,
    CONSTRAINT dictionary_pk PRIMARY KEY (id)
);

-- Create index
CREATE INDEX IF NOT EXISTS dictionary_word_idx ON dictionary (word);

-- Data cleaning
UPDATE dictionary SET word = trim(word);
DELETE FROM dictionary WHERE word = '';
DELETE FROM dictionary a USING dictionary b WHERE a.ctid < b.ctid AND a.word = b.word;

-- Load data (example)
INSERT INTO dictionary (word) VALUES ('pisang'), ('paku'), ('pagi'), ('payung');
```

### Load Data dari File

```bash
# Copy file ke container DB
docker cp your_wordlist.txt your_db_container:/tmp/

# Load data
docker exec -i your_db_container psql -U postgres -d dictionary -c "\copy dictionary(word) FROM '/tmp/your_wordlist.txt'"
```

## Search Examples

| Start With | End With | Example Results |
|------------|----------|-----------------|
| p | (empty) | pisang, paku, pagi |
| (empty) | ng | pisang, payung, undangan |
| p | ng | pisang, payung, pajang |

## Project Structure

```
.
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main search page (SSR)
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── SearchForm.tsx     # Search form component
│   └── ResultsList.tsx    # Results display component
├── lib/                   # Utilities
│   └── db.ts              # Database connection & queries
├── Dockerfile             # Next.js app container
├── docker-compose.yml     # App service only
├── .env                   # Environment variables (not committed)
├── .env.example           # Environment template
└── package.json           # Node.js dependencies
```

## Commands

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Rebuild
docker-compose up -d --build

# View logs
docker-compose logs -f app

# Update/restart
docker-compose pull && docker-compose up -d --build
```

## Troubleshooting

### App tidak bisa konek ke DB

1. Pastikan DB container di `proxy-network`:
   ```bash
   docker network inspect proxy-network
   ```

2. Cek apakah nama host di `DATABASE_URL` benar (gunakan nama container)

3. Test koneksi dari app container:
   ```bash
   docker exec -it sambung-kata-helper-app-1 sh
   # Install psql: apk add postgresql-client
   psql $DATABASE_URL -c "SELECT COUNT(*) FROM dictionary;"
   ```

## Performance

Expected query times dengan ~72k rows:
- Prefix search: < 5ms
- Suffix search: < 20ms
- Prefix + Suffix: < 30ms

## Security

- Parameterized SQL queries
- Database credentials di .env file
- External DB di private Docker network
- Rate limiting via NPM

## License

Private - Personal utility tool
