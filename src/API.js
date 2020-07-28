import axios from 'axios'

const baseURL = process.env.REACT_APP_API_BASE_URL
// const baseURL = 'http://localhost:3000'
const API = axios.create({
  baseURL
})

const placeTokenInRequestHeaders = req => {
  const token = localStorage.getItem('authToken')
  if (token) {
    req.headers['Authorization'] = `Bearer ${token}`
  }
  return req
}

API.interceptors.request.use(placeTokenInRequestHeaders);

export default API