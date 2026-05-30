
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function autoLogin() {
  if (!localStorage.getItem('accessToken')) {
    try {
      // Attempt to register a default test user (silently catch if they already exist)
      await fetch(`${BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '테스트',
          nickname: '테스트',
          email: 'test@shannonmanifold.io',
          password: 'password123'
        })
      }).catch(() => {});

      // Login to get a valid signed JWT from the backend
      const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@shannonmanifold.io',
          password: 'password123'
        })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
      }
    } catch (e) {
      console.error("Auto login error during startup:", e);
    }
  }
}

autoLogin().finally(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
  