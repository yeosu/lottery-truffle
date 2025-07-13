import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { FiSave, FiPlus, FiTrash2, FiArrowUp, FiArrowDown, FiImage, FiLink, FiType, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import profileService from '../api/profileService';
import type { ProfilePage, ProfileContent } from '../types';

interface ProfileEditorProps {
  isNew?: boolean;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ isNew = false }) => {
  const { profileId } = useParams<{ profileId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  // 프로필 상태
  const [profile, setProfile] = useState<ProfilePage>({
    id: isNew ? 0 : Number(profileId),
    userId: user?.id || '',
    pagePath: '',
    designConcept: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    contents: []
  });

  // UI 상태
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState<Record<number, number>>({});

  // 기존 프로필 데이터 로드
  useEffect(() => {
    const fetchProfileData = async () => {
      if (isNew) return;
      
      try {
        setLoading(true);
        const profileData = await profileService.getProfileById(Number(profileId));
        setProfile(profileData);
      } catch (err) {
        console.error('프로필 데이터 로드 실패:', err);
        setError('프로필 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [profileId, isNew]);

  // 프로필 정보 업데이트 핸들러
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // 콘텐츠 추가 핸들러
  const handleAddContent = (type: 'IMAGE' | 'BIO_TEXT' | 'LINK') => {
    const newContent: ProfileContent = {
      id: Math.floor(Math.random() * -1000), // 임시 음수 ID (저장 전)
      profileId: profile.id,
      contentType: type,
      contentValue: type === 'BIO_TEXT' ? '자기소개를 입력하세요' : '',
      displayOrder: profile.contents ? profile.contents.length : 0,
      createdAt: new Date().toISOString()
    };
    
    setProfile(prev => ({
      ...prev,
      contents: [...(prev.contents || []), newContent]
    }));
  };

  // 콘텐츠 업데이트 핸들러
  const handleContentChange = (id: number, value: string) => {
    setProfile(prev => ({
      ...prev,
      contents: prev.contents?.map(content => 
        content.id === id ? { ...content, contentValue: value } : content
      )
    }));
  };

  // 콘텐츠 삭제 핸들러
  const handleRemoveContent = (id: number) => {
    setProfile(prev => ({
      ...prev,
      contents: prev.contents?.filter(content => content.id !== id)
    }));
  };

  // 콘텐츠 순서 변경 핸들러
  const handleMoveContent = (id: number, direction: 'up' | 'down') => {
    const contents = [...(profile.contents || [])];
    const index = contents.findIndex(content => content.id === id);
    
    if (direction === 'up' && index > 0) {
      const temp = contents[index];
      contents[index] = contents[index - 1];
      contents[index - 1] = temp;
    } else if (direction === 'down' && index < contents.length - 1) {
      const temp = contents[index];
      contents[index] = contents[index + 1];
      contents[index + 1] = temp;
    }
    
    // 표시 순서 업데이트
    const updatedContents = contents.map((content, idx) => ({
      ...content,
      displayOrder: idx
    }));
    
    setProfile(prev => ({ ...prev, contents: updatedContents }));
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = async (contentId: number, file: File) => {
    try {
      setImageUploadProgress(prev => ({ ...prev, [contentId]: 0 }));
      
      // 이미지 업로드 진행 상황 추적을 위한 콜백
      const onProgress = (progress: number) => {
        setImageUploadProgress(prev => ({ ...prev, [contentId]: progress }));
      };
      
      const imageUrl = await profileService.uploadImage(file, onProgress);
      
      // 업로드 완료 후 콘텐츠 값 업데이트
      handleContentChange(contentId, imageUrl);
      
      // 진행 상태 초기화
      setTimeout(() => {
        setImageUploadProgress(prev => {
          const newState = { ...prev };
          delete newState[contentId];
          return newState;
        });
      }, 1000);
    } catch (err) {
      console.error('이미지 업로드 실패:', err);
      setError('이미지 업로드 중 오류가 발생했습니다.');
    }
  };

  // 프로필 저장 핸들러
  const handleSaveProfile = async () => {
    // 유효성 검사
    if (!profile.pagePath) {
      setError('프로필 페이지 경로를 입력해주세요.');
      return;
    }
    
    // 페이지 경로에 특수문자나 공백이 있는지 확인
    const pathRegex = /^[a-zA-Z0-9_-]+$/;
    if (!pathRegex.test(profile.pagePath)) {
      setError('페이지 경로는 영문자, 숫자, 하이픈(-), 언더스코어(_)만 사용할 수 있습니다.');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      let savedProfile;
      if (isNew) {
        savedProfile = await profileService.createProfile({
          pagePath: profile.pagePath,
          designConcept: profile.designConcept,
          contents: profile.contents?.map(content => ({
            contentType: content.contentType,
            contentValue: content.contentValue,
            displayOrder: content.displayOrder
          })) || []
        });
      } else {
        savedProfile = await profileService.updateProfile(profile.id, {
          pagePath: profile.pagePath,
          designConcept: profile.designConcept,
          contents: profile.contents?.map(content => ({
            id: content.id > 0 ? content.id : undefined, // 기존 콘텐츠만 ID 전달
            contentType: content.contentType,
            contentValue: content.contentValue,
            displayOrder: content.displayOrder
          })) || []
        });
      }
      
      setProfile(savedProfile);
      setSuccess(`프로필이 성공적으로 ${isNew ? '생성' : '업데이트'}되었습니다.`);
      
      // 성공 메시지 표시 후 대시보드로 리다이렉트
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err: any) {
      console.error('프로필 저장 실패:', err);
      setError(err.response?.data?.message || `프로필 ${isNew ? '생성' : '업데이트'} 중 오류가 발생했습니다.`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <p>프로필 정보를 불러오는 중...</p>
      </LoadingContainer>
    );
  }

  return (
    <EditorContainer>
      <EditorHeader>
        <EditorTitle>{isNew ? '새 프로필 만들기' : '프로필 편집'}</EditorTitle>
        <SaveButton onClick={handleSaveProfile} disabled={saving}>
          <FiSave />
          <span>{saving ? '저장 중...' : '저장하기'}</span>
        </SaveButton>
      </EditorHeader>

      {error && (
        <ErrorMessage>
          <FiAlertCircle />
          <span>{error}</span>
        </ErrorMessage>
      )}

      {success && (
        <SuccessMessage>
          <span>{success}</span>
        </SuccessMessage>
      )}

      <FormSection>
        <SectionTitle>기본 정보</SectionTitle>
        
        <FormGroup>
          <Label htmlFor="pagePath">페이지 경로</Label>
          <InputWithPrefix>
            <InputPrefix>subcanvas.com/p/</InputPrefix>
            <Input
              id="pagePath"
              name="pagePath"
              value={profile.pagePath}
              onChange={handleProfileChange}
              placeholder="myprofile"
              disabled={saving}
            />
          </InputWithPrefix>
          <HelperText>
            영문자, 숫자, 하이픈(-), 언더스코어(_)만 사용할 수 있습니다.
          </HelperText>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="designConcept">디자인 컨셉 (선택사항)</Label>
          <Textarea
            id="designConcept"
            name="designConcept"
            value={profile.designConcept || ''}
            onChange={handleProfileChange}
            placeholder="프로필 페이지의 디자인 컨셉을 설명해주세요."
            disabled={saving}
          />
        </FormGroup>
      </FormSection>

      <FormSection>
        <SectionTitle>콘텐츠</SectionTitle>
        <ContentToolbar>
          <ToolbarButton onClick={() => handleAddContent('BIO_TEXT')}>
            <FiType />
            <span>텍스트 추가</span>
          </ToolbarButton>
          <ToolbarButton onClick={() => handleAddContent('IMAGE')}>
            <FiImage />
            <span>이미지 추가</span>
          </ToolbarButton>
          <ToolbarButton onClick={() => handleAddContent('LINK')}>
            <FiLink />
            <span>링크 추가</span>
          </ToolbarButton>
        </ContentToolbar>

        <ContentList>
          {profile.contents && profile.contents.length > 0 ? (
            profile.contents.map((content, index) => (
              <ContentItem
                key={content.id}
                as={motion.div}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ContentHeader>
                  <ContentType>
                    {content.contentType === 'BIO_TEXT' && '텍스트'}
                    {content.contentType === 'IMAGE' && '이미지'}
                    {content.contentType === 'LINK' && '링크'}
                  </ContentType>
                  <ContentActions>
                    <ActionButton 
                      onClick={() => handleMoveContent(content.id, 'up')}
                      disabled={index === 0}
                      title="위로 이동"
                    >
                      <FiArrowUp />
                    </ActionButton>
                    <ActionButton 
                      onClick={() => handleMoveContent(content.id, 'down')}
                      disabled={index === profile.contents!.length - 1}
                      title="아래로 이동"
                    >
                      <FiArrowDown />
                    </ActionButton>
                    <ActionButton 
                      onClick={() => handleRemoveContent(content.id)}
                      title="삭제"
                      className="delete"
                    >
                      <FiTrash2 />
                    </ActionButton>
                  </ContentActions>
                </ContentHeader>

                <ContentBody>
                  {content.contentType === 'BIO_TEXT' && (
                    <Textarea
                      value={content.contentValue}
                      onChange={(e) => handleContentChange(content.id, e.target.value)}
                      placeholder="자기소개나 텍스트 내용을 입력하세요."
                      disabled={saving}
                    />
                  )}

                  {content.contentType === 'LINK' && (
                    <Input
                      value={content.contentValue}
                      onChange={(e) => handleContentChange(content.id, e.target.value)}
                      placeholder="https://example.com"
                      disabled={saving}
                    />
                  )}

                  {content.contentType === 'IMAGE' && (
                    <ImageUploadContainer>
                      {content.contentValue ? (
                        <ImagePreviewContainer>
                          <ImagePreview src={content.contentValue} alt="업로드된 이미지" />
                          <ImageActions>
                            <ImageActionButton onClick={() => handleContentChange(content.id, '')}>
                              변경
                            </ImageActionButton>
                          </ImageActions>
                        </ImagePreviewContainer>
                      ) : (
                        <>
                          <ImageUploadLabel>
                            <ImageUploadInput
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleImageUpload(content.id, e.target.files[0]);
                                }
                              }}
                              disabled={saving || !!imageUploadProgress[content.id]}
                            />
                            <FiImage size={24} />
                            <span>이미지 업로드</span>
                          </ImageUploadLabel>

                          {imageUploadProgress[content.id] !== undefined && (
                            <ProgressContainer>
                              <ProgressBar width={imageUploadProgress[content.id]} />
                              <ProgressText>{Math.round(imageUploadProgress[content.id])}%</ProgressText>
                            </ProgressContainer>
                          )}
                        </>
                      )}
                    </ImageUploadContainer>
                  )}
                </ContentBody>
              </ContentItem>
            ))
          ) : (
            <EmptyContent>
              <p>콘텐츠가 없습니다. 위 버튼을 클릭하여 콘텐츠를 추가해보세요.</p>
            </EmptyContent>
          )}
        </ContentList>
      </FormSection>

      <FormActions>
        <CancelButton onClick={() => navigate('/dashboard')}>취소</CancelButton>
        <SaveButton onClick={handleSaveProfile} disabled={saving}>
          <FiSave />
          <span>{saving ? '저장 중...' : '저장하기'}</span>
        </SaveButton>
      </FormActions>
    </EditorContainer>
  );
};

// 스타일 컴포넌트
const EditorContainer = styled.div`
  padding: 1rem 0;
`;

const EditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const EditorTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-text);
`;

const FormSection = styled.section`
  background-color: var(--color-background);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem;
  color: var(--color-text);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--color-text);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
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

const InputWithPrefix = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const InputPrefix = styled.span`
  padding: 0.75rem;
  background-color: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-right: none;
  border-radius: var(--border-radius) 0 0 var(--border-radius);
  color: var(--color-secondary);
  font-size: 0.875rem;
  white-space: nowrap;
`;

const HelperText = styled.p`
  font-size: 0.75rem;
  color: var(--color-secondary);
  margin: 0.5rem 0 0;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius);
  font-size: 1rem;
  background-color: var(--color-background);
  color: var(--color-text);
  transition: border-color 0.2s;
  min-height: 100px;
  resize: vertical;
  
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

const ContentToolbar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const ToolbarButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: var(--color-background);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius);
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    border-color: var(--color-primary);
  }
  
  svg {
    color: var(--color-primary);
  }
`;

const ContentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ContentItem = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius);
  overflow: hidden;
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: rgba(0, 0, 0, 0.02);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const ContentType = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
`;

const ContentActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover:not(:disabled) {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  &.delete:hover {
    background-color: rgba(239, 68, 68, 0.1);
    color: var(--color-error);
  }
`;

const ContentBody = styled.div`
  padding: 1rem;
`;

const ImageUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ImageUploadLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  border: 2px dashed rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: border-color 0.2s;
  
  &:hover {
    border-color: var(--color-primary);
  }
  
  svg {
    color: var(--color-primary);
  }
  
  span {
    font-size: 0.875rem;
    color: var(--color-text);
  }
`;

const ImageUploadInput = styled.input`
  display: none;
`;

const ImagePreviewContainer = styled.div`
  position: relative;
  border-radius: var(--border-radius);
  overflow: hidden;
`;

const ImagePreview = styled.img`
  display: block;
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: contain;
`;

const ImageActions = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
`;

const ImageActionButton = styled.button`
  background-color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
  }
`;

const ProgressContainer = styled.div`
  position: relative;
  height: 8px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBar = styled.div<{ width: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${props => props.width}%;
  background-color: var(--color-primary);
  transition: width 0.3s;
`;

const ProgressText = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.75rem;
  color: var(--color-text);
  transform: translateY(-100%);
`;

const EmptyContent = styled.div`
  padding: 2rem;
  text-align: center;
  border: 1px dashed rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius);
  color: var(--color-secondary);
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  border: none;
  border-radius: var(--border-radius);
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover:not(:disabled) {
    background-color: var(--color-secondary);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: none;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius);
  color: var(--color-text);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: var(--border-radius);
  color: var(--color-error);
  margin-bottom: 1.5rem;
  
  svg {
    flex-shrink: 0;
  }
`;

const SuccessMessage = styled.div`
  padding: 0.75rem 1rem;
  background-color: rgba(16, 185, 129, 0.1);
  border-radius: var(--border-radius);
  color: var(--color-success);
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

export default ProfileEditor;
