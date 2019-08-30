import AXIOS from '@/utils/request'
/**
 * 截图
 * @param {} params 
 */
export function drawImage(params = null) {
    return AXIOS.get('http://tl.chidict.com:8081/video/', {
        params,
        headers: {
            1: 111
        }
    })
}
//我的待审批任务
export function getApprove(params = null) {
    return AXIOS.get('/approve/approve/', {
        params
    })
}
//提交审核
export function postApprove(data) {
    return AXIOS.post('/approve/approve/', data)
}
//获取审核备注列表/approve/approve/
export function getApproveRemark(params) {
    return AXIOS.get('/approve/approve/approve_result/', { params })
}