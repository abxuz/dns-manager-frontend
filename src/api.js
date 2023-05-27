import axios from "axios";
import { message } from 'antd'

const http = axios.create({
    withCredentials: true,
    timeout: 3000
})

const responseDataHandler = response => {
    const data = response.data
    if (!data || typeof (data) == 'string') {
        message.error('请求失败，请重试')
        return Promise.resolve(false)
    }
    if (data.errmsg) {
        message.error(data.errmsg)
    }
    if (data.redirect) {
        window.location.href = data.redirect
    }
    if (data.errno === 0) {
        return Promise.resolve(data.data ? data.data : true)
    }
    return Promise.resolve(false)
}

const responseErrorHandler = e => {
    message.error('请求失败，请重试[' + e.message + ']')
    return Promise.resolve(false)
}

http.interceptors.response.use(responseDataHandler, responseErrorHandler);

const API_BASE = '/api/v1'
const api = {
    domain: {
        async list() {
            return http.get(API_BASE + '/domain')
        },
        record: {
            async add(domain, v) {
                return http.post(API_BASE + '/domain/' + encodeURIComponent(domain) + '/record', v)
            },
            async delete(domain, id) {
                return http.delete(API_BASE + '/domain/' + encodeURIComponent(domain) + '/record/' + encodeURIComponent(id))
            },
            async update(domain, v) {
                return http.patch(API_BASE + '/domain/' + encodeURIComponent(domain) + '/record', v)
            },
            async list(domain, pageNumber, pageSize) {
                return http.get(API_BASE + '/domain/' + encodeURIComponent(domain) + '/record?pageNumber=' + pageNumber + "&pageSize=" + pageSize)
            },
            async get(domain, id) {
                return http.get(API_BASE + '/domain/' + encodeURIComponent(domain) + '/record/' + encodeURIComponent(id))
            },
        }
    },
}

export default api