import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiMail, FiArrowLeft } from 'react-icons/fi';

// 비밀번호 재설정 요청 폼을 위한 스키마
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: '이메일을 입력해주세요.' })
    .email({ message: '유효한 이메일 주소를 입력해주세요.' }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // 실제 구현에서는 API 호출이 필요합니다
      // const response = await authService.forgotPassword(data.email);
      
      // API 호출 대신 비동기 작업 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
      
      // 개발 환경에서 로그 남기기
      console.log('비밀번호 재설정 요청:', data.email);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('비밀번호 재설정 요청 중 오류가 발생했습니다. 나중에 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ForgotPasswordContainer>
      {!isSubmitted ? (
        <>
          <HeaderSection>
            <BackLink to="/auth/login">
              <FiArrowLeft /> 로그인으로 돌아가기
            </BackLink>
            <Title>비밀번호 찾기</Title>
            <Description>
              계정에 연결된 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
            </Description>
          </HeaderSection>

          {error && <ErrorAlert>{error}</ErrorAlert>}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label htmlFor="email">이메일</Label>
              <InputWrapper>
                <InputIcon>
                  <FiMail />
                </InputIcon>
                <Input
                  id="email"
                  type="email"
                  placeholder="가입시 사용한 이메일을 입력하세요"
                  {...register('email')}
                  error={!!errors.email}
                />
              </InputWrapper>
              {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
            </FormGroup>

            <SubmitButton 
              type="submit" 
              disabled={isSubmitting}
              as={motion.button}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? '처리중...' : '비밀번호 재설정 링크 받기'}
            </SubmitButton>
          </Form>
        </>
      ) : (
        <SuccessContainer
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SuccessIcon>✓</SuccessIcon>
          <SuccessTitle>이메일을 발송했습니다</SuccessTitle>
          <SuccessMessage>
            비밀번호 재설정 지침이 포함된 이메일을 발송했습니다. 이메일이 도착하지 않았다면 스팸함을 확인하거나 다시 시도해주세요.
          </SuccessMessage>
          <BackToLoginButton to="/auth/login">로그인으로 돌아가기</BackToLoginButton>
        </SuccessContainer>
      )}
    </ForgotPasswordContainer>
  );
};

// 스타일 컴포넌트
const ForgotPasswordContainer = styled.div`
  max-width: 450px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const HeaderSection = styled.div`
  margin-bottom: 2rem;
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  
  &:hover {
    color: var(--color-primary);
  }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: var(--color-text);
`;

const Description = styled.p`
  color: var(--color-text-secondary);
  font-size: 1rem;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: var(--color-text);
`;

const InputWrapper = styled.div`
  display: flex;
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
`;

const Input = styled.input<{ error?: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid ${props => props.error ? 'var(--color-error)' : 'var(--color-border)'};
  border-radius: var(--border-radius);
  font-size: 1rem;
  background-color: var(--color-input-background);
  color: var(--color-text);
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
  }
`;

const ErrorMessage = styled.span`
  color: var(--color-error);
  font-size: 0.85rem;
`;

const ErrorAlert = styled.div`
  padding: 1rem;
  background-color: var(--color-error-bg);
  color: var(--color-error);
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const SubmitButton = styled.button`
  padding: 0.875rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--color-primary-dark);
  }

  &:disabled {
    background-color: var(--color-disabled);
    cursor: not-allowed;
  }
`;

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
`;

const SuccessIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--color-success);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

const SuccessTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-text);
`;

const SuccessMessage = styled.p`
  color: var(--color-text-secondary);
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 2rem;
`;

const BackToLoginButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: var(--color-background-alt);
  color: var(--color-text);
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--color-border);
  }
`;

export default ForgotPassword;
