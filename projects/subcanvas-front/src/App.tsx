import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'

// 레이아웃
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import ProfileLayout from './layouts/ProfileLayout'

// 페이지
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProfileEditor from './pages/ProfileEditor'
import ProfileView from './pages/ProfileView'
import NotFound from './pages/NotFound'

// 컨텍스트
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 초기 로딩 시 필요한 데이터나 인증 상태 확인
    const initializeApp = async () => {
      try {
        // 필요한 초기화 작업 수행
        // 예: 토큰 유효성 검사, 테마 설정 로드 등
        
        // 테스트를 위해 잠시 딜레이 추가
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        console.error('앱 초기화 중 오류 발생:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [])

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>SubCanvas 로딩 중...</p>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* 메인 레이아웃 라우트 */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="explore" element={<div>탐색 페이지 (개발 예정)</div>} />
            </Route>

            {/* 인증 레이아웃 라우트 */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<div>비밀번호 찾기 (개발 예정)</div>} />
              <Route path="*" element={<Navigate to="/auth/login" replace />} />
            </Route>

            {/* 대시보드 라우트 (인증 필요) */}
            <Route path="/dashboard" element={<MainLayout requireAuth={true} />}>
              <Route index element={<Dashboard />} />
              <Route path="profile/edit/:profileId" element={<ProfileEditor />} />
              <Route path="profile/new" element={<ProfileEditor isNew={true} />} />
              <Route path="settings" element={<div>설정 페이지 (개발 예정)</div>} />
            </Route>

            {/* 프로필 뷰 라우트 */}
            <Route path="/p/:pagePath" element={<ProfileLayout />}>
              <Route index element={<ProfileView />} />
            </Route>

            {/* 404 페이지 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
