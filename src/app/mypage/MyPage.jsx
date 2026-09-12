import { useAuth } from '../../hooks/useAuth'
import MyLanternList from './components/MyLanternList'
import MyCouponList from './components/MyCouponList'

// 마이페이지 — 나의 쿠폰 / 나의 등불 / 로그아웃
export default function MyPage() {
  const { user, logout } = useAuth()

  return (
    <div>
      <h2>{user?.nickname ?? '게스트'}님</h2>
      <MyCouponList coupons={[]} onSelect={() => {}} />
      <MyLanternList lanterns={[]} onDelete={() => {}} />
      <button onClick={logout}>로그아웃</button>
    </div>
  )
}
