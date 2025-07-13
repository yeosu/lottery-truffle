import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import {
  Container,
  BackButton,
  ContentWrapper,
  LogoSection,
  Logo,
  Tagline,
  FormSection,
  FormCard
} from './AuthLayout.styles';

const AuthLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // 이미 인증된 사용자는 대시보드로 리다이렉트
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <Container>
      <BackButton onClick={() => navigate('/')}>
        <FiArrowLeft size={20} />
        <span>홈으로</span>
      </BackButton>

      <ContentWrapper>
        <LogoSection>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Logo>SubCanvas</Logo>
            <Tagline>나만의 프로필 페이지를 만들고 공유하세요</Tagline>
          </motion.div>
        </LogoSection>

        <FormSection>
          <FormCard
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Outlet />
          </FormCard>
        </FormSection>
      </ContentWrapper>
    </Container>
  );
};



export default AuthLayout;
