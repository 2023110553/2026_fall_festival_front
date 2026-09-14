import { useState, useEffect, useRef } from 'react';
import Modal from '../common/Modal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import EmptyState from '../../../../components/common/EmptyState';

const largeModalStyle = {
  display: 'flex',
  width: '305px',
  padding: '28px 16px 16px 16px',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '16px',
  borderRadius: '12px',
  background: '#FFF',
  boxShadow:
    '0 3px 6px 0 rgba(255, 161, 161, 0.25), 0 -4px 6px 0 rgba(194, 255, 175, 0.25), 0 0 6px 0 rgba(243, 246, 188, 0.75)',
};

export default function MyLanternList({ isOpen, onClose, lanterns = [], onDelete, onEdit }) {
  const [deletingId, setDeletingId] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null); // 현재 드롭다운 메뉴가 열린 등불 ID
  const menuRef = useRef(null);

  // 드롭다운 바깥 영역 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    if (activeMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenuId]);

  // 점세개 버튼 클릭 토글
  const handleToggleMenu = (id, e) => {
    e.stopPropagation();
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  // 수정하기 클릭
  const handleEditClick = (id, e) => {
    e.stopPropagation();
    setActiveMenuId(null);
    if (onEdit) onEdit(id);
  };

  // 삭제하기 클릭
  const handleDeleteClick = (id, e) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setDeletingId(id);
  };

  const handleConfirmDelete = () => {
    if (deletingId && onDelete) {
      onDelete(deletingId);
    }
    setDeletingId(null);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} style={largeModalStyle}>
        {/* Header */}
        <div style={{ textAlign: 'left', width: '100%', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#111' }}>
            나의 등불({lanterns.length}/3)
          </h2>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '3px', margin: 0, fontWeight: '500' }}>
            오늘 남긴 등불 확인하기
          </p>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          {lanterns.length === 0 ? (
            <EmptyState>등불이 아직 없습니다.</EmptyState>
          ) : (
            lanterns.map((l) => {
              // 1. 관리자에 의해 삭제된 등불
              if (l.status === 'DELETED_BY_ADMIN') {
                return (
                  <div
                    key={l.id}
                    style={{
                      backgroundColor: '#593838',
                      borderRadius: '16px',
                      padding: '10px 14px',
                      textAlign: 'left',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#BDBDBD' }}>
                      {l.nickname || '익명의 코끼리'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#8E6E6E', marginTop: '3px', lineHeight: '1.3' }}>
                      관리자에 의해 삭제된 댓글입니다.
                    </div>
                    <div style={{ fontSize: '10px', color: '#735252', marginTop: '5px' }}>
                      {l.createdAt}
                    </div>
                  </div>
                );
              }

              // 2. 사용자가 직접 삭제한 등불
              if (l.isDeleted || l.status === 'DELETED_BY_USER') {
                return (
                  <div
                    key={l.id}
                    style={{
                      backgroundColor: '#828282',
                      borderRadius: '16px',
                      padding: '10px 14px',
                      textAlign: 'left',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#E0E0E0' }}>
                      {l.nickname || '익명의 코끼리'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#C4C4C4', marginTop: '3px', lineHeight: '1.3' }}>
                      삭제한 댓글입니다
                    </div>
                    <div style={{ fontSize: '10px', color: '#B0B0B0', marginTop: '5px' }}>
                      {l.createdAt}
                    </div>
                  </div>
                );
              }

              // 3. 정상 활성 등불 (점 세개 메뉴 포함)
              return (
                <div
                  key={l.id}
                  style={{
                    backgroundColor: '#EBEBEB',
                    borderRadius: '16px',
                    padding: '10px 14px',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    width: '100%',
                    boxSizing: 'border-box',
                    position: 'relative', // 팝오버 메뉴 위치 기준
                  }}
                >
                  <div style={{ flex: 1, paddingRight: '12px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#222' }}>
                      {l.nickname || '익명의 코끼리'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#444', marginTop: '3px', lineHeight: '1.3' }}>
                      {l.message || l.content}
                    </div>
                    <div style={{ fontSize: '10px', color: '#AAA', marginTop: '5px' }}>
                      {l.createdAt}
                    </div>
                  </div>

                  {/* 점 세개 버튼 */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleMenu(l.id, e)}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: '#777',
                      fontSize: '16px',
                      cursor: 'pointer',
                      padding: '0 4px',
                      lineHeight: '1',
                    }}
                  >
                    ⋮
                  </button>

                  {/* 수정/삭제 드롭다운 메뉴 (시안 디자인 반영) */}
                  {activeMenuId === l.id && (
                    <div
                      ref={menuRef}
                      style={{
                        position: 'absolute',
                        top: '28px',
                        right: '10px',
                        backgroundColor: '#FFF',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        border: '1px solid #EFEFEF',
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 10,
                        width: '95px',
                        overflow: 'hidden',
                      }}
                    >
                      <button
                        type="button"
                        onClick={(e) => handleEditClick(l.id, e)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 12px',
                          border: 'none',
                          background: 'none',
                          fontSize: '12px',
                          color: '#333',
                          cursor: 'pointer',
                          textAlign: 'left',
                          borderBottom: '1px solid #F0F0F0',
                        }}
                      >
                        수정하기
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteClick(l.id, e)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 12px',
                          border: 'none',
                          background: 'none',
                          fontSize: '12px',
                          color: '#333',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        삭제하기
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', width: '100%', textAlign: 'left', marginTop: '10px' }}>
          <span style={{ fontSize: '10px', color: '#AAA', border: '1px solid #AAA', borderRadius: '50%', width: '12px', height: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
            i
          </span>
          <p style={{ fontSize: '9.5px', color: '#AAA', lineHeight: '1.3', margin: 0 }}>
            등불은 하루 최대 3개까지 달 수 있어요. 삭제한 등불도 횟수에 포함돼요.
            <br />
            쿠폰은 발급 당일에만 사용 가능합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            marginTop: '12px',
            padding: '11px',
            backgroundColor: '#E5E5E5',
            border: 'none',
            borderRadius: '14px',
            fontWeight: 'bold',
            fontSize: '13px',
            color: '#333',
            cursor: 'pointer',
          }}
        >
          닫기
        </button>
      </Modal>

      {/* 2차 삭제 확인 모달 */}
      <ConfirmDeleteModal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}