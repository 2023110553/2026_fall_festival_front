import lostWalletImage from '../../assets/info/lost-wallet.svg'
import lostEarbudsImage from '../../assets/info/lost-earbuds.svg'
import lostUmbrellaImage from '../../assets/info/lost-umbrella.svg'
import lostStudentIdImage from '../../assets/info/lost-student-id.svg'
import noticeStageImage from '../../assets/info/notice-stage.svg'
import dongbitImage from '../../assets/info/collab-dongbit.png'
import ecocoImage from '../../assets/info/collab-ecoco.png'
import donggamImage from '../../assets/info/collab-donggam.webp'
import naturalScienceImage from '../../assets/info/collab-natural-science.webp'

export const COLLAB_MOCKS = [
  {
    id: 'dongbit',
    name: 'ESG서포터즈 동빛',
    description: '동국ESG서포터즈 ‘동빛’은 학생의 시각에서 교내 ESG 활동과 성과를 알리고, ESG 경영 아이디어를 제안하는 서포터즈입니다. 동빛에서는 인스타그램 콘텐츠 및 웹진 제작, 축제 부스 운영 등 다양한 활동을 진행합니다. 특히 일상에서 쉽게 실천할 수 있는 친환경 활동을 기획하며 교내 ESG 문화를 확산하고 있습니다.',
    imageUrl: dongbitImage,
    snsHandle: '@dongguk_esg',
    snsUrl: 'https://www.instagram.com/dongguk_esg/',
  },
  {
    id: 'ecoco',
    name: '환경 소모임 에코코',
    description: '에코코는 환경교육과 학술토론을 비롯해 교내외에서 다양한 환경 활동을 기획하고, 더 나아가 탄소중립 실현을 위한 실천 활동을 진행하는 동국대학교 환경 소모임입니다. 특히 올해는 서울시 소재 대학 최초의 전면 다회용기 축제 운영을 추진하고 있는 만큼, 이번 활동에도 많은 관심 부탁드립니다!',
    imageUrl: ecocoImage,
    snsHandle: '@eco_.co2',
    snsUrl: 'https://www.instagram.com/eco_.co2/',
  },
  {
    id: 'donggam',
    name: '동국대학교 홍보대사 동감',
    description: '동국대학교 공식 홍보대사 ‘동감’은 동국의 느낌, 동국인의 생각을 전한다는 의미를 담아 동국대학교의 가치와 이야기를 대내외에 알리는 역할을 하고 있습니다. 대표적으로 예비 동국인과 방문객을 위한 캠퍼스투어, 교내외 공식 행사의 의전 활동, 학교를 대표하는 홍보 모델 활동을 진행합니다. 또한 인스타그램과 유튜브 등 다양한 SNS를 통해 학교생활과 동국대학교의 모습을 담은 홍보 콘텐츠를 직접 기획·제작하고 있습니다. 동감은 다양한 활동을 통해 동국대학교의 긍정적인 이미지를 알리고, 동국인의 자긍심을 높이는 것을 목표로 활동하고 있습니다. 앞으로도 동국대학교의 가치와 매력을 보다 많은 사람들에게 진심을 담아 전달할 수 있도록 노력하겠습니다.',
    imageUrl: donggamImage,
    snsHandle: '@donggukuniv_donggam',
    snsUrl: 'https://www.instagram.com/donggukuniv_donggam/',
  },
  {
    id: 'with-nature',
    name: '이과대학 불교동아리 ‘자연科 함께',
    description: '🪷이과대학 불교동아리 ‘자연科 함께’ 🪷 안녕하세요, 이과대학 불교동아리 ’자연科 함께‘입니다. 저희는 불교의 가르침을 중심으로 활동하지만, 종교적 배경에 상관없이 누구나 참여할 수 있는 환경을 제공합니다.',
    imageUrl: naturalScienceImage,
    snsHandle: '@dgu_club',
    snsUrl: 'https://www.instagram.com/science_dgu_buddhism/',
  },
]
export const NOTICE_MOCKS = [
  {
    id: 'notice-1',
    title: '우천으로 인한 메인 무대 공연 시작 시간 및 입장 동선 변경 안내',
    date: '09.29',
    isUrgent: true,
    imageUrl: noticeStageImage,
    content: '우천 상황에 따라 일부 공연 시작 시간이 변경되었습니다. 현장 안내와 최신 공지를 확인해 주세요.',
  },
  {
    id: 'notice-2',
    title: '축제장 입장 및 안전 수칙 안내',
    date: '09.29',
    isUrgent: false,
    imageUrl: noticeStageImage,
    content: '혼잡 구역에서는 안전요원의 안내에 따라 이동해 주세요. 위험 물품은 행사장에 반입할 수 없습니다.',
  },
  {
    id: 'notice-3',
    title: '분리배출 장소 운영 안내',
    date: '09.30',
    isUrgent: false,
    imageUrl: noticeStageImage,
    content: '행사장 곳곳에 분리배출 장소가 마련되어 있습니다. 품목별 표시에 맞춰 배출해 주세요.',
  },
]

export const LOST_FOUND_MOCKS = [
  {
    id: 'lost-1',
    title: '검은색 카드지갑',
    date: '9/29',
    location: '팔정도 무대 앞',
    imageUrl: lostWalletImage,
    hashtags: ['#카드지갑', '#검은색', '#팔정도'],
    instagramUrl: 'https://www.instagram.com/',
  },
  {
    id: 'lost-2',
    title: '흰색 무선 이어폰',
    date: '9/29',
    location: '푸드트럭 존',
    imageUrl: lostEarbudsImage,
    hashtags: ['#무선이어폰', '#흰색', '#푸드트럭존'],
    instagramUrl: 'https://www.instagram.com/',
  },
  {
    id: 'lost-3',
    title: '파란색 우산',
    date: '9/30',
    location: '혜화관 입구',
    imageUrl: lostUmbrellaImage,
    hashtags: ['#우산', '#파란색', '#혜화관'],
    instagramUrl: 'https://www.instagram.com/',
  },
  {
    id: 'lost-4',
    title: '학생증',
    date: '10/1',
    location: '만해광장 안내 부스',
    imageUrl: lostStudentIdImage,
    hashtags: ['#학생증', '#만해광장', '#안내부스'],
    instagramUrl: 'https://www.instagram.com/',
  },
]
