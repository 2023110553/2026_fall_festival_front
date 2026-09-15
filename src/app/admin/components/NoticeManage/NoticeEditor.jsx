import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import * as S from './NoticeEditor.styles'
import ConfirmLeaveModal from './ConfirmLeaveModal'

const TOAST_DURATION = 2500

function useAutoGrow(value) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])
  return ref
}

export default function NoticeEditor({
  typeSlot,
  initialTitle = '',
  initialContent = '',
  initialImageUrl = '',
  submitLabel,
  toastMessage,
  continueLabel,
  onSubmit,
  onLeave,
}) {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(initialImageUrl ?? '')
  const [isLeaveOpen, setIsLeaveOpen] = useState(false)
  const [isToastVisible, setIsToastVisible] = useState(false)

  const titleRef = useAutoGrow(title)
  const contentRef = useAutoGrow(content)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!imageFile) return
    const url = URL.createObjectURL(imageFile)
    setImagePreview(url)
    return () => URL.revokeObjectURL(url)
  }, [imageFile])

  useEffect(() => {
    if (!isToastVisible) return
    const timer = setTimeout(() => setIsToastVisible(false), TOAST_DURATION)
    return () => clearTimeout(timer)
  }, [isToastVisible])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setImageFile(file)
    e.target.value = ''
  }

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      setIsToastVisible(true)
      return
    }
    onSubmit({ title, content, imageFile })
  }

  return (
    <S.Page>
      <S.Container>
        <S.Header>
          <S.BackButton type="button" aria-label="뒤로가기" onClick={() => setIsLeaveOpen(true)}>
            <svg width="12" height="22" viewBox="0 0 12 22" fill="none" aria-hidden="true">
              <path d="M11 1L1 11L11 21" stroke="#000" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </S.BackButton>
          <S.HeaderTitle>공지 관리</S.HeaderTitle>
        </S.Header>

        <S.TitleRow>
          {typeSlot}
          <S.TitleInput
            ref={titleRef}
            rows={1}
            value={title}
            placeholder="제목을 입력하세요..."
            onChange={(e) => setTitle(e.target.value)}
          />
        </S.TitleRow>
        <S.ContentCard>
          <S.ImageArea $empty={!imagePreview}>
            {imagePreview && <S.Image src={imagePreview} alt="" />}
            <S.ImageButton type="button" onClick={() => fileInputRef.current?.click()}>
              {imagePreview ? '사진 수정' : '사진 등록'}
            </S.ImageButton>
          </S.ImageArea>
          <S.HiddenFileInput ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} />
          <S.ContentInput
            ref={contentRef}
            rows={1}
            value={content}
            placeholder="내용을 입력하세요..."
            onChange={(e) => setContent(e.target.value)}
          />
        </S.ContentCard>

        {isToastVisible && (
          <S.Toast role="alert">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M8 1.5a4 4 0 0 0-4 4v3L2.5 11h11L12 8.5v-3a4 4 0 0 0-4-4Z"
                stroke="#000"
                strokeLinejoin="round"
              />
              <path d="M6.5 13a1.5 1.5 0 0 0 3 0" stroke="#000" strokeLinecap="round" />
            </svg>
            {toastMessage}
          </S.Toast>
        )}
        <S.BottomBar>
          <S.PrimaryButton type="button" onClick={handleSubmit}>
            {submitLabel}
          </S.PrimaryButton>
        </S.BottomBar>
      </S.Container>

      <ConfirmLeaveModal
        isOpen={isLeaveOpen}
        continueLabel={continueLabel}
        onClose={() => setIsLeaveOpen(false)}
        onConfirm={onLeave}
      />
    </S.Page>
  )
}
