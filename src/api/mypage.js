import { apiClient } from './client'

export const getMyLanterns = () => apiClient.get('/api/me/lanterns')
export const getMyCoupons = () => apiClient.get('/api/me/coupons')
