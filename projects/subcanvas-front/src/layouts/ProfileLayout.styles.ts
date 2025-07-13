import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background);
`;

export const ProfileHeader = styled.header`
  background-color: var(--color-background);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
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

export const LogoLink = styled(Link)`
  text-decoration: none;
`;

export const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
`;

export const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
`;

export const ShareButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  span {
    display: none;
    
    @media (min-width: 768px) {
      display: inline;
    }
  }
`;

export const ShareOptions = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: var(--color-background);
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  z-index: 20;
  overflow: hidden;
`;

export const ShareOption = styled.button`
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

export const ShareOptionLink = styled.a`
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

export const HomeLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text);
  text-decoration: none;
  font-size: 1rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  span {
    display: none;
    
    @media (min-width: 768px) {
      display: inline;
    }
  }
`;

export const ProfileContent = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

export const ProfileFooter = styled.footer`
  background-color: var(--color-background);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
`;

export const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
`;

export const FooterText = styled.p`
  margin: 0;
  color: var(--color-text);
  font-size: 0.875rem;
`;

export const FooterLink = styled(Link)`
  color: var(--color-primary);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: var(--color-text);
`;

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--color-primary);
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  text-align: center;
`;

export const ErrorIcon = styled.div`
  color: var(--color-error);
  margin-bottom: 1rem;
`;

export const ErrorTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0;
  color: var(--color-text);
`;

export const ErrorMessage = styled.p`
  margin: 0 0 2rem;
  color: var(--color-text);
  max-width: 400px;
`;

export const HomeButton = styled(Link)`
  display: inline-block;
  background-color: var(--color-primary);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--color-secondary);
  }
`;
