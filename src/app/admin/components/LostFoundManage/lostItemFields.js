// 상세/수정 응답의 images, tags는 sort_order를 들고 오는 객체 배열이다.
// 등록/수정 요청은 반대로 "배열 순서 = sort_order"라, 화면에서는 항상 sort_order로 정렬해두고
// 그 순서를 그대로 다시 보내면 노출 순서가 유지된다.
export const bySortOrder = (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)

// 원본 배열을 건드리지 않고 sort_order 순 사본을 만든다
export const sortBySortOrder = (list) => [...(list ?? [])].sort(bySortOrder)

// tags(객체 배열) -> 에디터가 쓰는 키워드 문자열 배열
export const toKeywords = (tags) => sortBySortOrder(tags).map((tag) => tag.keyword)
