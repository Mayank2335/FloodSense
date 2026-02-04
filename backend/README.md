# FloodSense Backend

This is the backend for the FloodSense application, built with Node.js, Express, and TypeScript.

## Deployment Instructions

### Option 1: Render (Recommended)
1.  Connect your GitHub repository to Render.
2.  Create a new **Web Service**.
3.  Settings:
    *   **Root Directory**: `backend`
    *   **Build Command**: `npm install && npm run build`
    *   **Start Command**: `npm start`
4.  **Environment Variables**:
    *   `MONGO_URI`: Your MongoDB connection string.
    *   `JWT_SECRET`: A secret string for authentication.
    *   `PORT`: `5000` (Optional, Render sets a port automatically, usually 10000).

### Option 2: Railway
1.  Connect your GitHub repository.
2.  Set the **Root Directory** to `backend`.
3.  Add the required Environment Variables (`MONGO_URI`, `JWT_SECRET`).
4.  Railway automatically detects `npm run build` and `npm start`.

### Environment Variables
Ensure the following variables are set in your deployment platform:
- `MONGO_URI`: `mongodb+srv://...`
- `JWT_SECRET`: `...`
