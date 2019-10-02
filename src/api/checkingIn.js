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
//加班申请提交审核
export function postApply(data) {
    return AXIOS.post('/overtime/submit/', data)
}
//删除加班申请
export function deleteApply(data) {
    return AXIOS.post('/overtime/overtime/?delete', data)
}
//修改加班申请
export function putApply(data) {
    return AXIOS.post('/overtime/overtime/?put', data)
}
//获取加班申请审批列表
export function getApprove(params) {
    return AXIOS.get('/overtime/submit/', {
        params
    })
}
//提交加班申请的审批
export function postApprove(data) {
    return AXIOS.post('/overtime/approve/', data)
}