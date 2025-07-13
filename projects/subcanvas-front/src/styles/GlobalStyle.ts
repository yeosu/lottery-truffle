import { createGlobalStyle } from 'styled-components';
import { ThemeConfig } from '../types';

interface GlobalStyleProps {
  theme: ThemeConfig;
}

const GlobalStyle = createGlobalStyle<GlobalStyleProps>`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Pretendard:wght@300;400;500;700&family=Rajdhani:wght@400;500;700&family=Orbitron:wght@400;500;700&family=Noto+Serif+KR:wght@400;500;700&family=Ma+Shan+Zheng&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+JP:wght@400;500;700&family=Mountains+of+Christmas:wght@400;700&family=IBM+Plex+Sans:wght@400;500;700&family=VT323&family=Press+Start+2P&family=Montserrat:wght@400;500;700&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: ${({ theme }) => theme.fontFamily};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    transition: all 0.3s ease;
    line-height: 1.6;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  button, input, select, textarea {
    font-family: ${({ theme }) => theme.fontFamily};
  }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: 0.5rem;
    font-weight: 700;
    line-height: 1.2;
  }

  p {
    margin-bottom: 1rem;
  }

  img {
    max-width: 100%;
    height: auto;
  }
`;

export default GlobalStyle;
