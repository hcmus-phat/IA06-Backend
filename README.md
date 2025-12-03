# IA6 Backend

Express + MongoDB API for user registration and login.

## Requirements
- Node.js 18+
- MongoDB Atlas connection string

## Environment variables
Create a `.env` in `backend/`:
```
MONGO_URI=your-mongodb-uri
CORS_WHITELIST=https://your-frontend-domain.com,http://localhost:5173
PORT=3500
NODE_ENV=production
```
Notes:
- Do not add a trailing slash at the end of domains in `CORS_WHITELIST`.
- If you use a local `.env`, ensure it is loaded by adding this at the top of `index.js`:
  ```
  import 'dotenv/config'
  ```

## Install
```
npm install
```

## Run (Windows PowerShell)
- Development (local):
```
$env:MONGO_URI="your-uri"
$env:CORS_WHITELIST="http://localhost:5173"
$env:PORT="3500"
npm start
```

- Test health:
```
Invoke-WebRequest http://localhost:3500/ping
```

## API
- GET `/ping` → `{ "message": "pong" }`
- POST `/user/register`
  - Body: `{ "email": string, "password": string }`
  - Validates email and password (min length 6, at least 1 number)
- POST `/user/login`
  - Body: `{ "email": string, "password": string }`

## CORS
Set `CORS_WHITELIST` to include your frontend domain (and `http://localhost:5173` for local dev). Example:
```
CORS_WHITELIST=https://your-frontend-domain.com,http://localhost:5173
```
If you see “No 'Access-Control-Allow-Origin' header”, check:
- The exact domain (no trailing `/`)
- The env vars are actually loaded by the server

## Deploy (Render)
1. Push to GitHub.
2. Create a new Web Service on Render and select the `backend` directory.
3. Set Environment:
   - `MONGO_URI`, `CORS_WHITELIST`, `NODE_ENV=production`
   - Render provides `PORT`.
4. Start command: `npm start`.
5. After deploy, verify `GET /ping`.

## Troubleshooting
- CORS preflight blocked: ensure `CORS_WHITELIST` includes the frontend domain without trailing `/`.
- Env vars not applied: load dotenv locally (`import 'dotenv/config'`) or set envs in the hosting dashboard.
- 500 errors: check Render logs.