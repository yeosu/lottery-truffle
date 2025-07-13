import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiBarChart2, FiLink, FiCopy, FiDownload, FiShare2 } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import profileService from '../api/profileService';
import type { ProfilePage } from '../types';
import QRCode from 'qrcode.react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<ProfilePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteProfileId, setDeleteProfileId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<ProfilePage | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [visitStats, setVisitStats] = useState<{ date: string; count: number }[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsPeriod, setStatsPeriod] = useState<'day' | 'week' | 'month'>('week');

  useEffect(() => {
    const fetchUserProfiles = async () => {
      try {
        setLoading(true);
        const userProfiles = await profileService.getUserProfiles();
        setProfiles(userProfiles);
      } catch (err) {
        console.error('프로필 목록 로드 실패:', err);
        setError('프로필 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfiles();
  }, []);

  const handleDeleteClick = (profileId: number) => {
    setDeleteProfileId(profileId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteProfileId) {
      try {
        await profileService.deleteProfile(deleteProfileId);
        setProfiles(profiles.filter(profile => profile.id !== deleteProfileId));
        setShowDeleteModal(false);
        setDeleteProfileId(null);
      } catch (err) {
        console.error('프로필 삭제 실패:', err);
        setError('프로필 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleCopyProfileLink = (pagePath: string) => {
    const url = `${window.location.origin}/p/${pagePath}`;
    navigator.clipboard.writeText(url);
    alert('프로필 링크가 클립보드에 복사되었습니다.');
  };

  // 관심도 레벨 계산 함수
  const calculateInterestLevel = (visits: number): number => {
    if (visits <= 0) return 0;
    return Math.floor(visits / getInterestLevelStep()) + 1;
  };

  // 다음 레벨까지 남은 방문 수 계산
  const getNextLevelThreshold = (visits: number): number => {
    const currentLevel = calculateInterestLevel(visits);
    return currentLevel * getInterestLevelStep();
  };

  // 레벨업에 필요한 방문 수 단계 (10 방문마다 레벨업)
  const getInterestLevelStep = (): number => {
    return 10;
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <p>프로필 목록을 불러오는 중...</p>
      </LoadingContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>대시보드</DashboardTitle>
        <WelcomeMessage>안녕하세요, {user?.nickname}님!</WelcomeMessage>
      </DashboardHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <SectionTitle>내 프로필 페이지</SectionTitle>
      
      <ProfileGrid>
        <NewProfileCard to="/dashboard/profile/new">
          <NewProfileContent>
            <PlusIcon>
              <FiPlus size={32} />
            </PlusIcon>
            <NewProfileText>새 프로필 만들기</NewProfileText>
          </NewProfileContent>
        </NewProfileCard>

        {profiles.map(profile => (
          <ProfileCard
            key={profile.id}
          >
            <ProfileCardHeader>
              <ProfileName>{profile.pagePath}</ProfileName>
              <ProfileDate>생성일: {new Date(profile.createdAt).toLocaleDateString()}</ProfileDate>
            </ProfileCardHeader>

            <ProfileCardBody>
              <ProfileDesignConcept>
                {profile.designConcept || '디자인 컨셉이 설정되지 않았습니다.'}
              </ProfileDesignConcept>

              <ProfileStats>
                <StatItem>
                  <FiBarChart2 />
                  <span>{profile.visits?.length || 0} 방문</span>
                </StatItem>
                <StatItem>
                  <FiLink />
                  <span>{profile.contents?.filter(c => c.contentType === 'LINK').length || 0} 링크</span>
                </StatItem>
                <InterestLevelBadge level={calculateInterestLevel(profile.visits?.length || 0)}>
                  레벨 {calculateInterestLevel(profile.visits?.length || 0)}
                </InterestLevelBadge>
              </ProfileStats>
            </ProfileCardBody>

            <ProfileCardActions>
              <ActionButton 
                onClick={() => handleCopyProfileLink(profile.pagePath)}
                title="프로필 링크 복사"
              >
                <FiCopy />
              </ActionButton>
              <ActionButton 
                onClick={() => {
                  setSelectedProfile(profile);
                  setShowQrModal(true);
                }}
                title="QR코드 생성"
              >
                <FiShare2 />
              </ActionButton>
              <ActionButtonLink 
                to={`/p/${profile.pagePath}`}
                title="프로필 보기"
              >
                <FiEye />
              </ActionButtonLink>
              <ActionButtonLink 
                to={`/dashboard/profile/edit/${profile.id}`}
                title="프로필 편집"
              >
                <FiEdit2 />
              </ActionButtonLink>
              <ActionButton 
                onClick={() => handleDeleteClick(profile.id)}
                title="프로필 삭제"
                className="delete"
              >
                <FiTrash2 />
              </ActionButton>
            </ProfileCardActions>
          </ProfileCard>
        ))}
      </ProfileGrid>

      {profiles.length === 0 && !loading && (
        <EmptyState>
          <EmptyStateText>아직 생성된 프로필이 없습니다.</EmptyStateText>
          <EmptyStateAction to="/dashboard/profile/new">
            첫 번째 프로필 만들기
          </EmptyStateAction>
        </EmptyState>
      )}

      <SectionTitle>최근 활동</SectionTitle>
      <ActivitySection>
        <ComingSoon>
          <p>활동 내역 기능이 곧 추가될 예정입니다.</p>
        </ComingSoon>
      </ActivitySection>

      {showDeleteModal && (
        <ModalOverlay>
          <Modal>
            <ModalTitle>프로필 삭제</ModalTitle>
            <ModalContent>
              정말로 이 프로필을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </ModalContent>
            <ModalActions>
              <ModalButton onClick={() => setShowDeleteModal(false)}>
                취소
              </ModalButton>
              <ModalButton className="delete" onClick={handleDeleteConfirm}>
                삭제
              </ModalButton>
            </ModalActions>
          </Modal>
        </ModalOverlay>
      )}

      {showQrModal && selectedProfile && (
        <ModalOverlay>
          <Modal>
            <ModalTitle>QR 코드 - {selectedProfile.pagePath}</ModalTitle>
            <ModalContent>
              <QRCodeContainer>
                <QRCode 
                  value={`${window.location.origin}/p/${selectedProfile.pagePath}`} 
                  size={200}
                  level="H"
                  imageSettings={{
                    src: '/logo.png',
                    width: 40,
                    height: 40,
                    excavate: true,
                  }}
                />
              </QRCodeContainer>
              <QRCodeActions>
                <QRButton onClick={() => {
                  const canvas = document.querySelector('canvas');
                  if (canvas) {
                    const link = document.createElement('a');
                    link.download = `${selectedProfile.pagePath}-qrcode.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                  }
                }}>
                  <FiDownload /> 다운로드
                </QRButton>
                <QRButton onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `${selectedProfile.pagePath} - SubCanvas 프로필`,
                      text: `내 SubCanvas 프로필을 확인해보세요!`,
                      url: `${window.location.origin}/p/${selectedProfile.pagePath}`,
                    });
                  } else {
                    handleCopyProfileLink(selectedProfile.pagePath);
                  }
                }}>
                  <FiShare2 /> 공유하기
                </QRButton>
              </QRCodeActions>
              <InterestSection>
                <InterestTitle>관심도 정보</InterestTitle>
                <InterestStats>
                  <InterestStatItem>
                    <span>총 방문수</span>
                    <strong>{selectedProfile.visits?.length || 0}</strong>
                  </InterestStatItem>
                  <InterestStatItem>
                    <span>현재 레벨</span>
                    <InterestLevel level={calculateInterestLevel(selectedProfile.visits?.length || 0)}>
                      {calculateInterestLevel(selectedProfile.visits?.length || 0)}
                    </InterestLevel>
                  </InterestStatItem>
                  <InterestStatItem>
                    <span>다음 레벨까지</span>
                    <strong>{getNextLevelThreshold(selectedProfile.visits?.length || 0) - (selectedProfile.visits?.length || 0)} 방문 필요</strong>
                  </InterestStatItem>
                </InterestStats>
                <InterestProgress 
                  value={(selectedProfile.visits?.length || 0) % getInterestLevelStep()} 
                  max={getInterestLevelStep()} 
                />
              </InterestSection>
            </ModalContent>
            <ModalActions>
              <ModalButton onClick={() => setShowQrModal(false)}>
                닫기
              </ModalButton>
            </ModalActions>
          </Modal>
        </ModalOverlay>
      )}
    </DashboardContainer>
  );
};

// 스타일 컴포넌트
const DashboardContainer = styled.div`
  padding: 1rem 0;
`;

const DashboardHeader = styled.div`
  margin-bottom: 2rem;
`;

const DashboardTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: var(--color-text);
`;

const WelcomeMessage = styled.p`
  font-size: 1.125rem;
  color: var(--color-secondary);
  margin: 0;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0 1rem;
  color: var(--color-text);
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ProfileCard = styled.div`
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

const ProfileCardHeader = styled.div`
  padding: 1.25rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const ProfileName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: var(--color-text);
`;

const ProfileDate = styled.p`
  font-size: 0.875rem;
  color: var(--color-secondary);
  margin: 0;
`;

const ProfileCardBody = styled.div`
  padding: 1.25rem;
  flex: 1;
`;

const ProfileDesignConcept = styled.p`
  font-size: 0.875rem;
  color: var(--color-text);
  margin: 0 0 1rem;
  line-height: 1.5;
`;

const ProfileStats = styled.div`
  display: flex;
  gap: 1rem;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-secondary);
`;

const ProfileCardActions = styled.div`
  display: flex;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const ActionButtonLink = styled(Link)`
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

const ActionButton = styled.button`
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

const NewProfileCard = styled(Link)`
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

const NewProfileContent = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  height: 100%;
`;

const PlusIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
`;

const NewProfileText = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text);
  margin: 0;
  text-align: center;
`;

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  background-color: var(--color-background);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-bottom: 2rem;
`;

const EmptyStateText = styled.p`
  font-size: 1.125rem;
  color: var(--color-secondary);
  margin: 0 0 1.5rem;
`;

const EmptyStateAction = styled(Link)`
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

const ActivitySection = styled.div`
  background-color: var(--color-background);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ComingSoon = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--color-secondary);
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: var(--border-radius);
  color: var(--color-error);
  margin-bottom: 1.5rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background-color: var(--color-background);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  width: 90%;
  max-width: 400px;
  padding: 1.5rem;
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem;
  color: var(--color-text);
`;

const ModalContent = styled.p`
  font-size: 1rem;
  color: var(--color-text);
  margin: 0 0 1.5rem;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const ModalButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:not(.delete) {
    background: none;
    border: 1px solid rgba(0, 0, 0, 0.1);
    color: var(--color-text);
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
  
  &.delete {
    background-color: var(--color-error);
    border: none;
    color: white;
    
    &:hover {
      background-color: #c53030;
    }
  }
`;

// 추가 스타일 컴포넌트
const QRCodeContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem 0;
`;

const QRCodeActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
`;

const QRButton = styled.button`
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

const InterestSection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const InterestTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem;
  color: var(--color-text);
`;

const InterestStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const InterestStatItem = styled.div`
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

const InterestLevel = styled.div<{ level: number }>`
  font-size: 1.125rem;
  font-weight: bold;
  color: ${props => {
    if (props.level >= 10) return 'var(--color-success)';
    if (props.level >= 5) return 'var(--color-warning)';
    return 'var(--color-primary)';
  }};
`;

const InterestProgress = styled.progress`
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

const InterestLevelBadge = styled.div<{ level: number }>`
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

export default Dashboard;
