import AXIOS from '@/utils/request'
//获取部门列表 或者 信息
export function getDept() {
    return AXIOS.get('/dept/dept/')
}
//添加部门
export function addDept(data) {
    return AXIOS.post('/dept/dept/', data)
}
//删除
export function removeDept(data) {
    return AXIOS.post('/dept/dept/?delete', data)
}
//部门信息修改
export function putDept(data) {
    return AXIOS.post('/dept/dept/?01', data)
}
//获取用户列表
export function getUserList() {
    return AXIOS.get('/users/list/')
}