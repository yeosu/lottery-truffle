import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, socialLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 입력값 검증
    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      await login(email, password);
    } catch (err: any) {
      console.error('로그인 실패:', err);
      setError(err.response?.data?.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 실제 구현에서는 OAuth 인증 과정을 거쳐 토큰을 받아와야 함
      // 여기서는 예시로 구현
      if (provider === 'google') {
        // Google OAuth 로그인 처리
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
      } else if (provider === 'kakao') {
        // Kakao OAuth 로그인 처리
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/kakao`;
      }
    } catch (err: any) {
      console.error('소셜 로그인 실패:', err);
      setError(err.response?.data?.message || '소셜 로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // OAuth 콜백 처리
  React.useEffect(() => {
    const handleOAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const provider = params.get('provider');
      const error = params.get('error');
      
      if (error) {
        setError(decodeURIComponent(error));
        return;
      }
      
      if (token && provider) {
        try {
          await socialLogin(provider, token);
        } catch (err) {
          console.error('소셜 로그인 콜백 처리 실패:', err);
          setError('소셜 로그인 처리 중 오류가 발생했습니다.');
        }
      }
    };
    
    handleOAuthCallback();
  }, [socialLogin]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <FormTitle>로그인</FormTitle>
      <FormSubtitle>SubCanvas에 오신 것을 환영합니다</FormSubtitle>
      
      {error && (
        <ErrorMessage>
          <FiAlertCircle />
          <span>{error}</span>
        </ErrorMessage>
      )}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="email">이메일</Label>
          <InputWrapper>
            <FiMail />
            <Input
              id="email"
              type="email"
              placeholder="이메일 주소를 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </InputWrapper>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="password">비밀번호</Label>
          <InputWrapper>
            <FiLock />
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </InputWrapper>
        </FormGroup>
        
        <ForgotPassword to="/auth/forgot-password">비밀번호를 잊으셨나요?</ForgotPassword>
        
        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? '로그인 중...' : '로그인'}
        </SubmitButton>
      </Form>
      
      <Divider>
        <DividerText>또는</DividerText>
      </Divider>
      
      <SocialButtons>
        <SocialButton 
          type="button"
          onClick={() => handleSocialLogin('google')}
          disabled={isLoading}
        >
          <FcGoogle size={20} />
          <span>Google로 계속하기</span>
        </SocialButton>
        
        <SocialButton 
          type="button"
          onClick={() => handleSocialLogin('kakao')}
          disabled={isLoading}
          className="kakao"
        >
          <RiKakaoTalkFill size={20} />
          <span>카카오로 계속하기</span>
        </SocialButton>
      </SocialButtons>
      
      <SignupPrompt>
        계정이 없으신가요? <SignupLink to="/auth/register">회원가입</SignupLink>
      </SignupPrompt>
    </motion.div>
  );
};

// 스타일 컴포넌트
const FormTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: var(--color-text);
`;

const FormSubtitle = styled.p`
  font-size: 1rem;
  color: var(--color-secondary);
  margin: 0 0 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  
  svg {
    position: absolute;
    left: 1rem;
    color: var(--color-secondary);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius);
  font-size: 1rem;
  background-color: var(--color-background);
  color: var(--color-text);
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
  
  &::placeholder {
    color: rgba(0, 0, 0, 0.3);
  }
  
  &:disabled {
    background-color: rgba(0, 0, 0, 0.05);
    cursor: not-allowed;
  }
`;

const ForgotPassword = styled(Link)`
  font-size: 0.875rem;
  color: var(--color-primary);
  text-decoration: none;
  align-self: flex-end;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 0.5rem;
  
  &:hover:not(:disabled) {
    background-color: var(--color-secondary);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const DividerText = styled.span`
  padding: 0 1rem;
  color: var(--color-secondary);
  font-size: 0.875rem;
`;

const SocialButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius);
  background-color: white;
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover:not(:disabled) {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  &.kakao {
    background-color: #FEE500;
    color: #000000;
    
    &:hover:not(:disabled) {
      background-color: #F6DC00;
    }
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: var(--border-radius);
  color: var(--color-error);
  font-size: 0.875rem;
  margin-bottom: 1rem;
  
  svg {
    flex-shrink: 0;
  }
`;

const SignupPrompt = styled.p`
  text-align: center;
  margin: 1.5rem 0 0;
  font-size: 0.875rem;
  color: var(--color-text);
`;

const SignupLink = styled(Link)`
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default Login;
