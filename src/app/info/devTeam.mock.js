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

const createMember = (id, track, department, name, imageUrl = null) => ({
  id,
  track,
  department,
  name,
  imageUrl,
})

const MEMBERS = {
  jinho: createMember('jinho', '총괄 / 백엔드', '정보통신공학과', '장진호', leaderJinhoImage),
  seohyeon: createMember(
    'seohyeon',
    '기획·디자인 총괄 / 홍보팀',
    '광고홍보학과',
    '정서현',
    pmSeohyeonImage,
  ),
  yoonseoPm: createMember(
    'yoonseo-pm',
    '기획·디자인 / 홍보팀',
    '건축학전공',
    '오윤서',
    pmYoonseoImage,
  ),
  soi: createMember('soi', '기획·디자인 / 홍보팀', '경영학과', '이소이', pmSoiImage),
  sara: createMember(
    'sara',
    '기획·디자인 / 홍보팀',
    '경영정보학과',
    '황사라',
    pmSaraImage,
  ),
  hyunwoo: createMember(
    'hyunwoo',
    '프론트엔드 총괄 / 대외협력팀',
    '컴퓨터·AI학부',
    '이현우',
    frontHyunwooImage,
  ),
  seongchae: createMember(
    'seongchae',
    '프론트엔드',
    '전기전자공학부',
    '고성채',
    frontSeongchaeImage,
  ),
  sejin: createMember('sejin', '프론트엔드', '컴퓨터공학전공', '김세진', frontSejinImage),
  chaehyun: createMember(
    'chaehyun',
    '프론트엔드',
    '산업시스템공학과',
    '김채현',
    frontChaehyunImage,
  ),
  yoonseoFront: createMember(
    'yoonseo-front',
    '프론트엔드',
    '정보통신공학과',
    '노윤서',
    frontYoonseoImage,
  ),
  hyori: createMember('hyori', '프론트엔드', '컴퓨터공학전공', '손효리', frontHyoriImage),
  seolhee: createMember('seolhee', '프론트엔드', '컴퓨터공학전공', '유설희', frontSeolheeImage),
  jaewon: createMember(
    'jaewon',
    '프론트엔드 / 대외협력팀',
    '정보통신공학과',
    '윤재원',
    frontJaewonImage,
  ),
  seungwon: createMember(
    'seungwon',
    '대외협력팀',
    '컴퓨터공학전공',
    '이승원',
    frontSeungwonImage,
  ),
  heesooFront: createMember(
    'heesoo-front',
    '대외협력팀 총괄 / 프론트엔드',
    '경영학과',
    '이희수',
    frontHeesooImage,
  ),
  hyoryeong: createMember(
    'hyoryeong',
    '홍보팀 총괄 / 프론트엔드',
    '식품산업관리학과',
    '이효령',
    frontHyoryeongImage,
  ),
  hyeon: createMember('hyeon', '프론트엔드', '컴퓨터·AI학부', '허현', frontHyeonImage),
  gyohyeon: createMember('gyohyeon', '백엔드', '컴퓨터공학전공', '구교현', backGyohyeonImage),
  seho: createMember('seho', '백엔드', '컴퓨터·AI학부', '이세호', backSehoImage),
  seungwoo: createMember('seungwoo', '백엔드', '정보통신공학과', '이승우', backSeungwooImage),
  changhwan: createMember('changhwan', '백엔드', '컴퓨터공학전공', '이창환', backChanghwanImage),
  heesooBack: createMember(
    'heesoo-back',
    '백엔드 총괄',
    '정보통신공학과',
    '이희수',
    backHeesooImage,
  ),
  sooyeon: createMember('sooyeon', '백엔드', '컴퓨터·AI학부', '임수연', backSooyeonImage),
  yejin: createMember('yejin', '백엔드', '전자전기공학부', '임예진', backYejinImage),
  sua: createMember('sua', '백엔드', '통계학과', '조수아', backSuaImage),
  eunseo: createMember(
    'eunseo',
    '백엔드 / 대외협력팀',
    '정보통신공학과',
    '최은서',
    backEunseoImage,
  ),
  junho: createMember('junho', '백엔드', '컴퓨터공학전공', '황준호', backJunhoImage),
}

export const DEV_TEAM_MOCKS = [
  {
    id: 'leader',
    label: 'Leader',
    members: [
      MEMBERS.jinho,
      MEMBERS.seohyeon,
      MEMBERS.hyunwoo,
      MEMBERS.heesooBack,
      MEMBERS.heesooFront,
      MEMBERS.hyoryeong,
    ],
  },
  {
    id: 'pm-design',
    label: 'PM / DESIGN',
    members: [MEMBERS.yoonseoPm, MEMBERS.soi, MEMBERS.seohyeon, MEMBERS.sara],
  },
  {
    id: 'front-end',
    label: 'FRONT-END',
    members: [
      MEMBERS.seongchae,
      MEMBERS.sejin,
      MEMBERS.chaehyun,
      MEMBERS.yoonseoFront,
      MEMBERS.hyori,
      MEMBERS.seolhee,
      MEMBERS.jaewon,
      MEMBERS.hyunwoo,
      MEMBERS.hyoryeong,
      MEMBERS.heesooFront,
      MEMBERS.hyeon,
    ],
  },
  {
    id: 'back-end',
    label: 'BACK-END',
    members: [
      MEMBERS.gyohyeon,
      MEMBERS.seho,
      MEMBERS.seungwoo,
      MEMBERS.changhwan,
      MEMBERS.heesooBack,
      MEMBERS.sooyeon,
      MEMBERS.yejin,
      MEMBERS.sua,
      MEMBERS.eunseo,
      MEMBERS.junho,
    ],
  },
  {
    id: 'external-relations',
    label: '대외협력팀',
    members: [
      MEMBERS.jaewon,
      MEMBERS.seungwon,
      MEMBERS.hyunwoo,
      MEMBERS.heesooFront,
      MEMBERS.eunseo,
    ],
  },
  {
    id: 'promotion',
    label: '홍보팀',
    members: [
      MEMBERS.yoonseoPm,
      MEMBERS.soi,
      MEMBERS.hyoryeong,
      MEMBERS.seohyeon,
      MEMBERS.sara,
    ],
  },
]
