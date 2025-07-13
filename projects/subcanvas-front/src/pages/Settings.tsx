import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { FiSave, FiUser, FiMail, FiLock, FiGlobe, FiMoon, FiSun, FiShield, FiUpload } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 사용자 정보 타입 정의
interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  bio?: string;
  avatar?: string;
}

// 사용자 설정 타입 정의
interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  pushNotifications: boolean;
  twoFactorEnabled: boolean;
  language: string;
}

// 프로필 설정 폼 스키마
const profileSchema = z.object({
  name: z.string().optional(),
  username: z.string().min(3, '사용자명은 최소 3자 이상이어야 합니다'),
  email: z.string().email('유효한 이메일 주소를 입력하세요'),
  bio: z.string().max(160, '자기소개는 최대 160자까지 입력 가능합니다').optional(),
});

// 비밀번호 변경 폼 스키마
const passwordSchema = z.object({
  currentPassword: z.string().min(1, '현재 비밀번호를 입력하세요'),
  newPassword: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다'),
  confirmPassword: z.string().min(8, '비밀번호 확인을 입력하세요'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: '새 비밀번호와 비밀번호 확인이 일치하지 않습니다',
  path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

// 설정 탭 타입
type SettingsTab = 'profile' | 'account' | 'appearance' | 'security';

const Settings: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'system',
    emailNotifications: true,
    pushNotifications: true,
    twoFactorEnabled: false,
    language: 'ko',
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // 프로필 폼
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors, isDirty: profileIsDirty },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  // 비밀번호 폼
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // 사용자 정보와 설정 불러오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 실제 구현에서는 API 호출이 필요합니다
        // const response = await userService.getUserProfile();
        // setUser(response.data);
        
        // 개발을 위한 더미 데이터
        setUser({
          id: '1',
          username: 'yeosu',
          email: 'yeosu@example.com',
          name: '김유저',
          bio: 'SubCanvas 웹사이트를 이용하고 있습니다.',
        });
        
        // 사용자 설정 불러오기
        // const settingsResponse = await userService.getUserSettings();
        // setSettings(settingsResponse.data);

        // 더미 설정 데이터로 폼 초기화
        resetProfile({
          name: '김유저',
          username: 'yeosu',
          email: 'yeosu@example.com',
          bio: 'SubCanvas 웹사이트를 이용하고 있습니다.',
        });
      } catch (error) {
        console.error('사용자 정보를 불러오는 중 오류 발생:', error);
        setErrorMessage('사용자 정보를 불러오지 못했습니다. 나중에 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [resetProfile]);

  // 프로필 저장
  const saveProfile = async (data: ProfileFormData) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    
    try {
      // 실제 구현에서는 API 호출이 필요합니다
      // await userService.updateProfile(data);
      
      // API 호출 대신 비동기 작업 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 사용자 정보 업데이트
      setUser(prev => prev ? { ...prev, ...data } : null);
      setSuccessMessage('프로필 정보가 성공적으로 업데이트되었습니다.');
      
      console.log('프로필 업데이트:', data);
    } catch (error) {
      console.error('프로필 업데이트 중 오류 발생:', error);
      setErrorMessage('프로필을 업데이트하지 못했습니다. 나중에 다시 시도해주세요.');
    }
  };

  // 비밀번호 변경
  const changePassword = async (formData: PasswordFormData) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    
    try {
      // 실제 구현에서는 API 호출이 필요합니다
      // await userService.changePassword(formData);
      
      // API 호출 대신 비동기 작업 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage('비밀번호가 성공적으로 변경되었습니다.');
      resetPassword();
      
      console.log('비밀번호 변경 요청', formData.currentPassword ? '(입력됨)' : '(미입력)');
    } catch (error) {
      console.error('비밀번호 변경 중 오류 발생:', error);
      setErrorMessage('비밀번호를 변경하지 못했습니다. 현재 비밀번호가 올바른지 확인하세요.');
    }
  };

  // 알림 설정 변경
  const toggleNotificationSetting = (type: 'emailNotifications' | 'pushNotifications') => {
    setSettings(prev => {
      const newSettings = { 
        ...prev, 
        [type]: !prev[type] 
      };
      
      // 실제 구현에서는 API 호출이 필요합니다
      // userService.updateSettings(newSettings);
      
      return newSettings;
    });
  };

  // 테마 변경
  const changeTheme = (theme: 'light' | 'dark' | 'system') => {
    setSettings(prev => {
      const newSettings = { 
        ...prev, 
        theme 
      };
      
      // 실제 구현에서는 API 호출이 필요합니다
      // userService.updateSettings(newSettings);
      
      // 테마 설정 적용
      // themeService.applyTheme(theme);
      
      return newSettings;
    });
  };
  
  // 언어 변경
  const changeLanguage = (language: string) => {
    setSettings(prev => {
      const newSettings = { 
        ...prev, 
        language 
      };
      
      // 실제 구현에서는 API 호출이 필요합니다
      // userService.updateSettings(newSettings);
      
      return newSettings;
    });
  };
  
  // 2단계 인증 설정 변경
  const toggle2FA = () => {
    setSettings(prev => {
      const newSettings = { 
        ...prev, 
        twoFactorEnabled: !prev.twoFactorEnabled 
      };
      
      // 실제 구현에서는 API 호출이 필요합니다
      // userService.update2FASettings(newSettings.twoFactorEnabled);
      
      return newSettings;
    });
  };
  
  // 아바타 업로드 처리
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // 실제 구현에서는 API를 통해 이미지 업로드 필요
      // const formData = new FormData();
      // formData.append('avatar', file);
      // userService.uploadAvatar(formData);
    }
  };

  // 로딩 상태일 때 표시할 UI
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>설정을 불러오는 중...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <SettingsContainer>
      <SettingsHeader>
        <SettingsTitle>계정 설정</SettingsTitle>
        <SettingsDescription>
          프로필 정보를 관리하고 계정 설정을 업데이트하세요.
        </SettingsDescription>
      </SettingsHeader>

      {/* 알림 메시지 */}
      {successMessage && <SuccessAlert>{successMessage}</SuccessAlert>}
      {errorMessage && <ErrorAlert>{errorMessage}</ErrorAlert>}

      <SettingsContent>
        {/* 설정 탭 메뉴 */}
        <SettingsTabs>
          <SettingsTab
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
          >
            <FiUser /> 프로필
          </SettingsTab>
          <SettingsTab
            active={activeTab === 'account'}
            onClick={() => setActiveTab('account')}
          >
            <FiMail /> 계정
          </SettingsTab>
          <SettingsTab
            active={activeTab === 'appearance'}
            onClick={() => setActiveTab('appearance')}
          >
            <FiSun /> 테마
          </SettingsTab>
          <SettingsTab
            active={activeTab === 'security'}
            onClick={() => setActiveTab('security')}
          >
            <FiShield /> 보안
          </SettingsTab>
        </SettingsTabs>

        {/* 탭 내용 */}
        <SettingsTabContent>
          {/* 프로필 설정 */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SettingsSectionTitle>프로필 정보</SettingsSectionTitle>

              {/* 프로필 이미지 */}
              <ProfileImageSection>
                <AvatarContainer>
                  {avatarPreview || user?.avatar ? (
                    <AvatarImage src={avatarPreview || user?.avatar || ''} alt="프로필 이미지" />
                  ) : (
                    <AvatarPlaceholder>
                      {user?.name?.charAt(0) || user?.username?.charAt(0) || '?'}
                    </AvatarPlaceholder>
                  )}
                </AvatarContainer>
                <AvatarUploadButton>
                  <FiUpload /> 이미지 변경
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    style={{ display: 'none' }}
                  />
                </AvatarUploadButton>
              </ProfileImageSection>

              {/* 프로필 폼 */}
              <Form onSubmit={handleSubmitProfile(saveProfile)}>
                <FormGroup>
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="실명 또는 별명"
                    {...registerProfile('name')}
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="username">사용자명</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="사용자명"
                    {...registerProfile('username')}
                    error={!!profileErrors.username}
                  />
                  {profileErrors.username && (
                    <ErrorMessage>{profileErrors.username.message}</ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="이메일 주소"
                    {...registerProfile('email')}
                    error={!!profileErrors.email}
                  />
                  {profileErrors.email && (
                    <ErrorMessage>{profileErrors.email.message}</ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="bio">자기소개</Label>
                  <Textarea
                    id="bio"
                    placeholder="자기소개를 입력하세요 (최대 160자)"
                    {...registerProfile('bio')}
                    error={!!profileErrors.bio}
                  />
                  {profileErrors.bio && (
                    <ErrorMessage>{profileErrors.bio.message}</ErrorMessage>
                  )}
                </FormGroup>

                <Button type="submit" disabled={!profileIsDirty}>
                  <FiSave /> 프로필 저장
                </Button>
              </Form>
            </motion.div>
          )}

          {/* 계정 설정 */}
          {activeTab === 'account' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SettingsSectionTitle>계정 설정</SettingsSectionTitle>

              <SettingsSectionTitle>비밀번호 변경</SettingsSectionTitle>
              <Form onSubmit={handleSubmitPassword(changePassword)}>
                <FormGroup>
                  <Label htmlFor="currentPassword">현재 비밀번호</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="현재 비밀번호"
                    {...registerPassword('currentPassword')}
                    error={!!passwordErrors.currentPassword}
                  />
                  {passwordErrors.currentPassword && (
                    <ErrorMessage>{passwordErrors.currentPassword.message}</ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="newPassword">새 비밀번호</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="새 비밀번호"
                    {...registerPassword('newPassword')}
                    error={!!passwordErrors.newPassword}
                  />
                  {passwordErrors.newPassword && (
                    <ErrorMessage>{passwordErrors.newPassword.message}</ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="비밀번호 확인"
                    {...registerPassword('confirmPassword')}
                    error={!!passwordErrors.confirmPassword}
                  />
                  {passwordErrors.confirmPassword && (
                    <ErrorMessage>{passwordErrors.confirmPassword.message}</ErrorMessage>
                  )}
                </FormGroup>

                <Button type="submit">
                  <FiLock /> 비밀번호 변경
                </Button>
              </Form>
            </motion.div>
          )}

          {/* 테마 설정 */}
          {activeTab === 'appearance' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SettingsSectionTitle>테마 설정</SettingsSectionTitle>
              <ThemeSelection>
                <ThemeOption 
                  active={settings.theme === 'light'}
                  onClick={() => changeTheme('light')}
                >
                  <FiSun className="theme-icon" />
                  <div className="theme-info">
                    <h4>라이트 모드</h4>
                    <p>밝은 테마 사용</p>
                  </div>
                </ThemeOption>
                
                <ThemeOption 
                  active={settings.theme === 'dark'}
                  onClick={() => changeTheme('dark')}
                >
                  <FiMoon className="theme-icon" />
                  <div className="theme-info">
                    <h4>다크 모드</h4>
                    <p>어두운 테마 사용</p>
                  </div>
                </ThemeOption>
                
                <ThemeOption 
                  active={settings.theme === 'system'}
                  onClick={() => changeTheme('system')}
                >
                  <FiGlobe className="theme-icon" />
                  <div className="theme-info">
                    <h4>시스템 설정</h4>
                    <p>기기의 테마 설정을 따름</p>
                  </div>
                </ThemeOption>
              </ThemeSelection>

              <SettingsSectionTitle>언어 설정</SettingsSectionTitle>
              <LanguageSelection>
                <LanguageOption 
                  active={settings.language === 'ko'}
                  onClick={() => changeLanguage('ko')}
                >
                  한국어
                </LanguageOption>
                <LanguageOption 
                  active={settings.language === 'en'}
                  onClick={() => changeLanguage('en')}
                >
                  English
                </LanguageOption>
                <LanguageOption 
                  active={settings.language === 'ja'}
                  onClick={() => changeLanguage('ja')}
                >
                  日本語
                </LanguageOption>
              </LanguageSelection>
            </motion.div>
          )}

          {/* 보안 설정 */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SettingsSectionTitle>보안 설정</SettingsSectionTitle>
              
              <SettingsCard>
                <SettingsCardHeader>
                  <div>
                    <SettingsCardTitle>2단계 인증</SettingsCardTitle>
                    <SettingsCardDescription>
                      계정에 로그인할 때 추가 인증 단계를 요구하여 보안을 강화합니다.
                    </SettingsCardDescription>
                  </div>
                  <Toggle 
                    checked={settings.twoFactorEnabled}
                    onChange={toggle2FA}
                  />
                </SettingsCardHeader>
              </SettingsCard>

              <SettingsSectionTitle>알림 설정</SettingsSectionTitle>
              
              <SettingsCard>
                <SettingsCardHeader>
                  <div>
                    <SettingsCardTitle>이메일 알림</SettingsCardTitle>
                    <SettingsCardDescription>
                      댓글, 메시지, 팔로워 등의 활동 알림을 이메일로 수신합니다.
                    </SettingsCardDescription>
                  </div>
                  <Toggle 
                    checked={settings.emailNotifications}
                    onChange={() => toggleNotificationSetting('emailNotifications')}
                  />
                </SettingsCardHeader>
              </SettingsCard>
              
              <SettingsCard>
                <SettingsCardHeader>
                  <div>
                    <SettingsCardTitle>푸시 알림</SettingsCardTitle>
                    <SettingsCardDescription>
                      앱 사용 중 중요 이벤트에 대한 푸시 알림을 활성화합니다.
                    </SettingsCardDescription>
                  </div>
                  <Toggle 
                    checked={settings.pushNotifications}
                    onChange={() => toggleNotificationSetting('pushNotifications')}
                  />
                </SettingsCardHeader>
              </SettingsCard>
            </motion.div>
          )}
        </SettingsTabContent>
      </SettingsContent>
    </SettingsContainer>
  );
};

// 스타일 컴포넌트
const SettingsContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const SettingsHeader = styled.div`
  margin-bottom: 2rem;
`;

const SettingsTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text);
`;

const SettingsDescription = styled.p`
  color: var(--color-text-secondary);
  font-size: 1rem;
`;

const SettingsContent = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SettingsTabs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--color-border);
  }
`;

const SettingsTab = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  background-color: ${props => props.active ? 'var(--color-primary-light)' : 'transparent'};
  color: ${props => props.active ? 'var(--color-primary)' : 'var(--color-text-secondary)'};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  border: none;
  text-align: left;
  transition: background-color 0.2s, color 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--color-primary-light)' : 'var(--color-background-alt)'};
    color: ${props => props.active ? 'var(--color-primary)' : 'var(--color-text)'};
  }
  
  @media (max-width: 768px) {
    white-space: nowrap;
  }
`;

const SettingsTabContent = styled.div`
  background-color: var(--color-card-background);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
`;

const SettingsSectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.5rem 0 1rem;
  color: var(--color-text);
  
  &:first-of-type {
    margin-top: 0;
  }
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
  font-weight: 500;
  color: var(--color-text);
  font-size: 0.9rem;
`;

const Input = styled.input<{ error?: boolean }>`
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.error ? 'var(--color-error)' : 'var(--color-border)'};
  border-radius: var(--border-radius);
  background-color: var(--color-input-background);
  color: var(--color-text);
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
  }
`;

const Textarea = styled.textarea<{ error?: boolean }>`
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.error ? 'var(--color-error)' : 'var(--color-border)'};
  border-radius: var(--border-radius);
  background-color: var(--color-input-background);
  color: var(--color-text);
  font-size: 0.9rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  font-weight: 600;
  border-radius: var(--border-radius);
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  align-self: flex-start;
  
  &:hover {
    background-color: var(--color-primary-dark);
  }
  
  &:disabled {
    background-color: var(--color-disabled);
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  color: var(--color-error);
  font-size: 0.8rem;
`;

const SuccessAlert = styled.div`
  padding: 1rem;
  background-color: var(--color-success-bg);
  color: var(--color-success);
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const ErrorAlert = styled.div`
  padding: 1rem;
  background-color: var(--color-error-bg);
  color: var(--color-error);
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const ProfileImageSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const AvatarContainer = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--color-background-alt);
  box-shadow: var(--shadow-sm);
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  background-color: var(--color-background-alt);
`;

const AvatarUploadButton = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-background-alt);
  color: var(--color-text);
  font-size: 0.9rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  
  &:hover {
    background-color: var(--color-border);
  }
`;

const ThemeSelection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ThemeOption = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: var(--border-radius);
  background-color: ${props => props.active ? 'var(--color-primary-light)' : 'var(--color-background-alt)'};
  border: 1px solid ${props => props.active ? 'var(--color-primary)' : 'var(--color-border)'};
  cursor: pointer;
  text-align: left;
  width: 100%;
  
  .theme-icon {
    font-size: 1.5rem;
    color: ${props => props.active ? 'var(--color-primary)' : 'var(--color-text-secondary)'};
  }
  
  .theme-info h4 {
    font-weight: 500;
    margin: 0 0 0.25rem;
    color: var(--color-text);
  }
  
  .theme-info p {
    font-size: 0.85rem;
    margin: 0;
    color: var(--color-text-secondary);
  }
  
  &:hover {
    background-color: ${props => props.active ? 'var(--color-primary-light)' : 'var(--color-background)'};
  }
`;

const LanguageSelection = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

const LanguageOption = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  background-color: ${props => props.active ? 'var(--color-primary)' : 'var(--color-background-alt)'};
  color: ${props => props.active ? 'white' : 'var(--color-text)'};
  border: 1px solid ${props => props.active ? 'var(--color-primary)' : 'var(--color-border)'};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--color-primary-dark)' : 'var(--color-background)'};
  }
`;

const SettingsCard = styled.div`
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: var(--color-background-alt);
`;

const SettingsCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SettingsCardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 0.25rem;
  color: var(--color-text);
`;

const SettingsCardDescription = styled.p`
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin: 0;
`;

interface ToggleProps {
  checked?: boolean;
}

const Toggle = styled('input')<ToggleProps>(({ checked }) => ({
  appearance: 'none',
  position: 'relative',
  width: '3.5rem',
  height: '1.8rem',
  borderRadius: '1rem',
  backgroundColor: checked ? 'var(--color-primary)' : 'var(--color-border)',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: checked ? 'calc(100% - 1.6rem)' : '0.2rem',
    top: '0.2rem',
    width: '1.4rem',
    height: '1.4rem',
    borderRadius: '50%',
    backgroundColor: 'white',
    transition: 'left 0.3s',
  },
  type: 'checkbox'
}));

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 40vh;
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  color: var(--color-text-secondary);
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default Settings;
