import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import "./Login.css";

// 복사 아이콘 SVG 컴포넌트
const CopyIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

// 체크 아이콘 SVG 컴포넌트
const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const Login: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [copyStatus, setCopyStatus] = useState<{
    access: boolean;
    refresh: boolean;
  }>({ access: false, refresh: false });

  // 컴포넌트 마운트 시 로컬 스토리지에서 토큰 확인
  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setIsLoggedIn(true);
    }
  }, []);

  // 토큰 복사 핸들러
  const handleCopyToken = async (tokenType: "access" | "refresh") => {
    const token = tokenType === "access" ? accessToken : refreshToken;

    if (!token) return;

    try {
      await navigator.clipboard.writeText(token);

      // 복사 성공 상태 업데이트
      setCopyStatus((prev) => ({
        ...prev,
        [tokenType]: true,
      }));

      // 2초 후 복사 성공 상태 초기화
      setTimeout(() => {
        setCopyStatus((prev) => ({
          ...prev,
          [tokenType]: false,
        }));
      }, 2000);
    } catch (err) {
      console.error("클립보드 복사 실패:", err);
      alert("토큰 복사에 실패했습니다.");
    }
  };

  // 구글 로그인 성공 핸들러
  const handleGoogleSuccess = async (credentialResponse: any) => {
    const { credential } = credentialResponse;

    try {
      const apiResponse = await fetch("http://localhost:8080/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken: credential }),
      });

      const data = await apiResponse.json();
      console.log("data: ", data);
      if (apiResponse.ok) {
        // 토큰 저장 및 상태 업데이트
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setIsLoggedIn(true);

        // 리디렉션을 하는 대신 현재 페이지에 정보를 표시
        // window.location.href = "/dashboard";
      } else {
        alert("구글 로그인 실패: " + data.message);
      }
    } catch (error) {
      console.error("구글 로그인 에러:", error);

      // 백엔드 연결 실패 시 테스트를 위해 임시 토큰 생성
      const tempAccessToken = "temp_" + Math.random().toString(36).substring(2);
      const tempRefreshToken =
        "temp_" + Math.random().toString(36).substring(2);

      localStorage.setItem("accessToken", tempAccessToken);
      localStorage.setItem("refreshToken", tempRefreshToken);
      setAccessToken(tempAccessToken);
      setRefreshToken(tempRefreshToken);
      setIsLoggedIn(true);
    }
  };

  // 구글 로그인 실패 핸들러
  const handleGoogleError = () => {
    console.error("구글 로그인 실패");
    alert("구글 로그인에 실패했습니다.");
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAccessToken(null);
    setRefreshToken(null);
    setIsLoggedIn(false);
  };

  // 토큰 문자열 포맷팅 (보안을 위해 일부만 표시)
  const formatToken = (token: string | null) => {
    if (!token) return "없음";
    if (token.length <= 10) return token;
    return token.substring(0, 10) + "..." + token.substring(token.length - 5);
  };

  return (
    <div className="login-container">
      <h1>로그인</h1>

      {!isLoggedIn ? (
        // 로그인 전 화면
        <div className="google-login-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            text="signin_with"
            shape="rectangular"
            size="large"
            logo_alignment="center"
          />
        </div>
      ) : (
        // 로그인 후 화면
        <div className="token-info">
          <h2>로그인 완료!</h2>
          <div className="token-display">
            <div className="token-row">
              <span className="token-label">Access Token:</span>
              <div className="token-value-container">
                <span className="token-value">{formatToken(accessToken)}</span>
                <button
                  className="icon-button copy-button"
                  onClick={() => handleCopyToken("access")}
                  title="Access Token 복사"
                >
                  {copyStatus.access ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
            </div>
            <div className="token-row">
              <span className="token-label">Refresh Token:</span>
              <div className="token-value-container">
                <span className="token-value">{formatToken(refreshToken)}</span>
                <button
                  className="icon-button copy-button"
                  onClick={() => handleCopyToken("refresh")}
                  title="Refresh Token 복사"
                >
                  {copyStatus.refresh ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-button">
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
