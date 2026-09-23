import { useState } from 'react'
import { useTranslation } from '../../../i18n/useTranslation'
import toggleArrowIcon from '../../../assets/info/collab-toggle-arrow.svg'
import * as S from './CollabList.styles'

function CollabSection({ title, items, initialVisibleCount, onSelect }) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const visibleItems = expanded ? items : items.slice(0, initialVisibleCount)

  return (
    <S.Section>
      <S.Heading>
        <h2>{title}</h2>
        <span>{t('collab.count', { count: items.length })}</span>
      </S.Heading>
      <S.List>
        {visibleItems.map((item) => (
          <S.Card key={item.id} type="button" onClick={() => onSelect(item.id)}>
            <S.Thumbnail>
              {item.imageUrl && <img src={item.imageUrl} alt="" />}
            </S.Thumbnail>
            <S.Body>
              <strong>{item.name}</strong>
              <span>{item.description}</span>
            </S.Body>
            <S.Chevron>›</S.Chevron>
          </S.Card>
        ))}
      </S.List>
      {items.length > initialVisibleCount && (
        <S.More
          type="button"
          $expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
        >
          <span>{t(expanded ? 'collab.collapse' : 'collab.expand')}</span>
          <S.MoreArrow
            src={toggleArrowIcon}
            $expanded={expanded}
            alt=""
            aria-hidden="true"
          />
        </S.More>
      )}
    </S.Section>
  )
}

export default function CollabList({
  collabs = [],
  booths = [],
  onSelect,
  onSelectBooth,
}) {
  const { t } = useTranslation()

  return (
    <S.Stack>
      <CollabSection
        title={t('collab.organizations')}
        items={collabs}
        initialVisibleCount={3}
        onSelect={onSelect}
      />
      <CollabSection
        title={t('collab.booths')}
        items={booths}
        initialVisibleCount={2}
        onSelect={onSelectBooth}
      />
    </S.Stack>
  )
}
