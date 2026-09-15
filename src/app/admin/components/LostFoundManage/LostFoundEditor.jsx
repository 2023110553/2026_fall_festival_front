import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import * as S from './LostFoundEditor.styles'
import ConfirmLeaveModal from '../NoticeManage/ConfirmLeaveModal'
import { LOST_FOUND_DATES } from './mockLostFound'

const TOAST_DURATION = 2500

export default function LostFoundEditor({
  initialDate,
  initialTitle = '',
  initialImageUrl = '',
  initialKeywords = [],
  submitLabel,
  continueLabel,
  leaveDescription,
  onSubmit,
  onLeave,
}) {
  const [date, setDate] = useState(LOST_FOUND_DATES.includes(initialDate) ? initialDate : LOST_FOUND_DATES[0])
  const [title, setTitle] = useState(initialTitle)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(initialImageUrl ?? '')
  const [keywords, setKeywords] = useState(initialKeywords)
  const [isAddingKeyword, setIsAddingKeyword] = useState(false)
  const [keywordDraft, setKeywordDraft] = useState('')
  const [isLeaveOpen, setIsLeaveOpen] = useState(false)
  const [isToastVisible, setIsToastVisible] = useState(false)

  const titleRef = useRef(null)
  const fileInputRef = useRef(null)

  useLayoutEffect(() => {
    const el = titleRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [title])

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

  const commitKeyword = () => {
    const keyword = keywordDraft.trim().replace(/^#+/, '')
    if (keyword && !keywords.includes(keyword)) setKeywords((prev) => [...prev, keyword])
    setKeywordDraft('')
    setIsAddingKeyword(false)
  }

  const handleKeywordKeyDown = (e) => {
    if (e.nativeEvent.isComposing) return
    if (e.key === 'Enter') {
      e.preventDefault()
      commitKeyword()
    } else if (e.key === 'Escape') {
      setKeywordDraft('')
      setIsAddingKeyword(false)
    }
  }

  const handleSubmit = () => {
    // 키워드 입력 중에 저장을 누르면 blur 커밋이 아직 반영 전이므로 작성 중인 값도 포함한다
    const draft = keywordDraft.trim().replace(/^#+/, '')
    const finalKeywords = draft && !keywords.includes(draft) ? [...keywords, draft] : keywords
    if (!title.trim() || finalKeywords.length === 0) {
      setIsToastVisible(true)
      return
    }
    onSubmit({ date, title, keywords: finalKeywords, imageFile })
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
          <S.HeaderTitle>분실물 관리</S.HeaderTitle>
        </S.Header>

        <S.TitleRow>
          <S.DateSelectWrap>
            <S.DateSelect aria-label="취득 날짜" value={date} onChange={(e) => setDate(e.target.value)}>
              {LOST_FOUND_DATES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </S.DateSelect>
            <svg width="7" height="5" viewBox="0 0 7 5" fill="none" aria-hidden="true">
              <path d="M1 1L3.5 3.5L6 1" stroke="#FFF" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </S.DateSelectWrap>
          <S.TitleInput
            ref={titleRef}
            rows={1}
            value={title}
            placeholder="제목을 입력하세요..."
            onChange={(e) => setTitle(e.target.value)}
          />
        </S.TitleRow>

        <S.ImageArea>
          {imagePreview && <S.Image src={imagePreview} alt="" />}
          <S.ImageButton type="button" onClick={() => fileInputRef.current?.click()}>
            {imagePreview ? '사진 수정' : '사진 등록'}
          </S.ImageButton>
        </S.ImageArea>
        <S.HiddenFileInput ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} />

        <S.KeywordSection>
          <S.KeywordList>
            {keywords.map((keyword) => (
              <S.Keyword key={keyword}>
                #{keyword}
                <S.KeywordRemoveButton
                  type="button"
                  aria-label={`${keyword} 키워드 삭제`}
                  onClick={() => setKeywords((prev) => prev.filter((k) => k !== keyword))}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <circle cx="7" cy="7" r="6.5" fill="#EDB5B5" stroke="#D27A7A" />
                    <path d="M4.5 4.5L9.5 9.5M9.5 4.5L4.5 9.5" stroke="#C62828" strokeLinecap="round" />
                  </svg>
                </S.KeywordRemoveButton>
              </S.Keyword>
            ))}
            {isAddingKeyword ? (
              <S.KeywordInput
                autoFocus
                value={keywordDraft}
                placeholder="#키워드"
                onChange={(e) => setKeywordDraft(e.target.value)}
                onKeyDown={handleKeywordKeyDown}
                onBlur={commitKeyword}
              />
            ) : (
              <S.AddKeywordButton type="button" aria-label="키워드 추가" onClick={() => setIsAddingKeyword(true)}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <circle cx="9" cy="9" r="8.5" stroke="#000" />
                  <path d="M9 4.5V13.5M4.5 9H13.5" stroke="#000" strokeLinecap="round" />
                </svg>
              </S.AddKeywordButton>
            )}
          </S.KeywordList>
          <S.Hint>*키워드 작성 시, 직관적이고 명확한 키워드로 입력해주세요.</S.Hint>
        </S.KeywordSection>

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
            제목 및 키워드칸은 필수 입력값입니다. 미입력 시 등록되지 않습니다.
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
        description={leaveDescription}
        onClose={() => setIsLeaveOpen(false)}
        onConfirm={onLeave}
      />
    </S.Page>
  )
}
