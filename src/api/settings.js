import AXIOS from '@/utils/request'
//获取部门列表 或者 信息
export function getDept(params) {
  return AXIOS.get('/users/emailscode/', { params })
}
//添加部门
export function addDept(data) {
  return AXIOS.post('/dept/dept/', data)
}
//删除
export function removeDept(data) {
  return AXIOS.post('/dept/dept/?delete', data)
}
//修改
export function putDept(data) {
  return AXIOS.post('/dept/dept/?01', data)
}