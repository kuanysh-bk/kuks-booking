import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./LoginPage.css";

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isSuperuser = localStorage.getItem('isSuperuser');
    if (token) {
      navigate(isSuperuser === 'true' ? '/admin/super/dashboard' : '/admin/dashboard');
    }
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError(t("login.error_fill_fields", "Введите email и пароль"));
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("https://booking-backend-tjmn.onrender.com/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.status === 401) {
        setError(t("login.invalid", "Неверный email или пароль"));
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("isSuperuser", data.is_superuser);
      navigate(data.is_superuser ? "/admin/super/dashboard" : "/admin/dashboard");
    } catch (err) {
      setError(t("login.error_network", "Ошибка сети"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">{t("login.title", "Авторизация")}</h2>
        {error && <div className="login-error">{error}</div>}
        <input
          type="text"
          placeholder={t("login.email", "Email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder={t("login.password", "Пароль")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button
          className={`login-button ${isLoading ? "loading" : ""}`}
          onClick={handleLogin}
          disabled={isLoading}
        >
          <span className="login-button-content">
            {isLoading && <span className="spinner" />}
            {isLoading ? t("login.loading", "Вход...") : t("login.submit", "Войти")}
          </span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;