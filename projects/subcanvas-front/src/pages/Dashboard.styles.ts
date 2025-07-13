import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

export const DashboardContainer = styled.div`
  padding: 1rem 0;
`;

export const DashboardHeader = styled.div`
  margin-bottom: 2rem;
`;

export const DashboardTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: var(--color-text);
`;

export const WelcomeMessage = styled.p`
  font-size: 1.125rem;
  color: var(--color-secondary);
  margin: 0;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0 1rem;
  color: var(--color-text);
`;

export const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const ProfileCard = styled.div`
  background-color: var(--color-background);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

export const ProfileCardHeader = styled.div`
  padding: 1.25rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

export const ProfileName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: var(--color-text);
`;

export const ProfileDate = styled.p`
  font-size: 0.875rem;
  color: var(--color-secondary);
  margin: 0;
`;

export const ProfileCardBody = styled.div`
  padding: 1.25rem;
  flex: 1;
`;

export const ProfileDesignConcept = styled.p`
  font-size: 0.875rem;
  color: var(--color-text);
  margin: 0 0 1rem;
  line-height: 1.5;
`;

export const ProfileStats = styled.div`
  display: flex;
  gap: 1rem;
`;

export const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-secondary);
`;

export const ProfileCardActions = styled.div`
  display: flex;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

export const ActionButtonLink = styled(Link)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  &.delete:hover {
    background-color: rgba(239, 68, 68, 0.1);
    color: var(--color-error);
  }
  
  &:not(:last-child) {
    border-right: 1px solid rgba(0, 0, 0, 0.1);
  }
`;

export const ActionButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  &.delete:hover {
    background-color: rgba(239, 68, 68, 0.1);
    color: var(--color-error);
  }
  
  &:not(:last-child) {
    border-right: 1px solid rgba(0, 0, 0, 0.1);
  }
`;

export const NewProfileCard = styled(Link)`
  background-color: var(--color-background);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  border: 2px dashed rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, border-color 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    border-color: var(--color-primary);
  }
`;

export const NewProfileContent = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  height: 100%;
`;

export const PlusIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
`;

export const NewProfileText = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text);
  margin: 0;
  text-align: center;
`;

export const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  background-color: var(--color-background);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-bottom: 2rem;
`;

export const EmptyStateText = styled.p`
  font-size: 1.125rem;
  color: var(--color-secondary);
  margin: 0 0 1.5rem;
`;

export const EmptyStateAction = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  font-weight: 500;
  border-radius: var(--border-radius-sm);
  text-decoration: none;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

export const ActivitySection = styled.div`
  background-color: var(--color-background);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

export const ComingSoon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: var(--color-secondary);
  
  p {
    font-size: 1.125rem;
    margin: 0;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
  color: var(--color-secondary);
  
  p {
    margin-top: 1rem;
    font-size: 1.125rem;
  }
`;

export const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const ErrorMessage = styled.div`
  padding: 1rem;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: var(--border-radius);
  color: var(--color-error);
  margin-bottom: 1rem;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

export const Modal = styled.div`
  background-color: var(--color-background);
  border-radius: var(--border-radius);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

export const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  padding: 1.25rem;
  margin: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

export const ModalContent = styled.div`
  padding: 1.25rem;
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.25rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

export const ModalButton = styled.button`
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: background-color 0.2s;
  
  background-color: var(--color-background-light);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: var(--color-text);
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  &.delete {
    background-color: var(--color-error);
    border: 1px solid var(--color-error);
    color: white;
    
    &:hover {
      background-color: var(--color-error-dark);
    }
  }
`;

// QR 코드 관련 스타일
export const QRCodeContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem 0;
`;

export const QRCodeActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
`;

export const QRButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: var(--color-primary);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

// 관심도 시스템 관련 스타일
export const InterestSection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

export const InterestTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem;
  color: var(--color-text);
`;

export const InterestStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

export const InterestStatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  
  span {
    font-size: 0.75rem;
    color: var(--color-secondary);
  }
  
  strong {
    font-size: 1.125rem;
    color: var(--color-text);
  }
`;

export const InterestLevel = styled.div<{ level: number }>`
  font-size: 1.125rem;
  font-weight: bold;
  color: ${props => {
    if (props.level >= 10) return 'var(--color-success)';
    if (props.level >= 5) return 'var(--color-warning)';
    return 'var(--color-primary)';
  }};
`;

export const InterestProgress = styled.progress`
  width: 100%;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  
  &::-webkit-progress-bar {
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }
  
  &::-webkit-progress-value {
    background-color: var(--color-primary);
    border-radius: 4px;
  }
`;

export const InterestLevelBadge = styled.div<{ level: number }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => {
    if (props.level >= 10) return 'rgba(34, 197, 94, 0.1)';
    if (props.level >= 5) return 'rgba(245, 158, 11, 0.1)';
    return 'rgba(59, 130, 246, 0.1)';
  }};
  color: ${props => {
    if (props.level >= 10) return 'var(--color-success)';
    if (props.level >= 5) return 'var(--color-warning)';
    return 'var(--color-primary)';
  }};
  margin-left: auto;
`;
