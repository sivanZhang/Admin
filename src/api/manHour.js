import AXIOS from '@/utils/request'
//获取环节
export function getLinks(params) {
    return AXIOS.get('/overtime/workhour/', {
        params
    })
}