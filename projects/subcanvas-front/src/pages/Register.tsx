import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiAlertCircle, FiCheck } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  // 비밀번호 유효성 검사
  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      minLength: password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChars,
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars
    };
  };

  const passwordValidation = validatePassword(password);
  const passwordsMatch = password === confirmPassword && confirmPassword !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 입력값 검증
    if (!email || !password || !confirmPassword || !nickname) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    
    if (!passwordValidation.isValid) {
      setError('비밀번호가 요구사항을 충족하지 않습니다.');
      return;
    }
    
    if (!passwordsMatch) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      await register(email, password, nickname);
    } catch (err: any) {
      console.error('회원가입 실패:', err);
      setError(err.response?.data?.message || '회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <FormTitle>회원가입</FormTitle>
      <FormSubtitle>SubCanvas에서 나만의 프로필 페이지를 만들어보세요</FormSubtitle>
      
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
          <Label htmlFor="nickname">닉네임</Label>
          <InputWrapper>
            <FiUser />
            <Input
              id="nickname"
              type="text"
              placeholder="사용할 닉네임을 입력하세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
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
          
          {password && (
            <PasswordRequirements>
              <RequirementItem satisfied={passwordValidation.minLength}>
                <RequirementIcon>{passwordValidation.minLength ? <FiCheck /> : null}</RequirementIcon>
                <span>8자 이상</span>
              </RequirementItem>
              <RequirementItem satisfied={passwordValidation.hasUpperCase}>
                <RequirementIcon>{passwordValidation.hasUpperCase ? <FiCheck /> : null}</RequirementIcon>
                <span>대문자 포함</span>
              </RequirementItem>
              <RequirementItem satisfied={passwordValidation.hasLowerCase}>
                <RequirementIcon>{passwordValidation.hasLowerCase ? <FiCheck /> : null}</RequirementIcon>
                <span>소문자 포함</span>
              </RequirementItem>
              <RequirementItem satisfied={passwordValidation.hasNumbers}>
                <RequirementIcon>{passwordValidation.hasNumbers ? <FiCheck /> : null}</RequirementIcon>
                <span>숫자 포함</span>
              </RequirementItem>
              <RequirementItem satisfied={passwordValidation.hasSpecialChars}>
                <RequirementIcon>{passwordValidation.hasSpecialChars ? <FiCheck /> : null}</RequirementIcon>
                <span>특수문자 포함</span>
              </RequirementItem>
            </PasswordRequirements>
          )}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="confirmPassword">비밀번호 확인</Label>
          <InputWrapper>
            <FiLock />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
              className={confirmPassword && !passwordsMatch ? 'error' : ''}
            />
          </InputWrapper>
          {confirmPassword && !passwordsMatch && (
            <ErrorText>비밀번호가 일치하지 않습니다.</ErrorText>
          )}
        </FormGroup>
        
        <TermsAgreement>
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">
            <Link to="/terms" target="_blank">이용약관</Link>과 <Link to="/privacy" target="_blank">개인정보 처리방침</Link>에 동의합니다.
          </label>
        </TermsAgreement>
        
        <SubmitButton 
          type="submit" 
          disabled={isLoading || !passwordValidation.isValid || !passwordsMatch}
        >
          {isLoading ? '회원가입 중...' : '회원가입'}
        </SubmitButton>
      </Form>
      
      <LoginPrompt>
        이미 계정이 있으신가요? <LoginLink to="/auth/login">로그인</LoginLink>
      </LoginPrompt>
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
  
  &.error {
    border-color: var(--color-error);
  }
`;

const ErrorText = styled.span`
  font-size: 0.75rem;
  color: var(--color-error);
`;

const PasswordRequirements = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const RequirementItem = styled.div<{ satisfied: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: ${props => props.satisfied ? 'var(--color-success)' : 'var(--color-secondary)'};
`;

const RequirementIcon = styled.span`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--color-success);
  color: white;
`;

const TermsAgreement = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  
  a {
    color: var(--color-primary);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
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

const LoginPrompt = styled.p`
  text-align: center;
  margin: 1.5rem 0 0;
  font-size: 0.875rem;
  color: var(--color-text);
`;

const LoginLink = styled(Link)`
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default Register;
