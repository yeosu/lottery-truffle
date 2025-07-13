import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import styled from '@emotion/styled';
import { FiDownload, FiShare2 } from 'react-icons/fi';

interface ProfileQRCodeProps {
  profileUrl: string;
  size?: number;
  includeMargin?: boolean;
  bgColor?: string;
  fgColor?: string;
}

const ProfileQRCode: React.FC<ProfileQRCodeProps> = ({ 
  profileUrl, 
  size = 200, 
  includeMargin = true,
  bgColor = '#ffffff',
  fgColor = '#000000'
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const qrRef = useRef<SVGSVGElement>(null);

  // QR코드 이미지 다운로드 처리
  const handleDownload = () => {
    if (!qrRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // SVG를 Canvas에 그리기 위한 데이터 URL 생성
    const data = new XMLSerializer().serializeToString(qrRef.current);
    const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    // 이미지 객체 생성 후 로드
    const img = new Image();
    img.onload = () => {
      // Canvas에 이미지 그리기
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      
      // 이미지 다운로드
      const downloadLink = document.createElement('a');
      downloadLink.href = canvas.toDataURL('image/png');
      downloadLink.download = `subcanvas-profile-qr-${new Date().getTime()}.png`;
      downloadLink.click();
      
      // 메모리 정리
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  // 웹 공유 API 사용 (모바일에서 주로 작동)
  const handleShare = async () => {
    if (!navigator.share) {
      alert('공유 기능을 지원하지 않는 브라우저입니다.');
      return;
    }

    try {
      setIsSharing(true);
      
      // Canvas로 QR 코드 이미지 생성
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx || !qrRef.current) return;

      const data = new XMLSerializer().serializeToString(qrRef.current);
      const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = async () => {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        
        // 이미지 파일 생성
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          
          const files = [new File([blob], 'subcanvas-profile-qr.png', { type: 'image/png' })];
          
          // 공유 API 호출
          try {
            await navigator.share({
              title: 'SubCanvas 프로필',
              text: '내 SubCanvas 프로필을 확인해보세요!',
              url: profileUrl,
              files
            });
          } catch (err) {
            console.error('공유 실패:', err);
            
            // 파일 공유가 지원되지 않는 경우, URL만 공유 시도
            try {
              await navigator.share({
                title: 'SubCanvas 프로필',
                text: '내 SubCanvas 프로필을 확인해보세요!',
                url: profileUrl
              });
            } catch (shareErr) {
              console.error('URL 공유 실패:', shareErr);
              alert('공유하는 중 오류가 발생했습니다.');
            }
          } finally {
            URL.revokeObjectURL(url);
          }
        }, 'image/png');
      };
      img.src = url;
    } catch (err) {
      console.error('공유 처리 중 오류:', err);
      alert('공유 준비 중 오류가 발생했습니다.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <QRCodeContainer>
      <QRCodeWrapper>
        <QRCodeSVG
          ref={qrRef}
          value={profileUrl}
          size={size}
          includeMargin={includeMargin}
          bgColor={bgColor}
          fgColor={fgColor}
          level="H"
          imageSettings={{
            src: '/logo-small.png',
            x: undefined,
            y: undefined,
            height: 24,
            width: 24,
            excavate: true,
          }}
        />
      </QRCodeWrapper>
      <QRCodeButtons>
        <IconButton onClick={handleDownload} title="QR코드 저장">
          <FiDownload size={20} />
          <span>저장하기</span>
        </IconButton>
        <IconButton onClick={handleShare} disabled={isSharing} title="QR코드 공유">
          <FiShare2 size={20} />
          <span>공유하기</span>
        </IconButton>
      </QRCodeButtons>
      <QRCodeUrl>{profileUrl}</QRCodeUrl>
    </QRCodeContainer>
  );
};

const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const QRCodeWrapper = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const QRCodeButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const IconButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #3f51b5;
  color: white;
  border: none;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #303f9f;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const QRCodeUrl = styled.div`
  font-size: 0.875rem;
  color: #333;
  word-break: break-all;
  text-align: center;
  max-width: 100%;
`;

export default ProfileQRCode;
