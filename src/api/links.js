import AXIOS from '@/utils/request'
import QS from 'qs'
//获取环节
export function getLinks(params) {
    return AXIOS.get('/links/links/', {
        params
    })
}
//创建环节
export function addLinks(data) {
    return AXIOS.post('/links/links/', data, {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        transformRequest: [data => {
            return JSON.stringify(data)
        }],
        timeout: 10000,
    })
}