import React, { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShare2, FiHome, FiInfo } from 'react-icons/fi';
import profileService from '../api/profileService';
import type { ProfilePage } from '../types';
import {
  Container,
  ProfileHeader,
  HeaderContent,
  LogoLink,
  Logo,
  ActionButtons,
  ShareButton,
  ShareOptions,
  ShareOption,
  ShareOptionLink,
  HomeLink,
  ProfileContent,
  ProfileFooter,
  FooterContent,
  FooterText,
  FooterLink,
  LoadingContainer,
  LoadingSpinner,
  ErrorContainer,
  ErrorIcon,
  ErrorTitle,
  ErrorMessage,
  HomeButton
} from './ProfileLayout.styles';

const ProfileLayout: React.FC = () => {
  const { pagePath } = useParams<{ pagePath: string }>();
  const [profilePage, setProfilePage] = useState<ProfilePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareOptions, setShowShareOptions] = useState(false);

  useEffect(() => {
    const fetchProfilePage = async () => {
      if (!pagePath) return;
      
      try {
        setLoading(true);
        const data = await profileService.getProfileByPath(pagePath);
        setProfilePage(data);
        
        // 방문 기록 추가
        await profileService.recordVisit(data.id);
      } catch (err) {
        console.error('프로필 페이지 로드 실패:', err);
        setError('프로필 페이지를 찾을 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfilePage();
  }, [pagePath]);

  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('링크가 클립보드에 복사되었습니다.');
    setShowShareOptions(false);
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <p>프로필을 불러오는 중...</p>
      </LoadingContainer>
    );
  }

  if (error || !profilePage) {
    return (
      <ErrorContainer>
        <ErrorIcon>
          <FiInfo size={48} />
        </ErrorIcon>
        <ErrorTitle>페이지를 찾을 수 없습니다</ErrorTitle>
        <ErrorMessage>{error || '요청하신 프로필 페이지가 존재하지 않습니다.'}</ErrorMessage>
        <HomeButton to="/">홈으로 돌아가기</HomeButton>
      </ErrorContainer>
    );
  }

  return (
    <Container>
      <ProfileHeader>
        <HeaderContent>
          <LogoLink to="/">
            <Logo>SubCanvas</Logo>
          </LogoLink>
          
          <ActionButtons>
            <ShareButton onClick={handleShare}>
              <FiShare2 size={20} />
              <span>공유하기</span>
            </ShareButton>
            
            {showShareOptions && (
              <ShareOptions>
                <ShareOption onClick={copyToClipboard}>링크 복사</ShareOption>
                <ShareOptionLink href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('SubCanvas에서 만든 내 프로필을 확인해보세요!')}`} target="_blank" rel="noopener noreferrer">
                  Twitter 공유
                </ShareOptionLink>
                <ShareOptionLink href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer">
                  Facebook 공유
                </ShareOptionLink>
              </ShareOptions>
            )}
            
            <HomeLink to="/">
              <FiHome size={20} />
              <span>홈</span>
            </HomeLink>
          </ActionButtons>
        </HeaderContent>
      </ProfileHeader>

      <ProfileContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet context={{ profilePage }} />
        </motion.div>
      </ProfileContent>

      <ProfileFooter>
        <FooterContent>
          <FooterText>
            © {new Date().getFullYear()} SubCanvas | 
            <FooterLink to="/privacy"> 개인정보 처리방침</FooterLink> | 
            <FooterLink to="/terms"> 이용약관</FooterLink>
          </FooterText>
        </FooterContent>
      </ProfileFooter>
    </Container>
  );
};



export default ProfileLayout;
