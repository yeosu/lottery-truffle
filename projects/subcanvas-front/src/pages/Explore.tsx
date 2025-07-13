import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { FiSearch, FiGrid, FiList, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';
import type { ProfilePage } from '../types';

// 탐색 카테고리 정의
type Category = 'popular' | 'recent' | 'featured';

interface ExploreFilter {
  category: Category;
  layout: 'grid' | 'list';
  search: string;
}

const Explore: React.FC = () => {
  const [profiles, setProfiles] = useState<ProfilePage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ExploreFilter>({
    category: 'popular',
    layout: 'grid',
    search: '',
  });

  // 프로필 데이터 가져오기
  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        // 실제 구현 시에는 API URL과 파라미터를 적절히 수정해야 함
        const params = new URLSearchParams();
        params.append('category', filter.category);
        if (filter.search) params.append('search', filter.search);
        
        const response = await axios.get('/api/profiles', { params });
        setProfiles(response.data);
        setError(null);
      } catch (err) {
        console.error('프로필을 가져오는 중 오류가 발생했습니다:', err);
        setError('프로필을 불러올 수 없습니다. 나중에 다시 시도해주세요.');
        
        // 개발 중에는 더미 데이터를 사용
        setProfiles([
          {
            id: '1',
            path: 'johndoe',
            title: '존 도우의 포트폴리오',
            description: '웹 개발자 & UI/UX 디자이너',
            theme: 'light',
            owner: {
              id: '101',
              username: 'johndoe',
              email: 'john@example.com'
            },
            contents: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            viewCount: 1245,
          },
          {
            id: '2',
            path: 'janedoe',
            title: '제인 도우의 프로필',
            description: '프론트엔드 개발자 & 일러스트레이터',
            theme: 'dark',
            owner: {
              id: '102',
              username: 'janedoe',
              email: 'jane@example.com'
            },
            contents: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            viewCount: 832,
          },
          {
            id: '3',
            path: 'techguru',
            title: '기술 블로그',
            description: '최신 웹 기술 및 트렌드',
            theme: 'light',
            owner: {
              id: '103',
              username: 'techguru',
              email: 'tech@example.com'
            },
            contents: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            viewCount: 2150,
          },
          {
            id: '4',
            path: 'devninja',
            title: '개발 닌자의 코딩 일지',
            description: 'React와 TypeScript 전문가',
            theme: 'dark',
            owner: {
              id: '104',
              username: 'devninja',
              email: 'ninja@example.com'
            },
            contents: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            viewCount: 1872,
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [filter.category, filter.search]);

  // 검색 제출 핸들러
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.currentTarget as HTMLFormElement).querySelector('input');
    if (input) {
      setFilter(prev => ({ ...prev, search: input.value }));
    }
  };

  // 카테고리 변경 핸들러
  const handleCategoryChange = (category: Category) => {
    setFilter(prev => ({ ...prev, category }));
  };

  // 레이아웃 변경 핸들러
  const handleLayoutChange = (layout: 'grid' | 'list') => {
    setFilter(prev => ({ ...prev, layout }));
  };

  return (
    <ExploreContainer>
      <ExploreHeader>
        <h1>탐색하기</h1>
        <SearchForm onSubmit={handleSearchSubmit}>
          <SearchInput 
            type="text" 
            placeholder="프로필 검색..." 
            defaultValue={filter.search}
          />
          <SearchButton type="submit">
            <FiSearch />
          </SearchButton>
        </SearchForm>
      </ExploreHeader>

      <FilterBar>
        <Categories>
          <CategoryButton 
            active={filter.category === 'popular'} 
            onClick={() => handleCategoryChange('popular')}
          >
            인기
          </CategoryButton>
          <CategoryButton 
            active={filter.category === 'recent'} 
            onClick={() => handleCategoryChange('recent')}
          >
            최신
          </CategoryButton>
          <CategoryButton 
            active={filter.category === 'featured'} 
            onClick={() => handleCategoryChange('featured')}
          >
            추천
          </CategoryButton>
        </Categories>
        <LayoutOptions>
          <LayoutButton 
            active={filter.layout === 'grid'} 
            onClick={() => handleLayoutChange('grid')}
          >
            <FiGrid />
          </LayoutButton>
          <LayoutButton 
            active={filter.layout === 'list'} 
            onClick={() => handleLayoutChange('list')}
          >
            <FiList />
          </LayoutButton>
        </LayoutOptions>
      </FilterBar>

      {loading ? (
        <LoadingState>
          <motion.div 
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p>프로필을 불러오는 중...</p>
        </LoadingState>
      ) : error ? (
        <ErrorState>
          <p>{error}</p>
        </ErrorState>
      ) : (
        <ProfileGrid layout={filter.layout}>
          {profiles.map(profile => (
            <ProfileCard 
              key={profile.id} 
              layout={filter.layout}
              as={motion.div}
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
              transition={{ duration: 0.2 }}
            >
              <Link to={`/p/${profile.path}`}>
                <ProfileCardHeader>
                  <ProfileAvatar>
                    <FiUser size={24} />
                  </ProfileAvatar>
                  <ProfileTitle>{profile.title}</ProfileTitle>
                </ProfileCardHeader>
                <ProfileDescription>{profile.description}</ProfileDescription>
                <ProfileStats>
                  <StatItem>
                    <span>조회수</span>
                    <strong>{profile.viewCount.toLocaleString()}</strong>
                  </StatItem>
                </ProfileStats>
              </Link>
            </ProfileCard>
          ))}
        </ProfileGrid>
      )}

      {!loading && profiles.length === 0 && !error && (
        <NoResults>
          <p>검색 결과가 없습니다.</p>
        </NoResults>
      )}
    </ExploreContainer>
  );
};

// 스타일 컴포넌트
const ExploreContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const ExploreHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;

    h1 {
      margin-bottom: 1rem;
    }
  }
`;

const SearchForm = styled.form`
  display: flex;
  max-width: 400px;
  width: 100%;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius) 0 0 var(--border-radius);
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: var(--color-primary);
  }
`;

const SearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 1rem;
`;

const Categories = styled.div`
  display: flex;
  gap: 1rem;
`;

const CategoryButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  background-color: ${props => props.active ? 'var(--color-primary)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--color-text)'};
  border: ${props => props.active ? 'none' : '1px solid var(--color-border)'};
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: ${props => props.active ? 'var(--color-primary)' : 'var(--color-background-alt)'};
  }
`;

const LayoutOptions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const LayoutButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background-color: ${props => props.active ? 'var(--color-primary)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--color-text)'};
  border: ${props => props.active ? 'none' : '1px solid var(--color-border)'};
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: ${props => props.active ? 'var(--color-primary)' : 'var(--color-background-alt)'};
  }
`;

const ProfileGrid = styled.div<{ layout: 'grid' | 'list' }>`
  display: grid;
  grid-template-columns: ${props => props.layout === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr'};
  gap: 1.5rem;
`;

const ProfileCard = styled.div<{ layout: 'grid' | 'list' }>`
  background-color: var(--color-card-background);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  transition: transform 0.3s, box-shadow 0.3s;

  a {
    display: block;
    padding: ${props => props.layout === 'grid' ? '1.5rem' : '1rem 1.5rem'};
    color: inherit;
    text-decoration: none;
  }

  ${props => props.layout === 'list' && `
    display: flex;
    flex-direction: column;

    a {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
  `}
`;

const ProfileCardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const ProfileAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-background-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
`;

const ProfileTitle = styled.h3`
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--color-text);
  margin: 0;
`;

const ProfileDescription = styled.p`
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const ProfileStats = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;

  span {
    color: var(--color-text-secondary);
  }

  strong {
    color: var(--color-text);
  }
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: var(--color-text-secondary);

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--color-background-alt);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    margin-bottom: 1rem;
  }
`;

const ErrorState = styled.div`
  padding: 2rem;
  text-align: center;
  background-color: var(--color-error-bg);
  color: var(--color-error);
  border-radius: var(--border-radius);
`;

const NoResults = styled.div`
  padding: 3rem 0;
  text-align: center;
  color: var(--color-text-secondary);
`;

export default Explore;
