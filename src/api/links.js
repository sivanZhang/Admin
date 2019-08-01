import AXIOS from '@/utils/request'
//获取环节
export function getLinks(params) {
    return AXIOS.get('links/links/', {
        params
    })
}
//创建环节
export function addLinks(data) {
    return AXIOS.post('/links/links/', data)
}