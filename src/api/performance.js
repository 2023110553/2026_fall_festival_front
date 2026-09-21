import { apiClient } from './client'

export const getPerformances = (date) => apiClient.get('/api/performances/', { params: { date } })
export const getPerformanceDetail = (performanceId) => apiClient.get(`/api/performances/${performanceId}/`)
export const getNowPerformances = () =>
    apiClient.get('/api/performances/now/')
