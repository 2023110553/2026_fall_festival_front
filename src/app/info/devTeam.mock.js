import profileImage from '../../assets/info/dev-team-profile.png'

import leaderJinhoImage from '../../assets/info/dev-team/leader-jinho.png'

import pmSeohyeonImage from '../../assets/info/dev-team/pm-seohyeon.png'
import pmYoonseoImage from '../../assets/info/dev-team/pm-yoonseo.png'
import pmSoiImage from '../../assets/info/dev-team/pm-soi.png'
import pmSaraImage from '../../assets/info/dev-team/pm-sara.png'

import frontHyunwooImage from '../../assets/info/dev-team/front-hyunwoo.png'
import frontSeongchaeImage from '../../assets/info/dev-team/front-seongchae.png'
import frontSejinImage from '../../assets/info/dev-team/front-sejin.png'
import frontChaehyunImage from '../../assets/info/dev-team/front-chaehyun.png'
import frontYoonseoImage from '../../assets/info/dev-team/front-yoonseo.png'
import frontHyoriImage from '../../assets/info/dev-team/front-hyori.png'
import frontSeolheeImage from '../../assets/info/dev-team/front-seolhee.png'
import frontJaewonImage from '../../assets/info/dev-team/front-jaewon.png'
import frontSeungwonImage from '../../assets/info/dev-team/front-seungwon.png'
import frontHeesooImage from '../../assets/info/dev-team/front-heesoo.png'
import frontHyoryeongImage from '../../assets/info/dev-team/front-hyoryeong.png'
import frontHyeonImage from '../../assets/info/dev-team/front-hyeon.png'

import backHeesooImage from '../../assets/info/dev-team/back-heesoo.png'
import backGyohyeonImage from '../../assets/info/dev-team/back-gyohyeon.png'
import backSehoImage from '../../assets/info/dev-team/back-seho.png'
import backSeungwooImage from '../../assets/info/dev-team/back-seungwoo.png'
import backChanghwanImage from '../../assets/info/dev-team/back-changhwan.png'
import backSooyeonImage from '../../assets/info/dev-team/back-sooyeon.png'
import backYejinImage from '../../assets/info/dev-team/back-yejin.png'
import backSuaImage from '../../assets/info/dev-team/back-sua.png'
import backEunseoImage from '../../assets/info/dev-team/back-eunseo.png'
import backJunhoImage from '../../assets/info/dev-team/back-junho.png'

const createMember = (
  id,
  track,
  department,
  name,
  imageUrl = profileImage,
) => ({
  id,
  track,
  department,
  name,
  imageUrl,
})

export const DEV_TEAM_MOCKS = [
  {
    id: 'leader',
    label: 'Leader',
    members: [
      createMember(
        'leader-1',
        '총괄 / 백엔드',
        '정보통신공학과',
        '장진호',
        leaderJinhoImage,
      ),
    ],
  },

  {
    id: 'pm-design',
    label: 'PM / DESIGN',
    members: [
      createMember(
        'pm-1',
        '기획·디자인 총괄',
        '광고홍보학과',
        '정서현',
        pmSeohyeonImage,
      ),
      createMember(
        'pm-2',
        '기획·디자인',
        '건축학전공',
        '오윤서',
        pmYoonseoImage,
      ),
      createMember(
        'pm-3',
        '기획·디자인',
        '경영학과',
        '이소이',
        pmSoiImage,
      ),
      createMember(
        'pm-4',
        '기획·디자인',
        '경영정보학과',
        '황사라',
        pmSaraImage,
      ),
    ],
  },

  {
    id: 'front-end',
    label: 'FRONT-END',
    members: [
      createMember(
        'front-1',
        '프론트엔드 총괄',
        '컴퓨터·AI학부',
        '이현우',
        frontHyunwooImage,
      ),
      createMember(
        'front-2',
        '프론트엔드',
        '전기전자공학부',
        '고성채',
        frontSeongchaeImage,
      ),
      createMember(
        'front-3',
        '프론트엔드',
        '컴퓨터공학전공',
        '김세진',
        frontSejinImage,
      ),
      createMember(
        'front-4',
        '프론트엔드',
        '산업시스템공학과',
        '김채현',
        frontChaehyunImage,
      ),
      createMember(
        'front-5',
        '프론트엔드',
        '정보통신학과',
        '노윤서',
        frontYoonseoImage,
      ),
      createMember(
        'front-6',
        '프론트엔드',
        '컴퓨터공학전공',
        '손효리',
        frontHyoriImage,
      ),
      createMember(
        'front-7',
        '프론트엔드 / 홍보팀',
        '컴퓨터공학전공',
        '유설희',
        frontSeolheeImage,
      ),
      createMember(
        'front-8',
        '프론트엔드 / 대외협력팀',
        '정보통신공학과',
        '윤재원',
        frontJaewonImage,
      ),
      createMember(
        'front-9',
        '프론트엔드',
        '컴퓨터공학전공',
        '이승원',
        frontSeungwonImage,
      ),
      createMember(
        'front-10',
        '대외협력팀 총괄 / 프론트엔드',
        '경영학과',
        '이희수',
        frontHeesooImage,
      ),
      createMember(
        'front-11',
        '프론트엔드',
        '식품산업관리학과',
        '이효령',
        frontHyoryeongImage,
      ),
      createMember(
        'front-12',
        '프론트엔드',
        '컴퓨터·AI학부',
        '허현',
        frontHyeonImage,
      ),
    ],
  },

  {
    id: 'back-end',
    label: 'BACK-END',
    members: [
      createMember(
        'back-1',
        '백엔드 총괄',
        '정보통신공학과',
        '이희수',
        backHeesooImage,
      ),
      createMember(
        'back-2',
        '백엔드',
        '컴퓨터공학전공',
        '구교현',
        backGyohyeonImage,
      ),
      createMember(
        'back-3',
        '백엔드',
        '컴퓨터·AI학부',
        '이세호',
        backSehoImage,
      ),
      createMember(
        'back-4',
        '백엔드',
        '정보통신공학과',
        '이승우',
        backSeungwooImage,
      ),
      createMember(
        'back-5',
        '백엔드',
        '컴퓨터공학전공',
        '이창환',
        backChanghwanImage,
      ),
      createMember(
        'back-6',
        '백엔드',
        '컴퓨터·AI학부',
        '임수연',
        backSooyeonImage,
      ),
      createMember(
        'back-7',
        '백엔드',
        '전자전기공학부',
        '임예진',
        backYejinImage,
      ),
      createMember(
        'back-8',
        '백엔드',
        '통계학과',
        '조수아',
        backSuaImage,
      ),
      createMember(
        'back-9',
        '백엔드 / 대외협력팀',
        '정보통신공학과',
        '최은서',
        backEunseoImage,
      ),
      createMember(
        'back-10',
        '백엔드',
        '컴퓨터공학전공',
        '황준호',
        backJunhoImage,
      ),
    ],
  },
]