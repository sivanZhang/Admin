import AXIOS from '@/utils/request'
//获取加班申请列表
export function getOvertime(params) {
    return AXIOS.get('/overtime/overtime/', {
        params
    })
}
//提交加班申请
export function postOvertime(data) {
    return AXIOS.post('/overtime/overtime/', data)
}