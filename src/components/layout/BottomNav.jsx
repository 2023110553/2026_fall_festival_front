import { useLocation, useNavigate } from 'react-router-dom'
import { useLanterns } from '../../app/lantern/context/LanternProvider'
import { useTranslation } from '../../i18n/useTranslation'
import * as S from './BottomNav.styles'

import homeIcon from '../../assets/bottom-nav/home.svg'
import mapIcon from '../../assets/bottom-nav/map.svg'
import performanceIcon from '../../assets/bottom-nav/performance.svg'
import infoIcon from '../../assets/bottom-nav/info.svg'
import plusIcon from '../../assets/bottom-nav/plus.svg'

const LEFT_ITEMS = [
  { path: '/', labelKey: 'nav.home', icon: homeIcon },
  { path: '/map', labelKey: 'nav.map', icon: mapIcon },
]

const RIGHT_ITEMS = [
  { path: '/performance', labelKey: 'nav.performance', icon: performanceIcon },
  { path: '/info', labelKey: 'nav.info', icon: infoIcon },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { requestCreateModal } = useLanterns()
  const { t } = useTranslation()

  const isActive = (path) =>
    path === '/' ? pathname === path : pathname === path || pathname.startsWith(`${path}/`)

  const renderItem = (item) => (
    <S.NavItem
      key={item.path}
      type="button"
      $active={isActive(item.path)}
      aria-label={t(item.labelKey)}
      aria-current={isActive(item.path) ? 'page' : undefined}
      onClick={() => navigate(item.path)}
    >
      <S.Icon
        src={item.icon}
        alt=""
        $active={isActive(item.path)}
        aria-hidden="true"
      />
      <S.Label>{t(item.labelKey)}</S.Label>
    </S.NavItem>
  )

  return (
    <S.Wrapper aria-label={t('nav.main')}>
      <S.Bar>
        <S.ItemGroup>{LEFT_ITEMS.map(renderItem)}</S.ItemGroup>
        <S.ItemGroup>{RIGHT_ITEMS.map(renderItem)}</S.ItemGroup>
      </S.Bar>

      <S.LanternItem
        type="button"
        aria-label={t('nav.addLantern')}
        onClick={requestCreateModal}
      >
        <S.LanternButton>
          <S.PlusIcon src={plusIcon} alt="" aria-hidden="true" />
        </S.LanternButton>
        <S.Label>{t('nav.addLantern')}</S.Label>
      </S.LanternItem>
    </S.Wrapper>
  )
}
