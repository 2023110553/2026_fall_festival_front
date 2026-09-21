import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import * as S from './LostFoundEditor.styles'
import ConfirmLeaveModal from '../NoticeManage/ConfirmLeaveModal'
import { DEFAULT_FESTIVAL_DATE, FESTIVAL_DATES, isFestivalDate } from './lostFoundDates'
import { uploadAdminLostItemImage } from '../../../../api/admin'

const TOAST_DURATION = 2500

// 업로드 제약(jpg/jpeg/png/webp, 5MB)을 서버와 같은 기준으로 먼저 검사해서 413/415를 줄인다
const IMAGE_ACCEPT = '.jpg,.jpeg,.png,.webp'
const IMAGE_EXTENSION_PATTERN = /\.(jpe?g|png|webp)$/i
const IMAGE_MAX_BYTES = 5 * 1024 * 1024
const IMAGE_TOO_LARGE_MESSAGE = '이미지 용량은 5MB 이하여야 합니다.'
const IMAGE_TYPE_MESSAGE = 'jpg, jpeg, png, webp만 업로드 가능합니다.'
const IMAGE_UPLOADING_MESSAGE = '이미지 업로드가 끝난 뒤에 저장해주세요.'

// 서버 검증(INVALID_INPUT)과 같은 기준으로 먼저 걸러서 불필요한 요청을 막는다
const TITLE_MAX_LENGTH = 100
const KEYWORD_MAX_LENGTH = 30
const REQUIRED_BOTH_MESSAGE = '제목 및 키워드칸은 필수 입력값입니다. 미입력 시 등록되지 않습니다.'
const REQUIRED_TITLE_MESSAGE = '제목을 입력해주세요.'
const REQUIRED_TAGS_MESSAGE = '키워드칩을 1개 이상 입력해주세요.'

export default function LostFoundEditor({
  initialDate,
  initialTitle = '',
  initialImageUrl = '',
  initialKeywords = [],
  // 수정 화면에서만 true — tags 빈 배열은 400이라 마지막 남은 칩의 X를 막는다
  lockLastKeyword = false,
  submitLabel,
  continueLabel,
  leaveDescription,
  onSubmit,
  onLeave,
}) {
  // date는 API가 받는 ISO 형식(2026-09-29)으로 들고 있다가 그대로 보낸다
  const [date, setDate] = useState(isFestivalDate(initialDate) ? initialDate : DEFAULT_FESTIVAL_DATE)
  const [title, setTitle] = useState(initialTitle)
  // 사진은 고른 즉시 업로드해서 URL을 확보한다 (등록/수정 요청에는 URL만 담긴다)
  const [imageUrl, setImageUrl] = useState(initialImageUrl ?? '')
  const [isUploading, setIsUploading] = useState(false)
  // 업로드가 끝나기 전까지 보여줄 로컬 미리보기(objectURL)
  const [localPreview, setLocalPreview] = useState('')
  const [keywords, setKeywords] = useState(initialKeywords)
  const [isAddingKeyword, setIsAddingKeyword] = useState(false)
  const [keywordDraft, setKeywordDraft] = useState('')
  const [isLeaveOpen, setIsLeaveOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  // 필수값 미입력 안내 + 서버가 돌려준 400 메시지를 같은 토스트로 보여준다
  const [toastMessage, setToastMessage] = useState('')

  const titleRef = useRef(null)
  const fileInputRef = useRef(null)

  // 업로드 중에는 로컬 미리보기, 끝나면 서버가 준 URL
  const previewSrc = localPreview || imageUrl

  useLayoutEffect(() => {
    const el = titleRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [title])

  useEffect(() => {
    if (!toastMessage) return
    const timer = setTimeout(() => setToastMessage(''), TOAST_DURATION)
    return () => clearTimeout(timer)
  }, [toastMessage])

  // 고른 사진을 바로 업로드해서 URL만 들고 있는다 (413/415는 토스트로 안내)
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || isUploading) return

    if (!IMAGE_EXTENSION_PATTERN.test(file.name)) {
      setToastMessage(IMAGE_TYPE_MESSAGE)
      return
    }
    if (file.size > IMAGE_MAX_BYTES) {
      setToastMessage(IMAGE_TOO_LARGE_MESSAGE)
      return
    }

    const previewUrl = URL.createObjectURL(file)
    setLocalPreview(previewUrl)
    setIsUploading(true)
    try {
      const res = await uploadAdminLostItemImage(file)
      setImageUrl(res.data?.data?.image_url ?? '')
    } catch (err) {
      const data = err.response?.data
      setToastMessage(data?.errors?.file ?? data?.message ?? '이미지 업로드에 실패했습니다.')
    } finally {
      setIsUploading(false)
      // 업로드 결과(성공: 받은 URL / 실패: 직전 이미지)로 미리보기를 되돌린다
      setLocalPreview('')
      URL.revokeObjectURL(previewUrl)
    }
  }

  // "#"은 저장하지 않고, 중복은 추가 단계에서 걸러서 tags 배열 순서를 그대로 sort_order로 쓸 수 있게 한다
  const normalizeKeyword = (value) => value.trim().replace(/^#+/, '').slice(0, KEYWORD_MAX_LENGTH)

  const commitKeyword = () => {
    const keyword = normalizeKeyword(keywordDraft)
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

  // onSubmit이 실패 메시지(문자열)를 돌려주면 토스트로 띄운다 (서버 400의 errors/message)
  const handleSubmit = async () => {
    if (isSubmitting) return
    // 업로드 중에 저장하면 사진이 빠진 채로 저장되므로 끝날 때까지 막는다
    if (isUploading) {
      setToastMessage(IMAGE_UPLOADING_MESSAGE)
      return
    }

    // 키워드 입력 중에 저장을 누르면 blur 커밋이 아직 반영 전이므로 작성 중인 값도 포함한다
    const draft = normalizeKeyword(keywordDraft)
    const finalKeywords = draft && !keywords.includes(draft) ? [...keywords, draft] : keywords
    const trimmedTitle = title.trim()

    // 어느 쪽이 비었는지에 따라 안내 문구를 다르게 (서버 errors 키와 같은 기준)
    if (!trimmedTitle || finalKeywords.length === 0) {
      if (!trimmedTitle && finalKeywords.length === 0) setToastMessage(REQUIRED_BOTH_MESSAGE)
      else setToastMessage(!trimmedTitle ? REQUIRED_TITLE_MESSAGE : REQUIRED_TAGS_MESSAGE)
      return
    }

    setIsSubmitting(true)
    try {
      const failureMessage = await onSubmit({
        date,
        title: trimmedTitle,
        keywords: finalKeywords,
        // 화면은 사진 1장 기준이라 URL도 1개 — image_urls 배열로 그대로 전달된다
        imageUrls: imageUrl ? [imageUrl] : [],
      })
      if (failureMessage) setToastMessage(failureMessage)
    } finally {
      setIsSubmitting(false)
    }
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
              {FESTIVAL_DATES.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
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
            maxLength={TITLE_MAX_LENGTH}
            placeholder="제목을 입력하세요..."
            onChange={(e) => setTitle(e.target.value)}
          />
        </S.TitleRow>

        <S.ImageArea>
          {previewSrc && <S.Image src={previewSrc} alt="" />}
          <S.ImageButton
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? '업로드 중...' : previewSrc ? '사진 수정' : '사진 등록'}
          </S.ImageButton>
        </S.ImageArea>
        <S.HiddenFileInput
          ref={fileInputRef}
          type="file"
          accept={IMAGE_ACCEPT}
          onChange={handleFileChange}
        />

        <S.KeywordSection>
          <S.KeywordList>
            {keywords.map((keyword) => (
              <S.Keyword key={keyword}>
                #{keyword}
                <S.KeywordRemoveButton
                  type="button"
                  aria-label={`${keyword} 키워드 삭제`}
                  disabled={lockLastKeyword && keywords.length === 1}
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
              // 키워드는 30자까지 — 맨 앞 "#"은 저장 시 지우므로 입력 한도만 1자 더 준다
              <S.KeywordInput
                autoFocus
                value={keywordDraft}
                maxLength={KEYWORD_MAX_LENGTH + 1}
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

        {toastMessage && (
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
          <S.PrimaryButton type="button" disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? '저장 중...' : submitLabel}
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
