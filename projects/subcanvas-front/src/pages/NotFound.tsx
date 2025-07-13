import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { FiAlertCircle } from 'react-icons/fi';

const NotFound: React.FC = () => {
  return (
    <NotFoundContainer>
      <IconWrapper>
        <FiAlertCircle size={64} />
      </IconWrapper>
      <Title>페이지를 찾을 수 없습니다</Title>
      <Description>
        요청하신 페이지가 존재하지 않거나 삭제되었을 수 있습니다.
      </Description>
      <ButtonsContainer>
        <BackButton onClick={() => window.history.back()}>
          이전 페이지로 돌아가기
        </BackButton>
        <HomeButton to="/">
          홈으로 가기
        </HomeButton>
      </ButtonsContainer>
    </NotFoundContainer>
  );
};

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 2rem;
  text-align: center;
`;

const IconWrapper = styled.div`
  color: var(--color-error);
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0 0 1rem;
  color: var(--color-text);
`;

const Description = styled.p`
  font-size: 1.125rem;
  color: var(--color-secondary);
  margin: 0 0 2rem;
  max-width: 500px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const BackButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--color-background-hover);
  }
`;

const HomeButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

export default NotFound;
