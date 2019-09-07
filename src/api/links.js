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
    })
}
//通过link_id查询制作环节
export function getLink(params) {
    return AXIOS.get('/links/links/?link=1', { params })
}
//修改制作环节
export function updateLink(data) {
    return AXIOS.post('/links/links/', data, {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        transformRequest: [data => {
            return JSON.stringify(data)
        }],
    })
}
//删除制作环节
export function delLink(data) {
    return AXIOS.post('/links/links/', data)
}