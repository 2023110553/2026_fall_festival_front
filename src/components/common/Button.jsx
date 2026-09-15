import * as S from './Button.styles'

// 팀 공통 styled-components 컨벤션: `ComponentName.styles.js`에 스타일을 두고
// 컴포넌트 파일에서는 `import * as S from './ComponentName.styles'` 로 가져와 <S.Xxx>로 사용한다.
export default function Button({ children, variant = 'primary', fullWidth = false, type = 'button', ...rest }) {
  return (
    <S.Base type={type} $variant={variant} $fullWidth={fullWidth} {...rest}>
      {children}
    </S.Base>
  )
}
