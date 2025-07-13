import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiBarChart2, FiLink, FiCopy, FiDownload, FiShare2 } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import profileService from '../api/profileService';
import type { ProfilePage } from '../types';
import { QRCodeSVG as QRCode } from 'qrcode.react';

// 스타일 컴포넌트 임포트
import {
  DashboardContainer,
  DashboardHeader,
  DashboardTitle,
  WelcomeMessage,
  SectionTitle,
  ProfileGrid,
  ProfileCard,
  ProfileCardHeader,
  ProfileName,
  ProfileDate,
  ProfileCardBody,
  ProfileDesignConcept,
  ProfileStats,
  StatItem,
  ProfileCardActions,
  ActionButton,
  ActionButtonLink,
  NewProfileCard,
  NewProfileContent,
  PlusIcon,
  NewProfileText,
  EmptyState,
  EmptyStateText,
  EmptyStateAction,
  ActivitySection,
  ComingSoon,
  LoadingContainer,
  LoadingSpinner,
  ErrorMessage,
  ModalOverlay,
  Modal,
  ModalTitle,
  ModalContent,
  ModalActions,
  ModalButton,
  QRCodeContainer,
  QRCodeActions,
  QRButton,
  InterestSection,
  InterestTitle,
  InterestStats,
  InterestStatItem,
  InterestLevel,
  InterestProgress,
  InterestLevelBadge
} from './Dashboard.styles';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<ProfilePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteProfileId, setDeleteProfileId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<ProfilePage | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);

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

export default Dashboard;
