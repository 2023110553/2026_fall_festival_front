import { useNavigate, useSearchParams } from 'react-router-dom'

import LostFoundEditor from './LostFoundEditor'

const LIST_PATH = '/admin/lost-found'

export default function AdminLostFoundCreatePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const handleCreate = (payload) => {
    console.log('create lost-found', payload)
    navigate(LIST_PATH)
  }

  return (
    <LostFoundEditor
      initialDate={searchParams.get('date')}
      submitLabel="게시물 저장하기"
      continueLabel="계속 작성하기"
      onSubmit={handleCreate}
      onLeave={() => navigate(LIST_PATH)}
    />
  )
}
