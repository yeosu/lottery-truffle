import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

export const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const Header = styled.header`
  background-color: var(--color-background);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
`;

export const DesktopNavigation = styled.nav`
  display: none;
  
  @media (min-width: 768px) {
    display: flex;
    gap: 1.5rem;
    margin-left: 2rem;
  }
`;

export const NavLink = styled(Link)`
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  
  &:hover {
    color: var(--color-primary);
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--color-primary);
    transition: width 0.3s;
  }
  
  &:hover:after {
    width: 100%;
  }
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: var(--color-background-hover);
  }
`;

export const UserMenu = styled.div`
  position: relative;
  display: none;
  
  @media (min-width: 768px) {
    display: block;
  }
  
  &:hover > div {
    display: block;
  }
`;

export const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--color-background-hover);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text);
  
  &:hover {
    background-color: var(--color-primary-light);
    color: var(--color-primary);
  }
`;

export const UserDropdown = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.5rem;
  background-color: var(--color-background);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  min-width: 200px;
  display: none;
  z-index: 10;
  overflow: hidden;
`;

export const UserInfo = styled.div`
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
`;

export const UserName = styled.div`
  font-weight: 600;
  color: var(--color-text);
`;

export const UserEmail = styled.div`
  font-size: 0.8rem;
  color: var(--color-text-light);
  margin-top: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const DropdownLink = styled(Link)`
  display: block;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: var(--color-text);
  
  &:hover {
    background-color: var(--color-background-hover);
    color: var(--color-primary);
  }
`;

export const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  text-align: left;
  color: var(--color-danger);
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    background-color: var(--color-background-hover);
  }
`;

export const MobileMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

export const MobileMenu = styled.div`
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  background-color: var(--color-background);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  z-index: 99;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

export const MobileNavLink = styled(Link)`
  color: var(--color-text);
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  
  &:hover {
    background-color: var(--color-background-hover);
    color: var(--color-primary);
  }
`;

export const MobileLogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  text-align: left;
  color: var(--color-danger);
  cursor: pointer;
  font-size: 1rem;
  border-radius: var(--border-radius);
  
  &:hover {
    background-color: var(--color-background-hover);
  }
`;

export const Main = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

export const Footer = styled.footer`
  background-color: var(--color-background);
  border-top: 1px solid var(--color-border);
  padding: 2rem;
  margin-top: 2rem;
`;

export const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
`;

export const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const FooterTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
`;

export const FooterText = styled.p`
  color: var(--color-text-light);
  font-size: 0.875rem;
  margin: 0;
`;

export const FooterLink = styled(Link)`
  color: var(--color-text-light);
  text-decoration: none;
  font-size: 0.875rem;
  
  &:hover {
    color: var(--color-primary);
  }
`;
