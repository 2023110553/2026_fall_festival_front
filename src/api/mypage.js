import { apiClient } from './client'

export const getMyLanterns = () => apiClient.get('/api/me/lanterns')
