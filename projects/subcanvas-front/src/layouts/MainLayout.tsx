import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FiMenu, FiX, FiSun, FiMoon, FiUser, FiLogOut } from 'react-icons/fi';
import {
  LayoutContainer,
  Header,
  HeaderContent,
  LogoContainer,
  Logo,
  DesktopNavigation,
  NavLink,
  RightSection,
  ThemeToggle,
  UserMenu,
  UserAvatar,
  UserDropdown,
  UserInfo,
  UserName,
  UserEmail,
  DropdownLink,
  LogoutButton,
  MobileMenuButton,
  MobileMenu,
  MobileNavLink,
  MobileLogoutButton,
  Main,
  Footer,
  FooterContent,
  FooterSection,
  FooterTitle,
  FooterText,
  FooterLink
} from './MainLayout.styles';

interface MainLayoutProps {
  requireAuth?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ requireAuth = false }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { currentTheme, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  // 인증이 필요한 페이지인데 로그인되지 않은 경우 로그인 페이지로 리다이렉트
  React.useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      navigate('/auth/login', { replace: true });
    }
  }, [requireAuth, isAuthenticated, navigate]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <LayoutContainer>
      <Header>
        <HeaderContent>
          <LogoContainer>
            <Link to="/">
              <Logo>SubCanvas</Logo>
            </Link>
          </LogoContainer>

          <DesktopNavigation>
            <NavLink to="/">홈</NavLink>
            <NavLink to="/explore">탐색</NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard">대시보드</NavLink>
                <NavLink to="/dashboard/profile/new">프로필 만들기</NavLink>
              </>
            ) : (
              <NavLink to="/auth/login">로그인</NavLink>
            )}
          </DesktopNavigation>

          <RightSection>
            <ThemeToggle onClick={toggleDarkMode}>
              {currentTheme.isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
            </ThemeToggle>

            {isAuthenticated && (
              <UserMenu>
                <UserAvatar>
                  <FiUser size={20} />
                </UserAvatar>
                <UserDropdown>
                  <UserInfo>
                    <UserName>{user?.nickname}</UserName>
                    <UserEmail>{user?.email}</UserEmail>
                  </UserInfo>
                  <DropdownLink to="/dashboard">대시보드</DropdownLink>
                  <DropdownLink to="/dashboard/settings">설정</DropdownLink>
                  <LogoutButton onClick={logout}>
                    <FiLogOut size={16} /> 로그아웃
                  </LogoutButton>
                </UserDropdown>
              </UserMenu>
            )}

            <MobileMenuButton onClick={toggleMenu}>
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </MobileMenuButton>
          </RightSection>
        </HeaderContent>
      </Header>

      {isMenuOpen && (
        <MobileMenu>
          <MobileNavLink to="/" onClick={toggleMenu}>홈</MobileNavLink>
          <MobileNavLink to="/explore" onClick={toggleMenu}>탐색</MobileNavLink>
          
          {isAuthenticated ? (
            <>
              <MobileNavLink to="/dashboard" onClick={toggleMenu}>대시보드</MobileNavLink>
              <MobileNavLink to="/dashboard/profile/new" onClick={toggleMenu}>프로필 만들기</MobileNavLink>
              <MobileNavLink to="/dashboard/settings" onClick={toggleMenu}>설정</MobileNavLink>
              <MobileLogoutButton onClick={() => { logout(); toggleMenu(); }}>
                <FiLogOut size={16} /> 로그아웃
              </MobileLogoutButton>
            </>
          ) : (
            <>
              <MobileNavLink to="/auth/login" onClick={toggleMenu}>로그인</MobileNavLink>
              <MobileNavLink to="/auth/register" onClick={toggleMenu}>회원가입</MobileNavLink>
            </>
          )}
        </MobileMenu>
      )}

      <Main>
        <Outlet />
      </Main>

      <Footer>
        <FooterContent>
          <FooterSection>
            <FooterTitle>SubCanvas</FooterTitle>
            <FooterText>나만의 프로필 페이지를 만들고 공유하세요.</FooterText>
          </FooterSection>
          
          <FooterSection>
            <FooterLink to="/about">소개</FooterLink>
            <FooterLink to="/privacy">개인정보 처리방침</FooterLink>
            <FooterLink to="/terms">이용약관</FooterLink>
            <FooterLink to="/contact">문의하기</FooterLink>
          </FooterSection>
          
          <FooterSection>
            <FooterText>&copy; {new Date().getFullYear()} SubCanvas. All rights reserved.</FooterText>
          </FooterSection>
        </FooterContent>
      </Footer>
    </LayoutContainer>
  );
};

export default MainLayout;
