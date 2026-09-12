// 닉네임(선택, 5자 제한, 미입력시 "익명의 코끼리") + 축제 한마디(30자 제한) 입력 폼
export default function MessageForm({ nickname, message, onChangeNickname, onChangeMessage }) {
  return (
    <div>
      <input
        value={nickname}
        maxLength={5}
        placeholder="닉네임 (선택)"
        onChange={(e) => onChangeNickname(e.target.value)}
      />
      <textarea
        value={message}
        maxLength={30}
        placeholder="축제 한마디"
        onChange={(e) => onChangeMessage(e.target.value)}
      />
    </div>
  )
}
