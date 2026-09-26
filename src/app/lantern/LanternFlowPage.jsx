'use client'
import { useTranslation } from '../../i18n/useTranslation'

import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getMyCoupons, issueCoupon, scratchCoupon, useCoupon as redeemCoupon } from '../../api/coupon'
import { useCreateLanternFlow } from './hooks/useCreateLanternFlow'
import { useLanterns } from './context/LanternProvider'
import { getTodayLanternCount, getTodayUsedBoothIds, getCurrentFestivalDate } from './utils/getCurrentFestivalDate'
import { getToday } from './utils/getToday'
import CreateLanternModal from './components/CreateLanternModal'
import ScratchCouponModal from './components/ScratchCouponModal'
import CouponResultModal from './components/CouponResultModal'
import VerifyCodeModal from './components/VerifyCodeModal'
import MyCouponListModal from '../mypage/components/coupon/MyCouponListModal'
import MyLanternList from '../mypage/components/lantern/MyLanternList'
import LoginModal from '../auth/LoginModal'
import AlertModal from '../../components/common/AlertModal'

const OPEN_LANTERN_PARAM = 'openLantern'
const getApiMessage = (error, fallback) => error?.response?.data?.message || fallback

export default function LanternFlowPage() {
  const { t } = useTranslation()
  const { isLoggedIn } = useAuth()
  const {
    lanterns, addLantern, deleteLantern, editLantern, registerTriggers,
    activeBooth, coupon, setCoupon,
  } = useLanterns()
  const todayLanternCount = getTodayLanternCount(lanterns)
  const usedBoothIds = getTodayUsedBoothIds(lanterns)
  const [couponFlow, setCouponFlow] = useState(null)
  const [coupons, setCoupons] = useState([])
  const [isNewCoupon, setIsNewCoupon] = useState(false)
  const [isCouponListOpen, setIsCouponListOpen] = useState(false)
  const [couponError, setCouponError] = useState('')

  useEffect(() => {
    if (!isLoggedIn) {
      setCoupons([])
      setCoupon(null)
    }
  }, [isLoggedIn, setCoupon])

  const loadCoupons = async () => {
    const items = await getMyCoupons()
    setCoupons(items)
    return items
  }

  const {
    isCreateModalOpen, closeCreateModal, openCreateModal,
    isLimitModalOpen, closeLimitModal,
    isSuccessModalOpen, closeSuccessModal, handleCreateLantern,
  } = useCreateLanternFlow({
    lanternCount: todayLanternCount,
    onCreated: addLantern,
    onFirstLantern: async () => {
      try {
        const issuedCoupon = await issueCoupon()
        setCoupons((current) => [issuedCoupon, ...current.filter((item) => item.id !== issuedCoupon.id)])
        setCoupon(issuedCoupon)
        setIsNewCoupon(true)
        setCouponFlow('scratch')
      } catch (error) {
        try {
          const items = await loadCoupons()
          const todayCoupon = items.find((item) => item.date === getToday())
          if (todayCoupon) {
            setCoupon(todayCoupon)
            setIsNewCoupon(true)
            setCouponFlow(todayCoupon.status === 'unscratched' ? 'scratch' : 'result')
            return
          }
        } catch {
          // 발급 실패 안내는 최초 오류 메시지를 사용한다.
        }
        setCouponError(getApiMessage(error, '쿠폰을 발급하지 못했어요. 나의 쿠폰에서 다시 확인해주세요.'))
      }
    },
  })

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [wrongDateVariant, setWrongDateVariant] = useState(null)
  const [isLanternListOpen, setIsLanternListOpen] = useState(false)
  const [isNoLanternModalOpen, setIsNoLanternModalOpen] = useState(false)

  const clearOpenLanternParam = () => {
    const params = new URLSearchParams(window.location.search)
    if (!params.has(OPEN_LANTERN_PARAM)) return
    params.delete(OPEN_LANTERN_PARAM)
    const query = params.toString()
    window.history.replaceState(null, '', window.location.pathname + (query ? `?${query}` : '') + window.location.hash)
  }

  useEffect(() => {
    if (!isLoggedIn) return
    if (!new URLSearchParams(window.location.search).has(OPEN_LANTERN_PARAM)) return
    clearOpenLanternParam()
    openCreateModal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])

  const handleOpenCreateFlow = () => {
    if (!isLoggedIn) {
      const params = new URLSearchParams(window.location.search)
      params.set(OPEN_LANTERN_PARAM, '1')
      window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}${window.location.hash}`)
      setIsLoginModalOpen(true)
      return
    }
    if (activeBooth?.festivalDate && activeBooth.festivalDate !== getCurrentFestivalDate()) {
      setWrongDateVariant(activeBooth.festivalDate < getCurrentFestivalDate() ? 'past' : 'future')
      return
    }
    openCreateModal()
  }

  const handleOpenListFlow = () => {
    if (lanterns.length === 0) setIsNoLanternModalOpen(true)
    else setIsLanternListOpen(true)
  }

  const handleOpenCouponFlow = async () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true)
      return
    }
    try {
      await loadCoupons()
      setIsCouponListOpen(true)
    } catch (error) {
      setCouponError(getApiMessage(error, '쿠폰 목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.'))
    }
  }

  const handleSelectCoupon = (selectedCoupon) => {
    setCoupon(selectedCoupon)
    setIsCouponListOpen(false)
    setIsNewCoupon(false)
    setCouponFlow(selectedCoupon.status === 'unscratched' ? 'scratch' : 'result')
  }

  useEffect(() => {
    registerTriggers({
      openCreateModal: handleOpenCreateFlow,
      openLanternList: handleOpenListFlow,
      openCoupon: handleOpenCouponFlow,
    })
  })

  const handleScratchStart = async () => {
    if (coupon?.status !== 'unscratched') return coupon
    try {
      const scratchedCoupon = await scratchCoupon(coupon.id)
      setCoupon(scratchedCoupon)
      setCoupons((current) => current.map((item) => item.id === scratchedCoupon.id ? scratchedCoupon : item))
      return scratchedCoupon
    } catch (error) {
      setCouponError(getApiMessage(error, '쿠폰 결과를 확인하지 못했어요. 다시 시도해주세요.'))
      throw error
    }
  }

  const handleVerifyCode = async (code) => {
    if (coupon?.status !== 'win') throw new Error('사용할 수 없는 쿠폰이에요.')
    try {
      const used = await redeemCoupon(coupon.id, code.trim())
      const usedCoupon = { ...coupon, status: used.status.toLowerCase(), usedAt: used.used_at }
      setCoupon(usedCoupon)
      setCoupons((current) => current.map((item) => item.id === usedCoupon.id ? usedCoupon : item))
      setCouponFlow('result')
    } catch (error) {
      if (error?.response?.status === 409) {
        try {
          const items = await loadCoupons()
          const refreshedCoupon = items.find((item) => item.id === coupon.id)
          if (refreshedCoupon) setCoupon(refreshedCoupon)
        } catch {
          // 입력 모달에는 원래 사용 API의 오류를 표시한다.
        }
      }
      throw new Error(getApiMessage(error, '쿠폰을 사용하지 못했어요. 다시 시도해주세요.'))
    }
  }

  return (
    <>
      <LoginModal open={isLoginModalOpen} onClose={() => {
        clearOpenLanternParam()
        setIsLoginModalOpen(false)
      }} />
      <CreateLanternModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSubmitSuccess={handleCreateLantern}
        currentCount={todayLanternCount}
        usedBoothIds={usedBoothIds}
        presetBoothId={activeBooth?.boothId ?? null}
      />
      <ScratchCouponModal
        isOpen={couponFlow === 'scratch'}
        onClose={() => setCouponFlow(null)}
        onScratchStart={handleScratchStart}
        onReveal={() => setCouponFlow('result')}
        coupon={coupon}
        isNewCoupon={isNewCoupon}
      />
      <CouponResultModal isOpen={couponFlow === 'result'} onClose={() => setCouponFlow(null)} coupon={coupon} onUseClick={() => setCouponFlow('verify')} />
      <VerifyCodeModal isOpen={couponFlow === 'verify'} onClose={() => setCouponFlow('result')} onSubmit={handleVerifyCode} />
      <MyCouponListModal isOpen={isCouponListOpen} onClose={() => setIsCouponListOpen(false)} coupons={coupons} onSelect={handleSelectCoupon} />
      <AlertModal isOpen={isSuccessModalOpen} onClose={closeSuccessModal} title={t('lantern.successTitle')} subTitle={t('lantern.successDescription')} />
      <AlertModal isOpen={isLimitModalOpen} onClose={closeLimitModal} title={t('lantern.limitTitle')} subTitle={t('lantern.limitDescription')} />
      <MyLanternList isOpen={isLanternListOpen} onClose={() => setIsLanternListOpen(false)} lanterns={lanterns} onDelete={deleteLantern} onEdit={editLantern} />
      <AlertModal isOpen={isNoLanternModalOpen} onClose={() => setIsNoLanternModalOpen(false)} title={t('coupon.emptyTitle')} subTitle={t('coupon.emptyDescription')} />
      <AlertModal
        isOpen={wrongDateVariant !== null}
        onClose={() => setWrongDateVariant(null)}
        title={wrongDateVariant === 'past' ? t('lantern.pastDateTitle') : t('lantern.futureDateTitle')}
        subTitle={t('lantern.changeDate')}
      />
      <AlertModal isOpen={Boolean(couponError)} onClose={() => setCouponError('')} title={t('coupon.unavailable')} subTitle={couponError} />
    </>
  )
}
