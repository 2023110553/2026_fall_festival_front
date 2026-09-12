import { useState } from 'react'
import Modal from '../../../components/common/Modal'

// 당첨 쿠폰 사용 시 부스에서 받은 확인 코드를 입력하는 모달 (당일에만 사용 가능)
export default function VerifyCodeModal({ open, onClose, onSubmit }) {
  const [code, setCode] = useState('')

  return (
    <Modal open={open} onClose={onClose}>
      <p>확인 코드를 입력해주세요</p>
      <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="주점에서 직접 서버한테 보여주세요" />
      <button disabled={code.length < 1} onClick={() => onSubmit(code)}>
        사용하기
      </button>
    </Modal>
  )
}
