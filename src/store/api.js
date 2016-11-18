import Vue from 'vue'
import axios from 'axios'

export const fetchLatest = () => {
  return axios.get('/latest')
}

export const fetchHistory = dtime => {
  return axios.get(`/day/${dtime}`)
}

export const fetchArticle = aid => {
  return axios.get(`/article/${aid}`)
}

export const fetchComments = aid => {
  return axios.get(`/article/${aid}/comments`)
}

export const fetchAPIComments = aid => {
  return axios.get(`/article/${aid}/comments/api`)
}