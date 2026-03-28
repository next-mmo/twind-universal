import { getRouteApi } from '@tanstack/react-router'

export const todoListRouteApi = getRouteApi('/')
export const todoDetailRouteApi = getRouteApi('/todo/$id')
export const todoStatsRouteApi = getRouteApi('/todo/stats')
