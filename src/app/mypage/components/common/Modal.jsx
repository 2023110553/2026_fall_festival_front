import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, children, style = {} }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      {/* 기본값: 소형 모달 규격 (삭제, 경고, 완료안내, 쿠폰 등) */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          width: '280px',
          maxWidth: 'calc(100vw - 40px)',
          padding: '20px',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'stretch',
          gap: '10px',
          borderRadius: '20px',
          background: '#FFF',
          boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.10)',
          boxSizing: 'border-box',
          color: '#111111',
          fontFamily: 'sans-serif',
          ...style, // 큰 모달이 올 때 덮어씌움
        }}
      >
        {children}
      </div>
    </div>
  );
}