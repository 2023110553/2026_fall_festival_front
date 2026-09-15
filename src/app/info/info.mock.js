import lostWalletImage from '../../assets/info/lost-wallet.svg'
import lostEarbudsImage from '../../assets/info/lost-earbuds.svg'
import lostUmbrellaImage from '../../assets/info/lost-umbrella.svg'
import lostStudentIdImage from '../../assets/info/lost-student-id.svg'
import noticeStageImage from '../../assets/info/notice-stage.svg'

export const COLLAB_MOCKS = [
  {
    id: 'collab-1',
    name: '총학생회',
    description: '2026 가을 대동제를 함께 준비하는 협업 단체입니다.',
    introduction: '학생들이 안전하고 즐겁게 축제를 즐길 수 있도록 행사 운영 전반을 지원합니다.',
    imageUrl: '',
    snsHandle: '@dgu_student',
    snsUrl: 'https://www.instagram.com/',
  },
  {
    id: 'collab-2',
    name: '동아리연합회',
    description: '교내 동아리 공연과 체험 부스를 운영합니다.',
    introduction: '다양한 중앙동아리가 참여하는 공연과 체험 프로그램을 소개합니다.',
    imageUrl: '',
    snsHandle: '@dgu_club',
    snsUrl: 'https://www.instagram.com/',
  },
  {
    id: 'collab-3',
    name: 'ESG 서포터즈',
    description: '지속 가능한 축제 문화를 함께 만듭니다.',
    introduction: '다회용기 이용과 올바른 분리배출을 안내하며 친환경 축제 운영을 돕습니다.',
    imageUrl: '',
    snsHandle: '@dgu_esg',
    snsUrl: 'https://www.instagram.com/',
  },
  {
    id: 'collab-4',
    name: '지역 상인 협의체',
    description: '지역과 대학이 함께하는 축제를 지원합니다.',
    introduction: '축제 방문객에게 다양한 먹거리와 편의 서비스를 제공합니다.',
    imageUrl: '',
    snsHandle: '',
    snsUrl: '',
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
