import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShare2, FiCopy, FiTwitter, FiInstagram, FiGithub, FiFacebook, FiCode } from 'react-icons/fi';
import ProfileQRCode from '../components/profile/ProfileQRCode';
import profileService from '../api/profileService';
import type { ProfilePage, ProfileContent } from '../types';

const ProfileView: React.FC = () => {
  const { pagePath } = useParams<{ pagePath: string }>();
  const [profile, setProfile] = useState<ProfilePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!pagePath) return;
      
      try {
        setLoading(true);
        const profileData = await profileService.getProfileByPath(pagePath);
        setProfile(profileData);
        
        // 방문 기록 추가
        await profileService.recordVisit(profileData.id);
      } catch (err) {
        console.error('프로필 로드 실패:', err);
        setError('프로필을 찾을 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [pagePath]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('링크가 클립보드에 복사되었습니다.');
    setShowShareModal(false);
  };

  const handleShowQRCode = () => {
    setShowQRModal(true);
    setShowShareModal(false);
  };
  
  const handleCloseQRModal = () => {
    setShowQRModal(false);
  };

  const handleShareSocial = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${profile?.pagePath}님의 SubCanvas 프로필을 확인해보세요!`);
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    setShowShareModal(false);
  };

  // 콘텐츠 렌더링 함수
  const renderContent = (content: ProfileContent) => {
    switch (content.contentType) {
      case 'BIO_TEXT':
        return (
          <TextContent>
            {content.contentValue.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </TextContent>
        );
      case 'IMAGE':
        return (
          <ImageContent>
            <img src={content.contentValue} alt="프로필 이미지" />
          </ImageContent>
        );
      case 'LINK':
        // URL에서 도메인 추출
        let domain = '';
        try {
          const url = new URL(content.contentValue);
          domain = url.hostname.replace('www.', '');
        } catch (e) {
          domain = '링크';
        }

        return (
          <LinkContent href={content.contentValue} target="_blank" rel="noopener noreferrer">
            <LinkIcon>
              {domain.includes('twitter') && <FiTwitter />}
              {domain.includes('instagram') && <FiInstagram />}
              {domain.includes('github') && <FiGithub />}
              {domain.includes('facebook') && <FiFacebook />}
              {!domain.includes('twitter') && 
               !domain.includes('instagram') && 
               !domain.includes('github') && 
               !domain.includes('facebook') && <FiLink />}
            </LinkIcon>
            <LinkText>{domain}</LinkText>
            <LinkArrow>→</LinkArrow>
          </LinkContent>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <p>프로필을 불러오는 중...</p>
      </LoadingContainer>
    );
  }

  if (error || !profile) {
    return (
      <ErrorContainer>
        <ErrorTitle>404</ErrorTitle>
        <ErrorMessage>{error || '프로필을 찾을 수 없습니다.'}</ErrorMessage>
        <BackLink to="/">메인으로 돌아가기</BackLink>
      </ErrorContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfilePath>{profile.pagePath}</ProfilePath>
        <ShareButton onClick={() => setShowShareModal(true)}>
          <FiShare2 />
          <span>공유</span>
        </ShareButton>
      </ProfileHeader>

      <ContentContainer>
        {profile.contents && profile.contents
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((content) => (
            <ContentItem 
              key={content.id} 
              style={{opacity: 1, transform: 'translateY(0)'}} 
              className="animated-content"
            >
              {renderContent(content)}
            </ContentItem>
          ))}
      </ContentContainer>

      <Footer>
        <FooterText>
          Powered by <FooterLink to="/">SubCanvas</FooterLink>
        </FooterText>
      </Footer>

      <AnimatePresence>
        {showShareModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowShareModal(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100
            }}
          >
            <motion.div 
              className="modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#fff',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                maxWidth: '90vw',
                width: '400px',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              <ModalTitle>프로필 공유하기</ModalTitle>
              <ShareOptions>
                <ShareOption onClick={handleCopyLink}>
                  <ShareIconWrapper>
                    <FiCopy />
                  </ShareIconWrapper>
                  <ShareOptionText>링크 복사</ShareOptionText>
                </ShareOption>
                <ShareOption onClick={handleShowQRCode}>
                  <ShareIconWrapper>
                    <FiCode />
                  </ShareIconWrapper>
                  <ShareOptionText>QR 코드</ShareOptionText>
                </ShareOption>
                <ShareOption onClick={() => handleShareSocial('twitter')}>
                  <ShareIconWrapper className="twitter">
                    <FiTwitter />
                  </ShareIconWrapper>
                  <ShareOptionText>트위터</ShareOptionText>
                </ShareOption>
                <ShareOption onClick={() => handleShareSocial('facebook')}>
                  <ShareIconWrapper className="facebook">
                    <FiFacebook />
                  </ShareIconWrapper>
                  <ShareOptionText>페이스북</ShareOptionText>
                </ShareOption>
              </ShareOptions>
              <CloseButton onClick={() => setShowShareModal(false)}>
                닫기
              </CloseButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showQRModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseQRModal}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100
            }}
          >
            <motion.div 
              className="modal"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                backgroundColor: '#fff',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                maxWidth: '90vw',
                width: '400px',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              <ModalTitle>QR 코드</ModalTitle>
              <CloseButton onClick={handleCloseQRModal}>&times;</CloseButton>
              {profile && (
                <QRCodeContainer>
                  <ProfileQRCode 
                    profileUrl={window.location.href} 
                    size={250} 
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </QRCodeContainer>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ProfileContainer>
  );
};

// 스타일 컴포넌트
const ProfileContainer = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ProfilePath = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-text);
`;

const ShareButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius);
  color: var(--color-text);
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ContentItem = styled.div`
  border-radius: var(--border-radius);
  overflow: hidden;
`;

const TextContent = styled.div`
  padding: 1.5rem;
  background-color: var(--color-background);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  
  p {
    margin: 0 0 1rem;
    line-height: 1.6;
    color: var(--color-text);
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const ImageContent = styled.div`
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  
  img {
    display: block;
    width: 100%;
    height: auto;
  }
`;

const LinkContent = styled.a`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: var(--color-background);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  text-decoration: none;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const LinkIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.05);
  margin-right: 1rem;
  
  svg {
    color: var(--color-primary);
    font-size: 1.25rem;
  }
`;

const LinkText = styled.span`
  flex: 1;
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text);
`;

const LinkArrow = styled.span`
  font-size: 1.25rem;
  color: var(--color-secondary);
`;

const Footer = styled.footer`
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const FooterText = styled.p`
  font-size: 0.875rem;
  color: var(--color-secondary);
  margin: 0;
`;

const FooterLink = styled(Link)`
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem;
  color: var(--color-text);
  text-align: center;
`;

const ShareOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ShareOption = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
`;

const ShareIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--color-text);
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  
  &.twitter {
    background-color: rgba(29, 161, 242, 0.1);
    color: #1da1f2;
    
    &:hover {
      background-color: rgba(29, 161, 242, 0.2);
    }
  }
  
  &.facebook {
    background-color: rgba(59, 89, 152, 0.1);
    color: #3b5998;
    
    &:hover {
      background-color: rgba(59, 89, 152, 0.2);
    }
  }
  
  svg {
    font-size: 1.25rem;
  }
`;

const ShareOptionText = styled.span`
  font-size: 0.75rem;
  color: var(--color-text);
`;

const CloseButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: none;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius);
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
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

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
`;

const ErrorTitle = styled.h2`
  font-size: 6rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-secondary);
`;

const ErrorMessage = styled.p`
  font-size: 1.25rem;
  color: var(--color-text);
  margin: 1rem 0 2rem;
`;

const BackLink = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--color-secondary);
  }
`;

// FiLink 컴포넌트 정의
const FiLink: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
  </svg>
);

const QRCodeContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem 0;
`;

export default ProfileView;
