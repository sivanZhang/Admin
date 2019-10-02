import AXIOS from '@/utils/request'
//获取环节
export function getOvertime(params) {
    return AXIOS.get('/overtime/overtime/', {
        params
    })
}