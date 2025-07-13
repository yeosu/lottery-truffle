import styled from '@emotion/styled';
import { motion } from 'framer-motion';

export const Container = styled.div`
  min-height: 100vh;
  background-color: var(--color-background);
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const BackButton = styled.button`
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text);
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

export const LogoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: var(--color-primary);
  color: white;
  
  @media (min-width: 768px) {
    padding: 4rem;
  }
`;

export const Logo = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 1rem;
  text-align: center;
`;

export const Tagline = styled.p`
  font-size: 1.25rem;
  margin: 0;
  text-align: center;
  max-width: 400px;
`;

export const FormSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

export const FormCard = styled(motion.div)`
  background-color: var(--color-background);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
`;
