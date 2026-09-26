import search from '../../../../assets/map/search.svg'
import searchDay from '../../../../assets/map/search-day.svg'
import { useMapContext } from '../../context/MapProvider'

export default function SearchIcon() {
  const { timeOfDay } = useMapContext()
  return <img src={timeOfDay === 'night' ? search : searchDay} alt="" width="24" height="24" />
}
