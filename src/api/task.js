import AXIOS from '@/utils/request'
//获取任务执行记录
export function queryTaskLogs() {
    return AXIOS.get('/task/taskrecord')
}
//新建任务执行记录
export function addTaskLogs(data) {
    return AXIOS.post('/task/taskrecord', data)
}
//新建任务执行记录
export function addTask(data) {
    return AXIOS.post('/task/task/', data)
}
//获取任务或者详情
export function queryTask(params = null) {
    return AXIOS.get('/task/task/', { params })
}
//删除任务
export function deleteTask(id) {
    return AXIOS.post('/task/task/?delete', { id, method: 'delete' })
}
//修改任务
export function putTask(data) {
    return AXIOS.post('/task/task/?01', data)
}
//获取我的任务
export function queryMyTask(params) {
    return AXIOS.get('/task/task/?mytask', { params })
}
//查询任务执行记录
export function queryTaskRecord(params) {
    return AXIOS.get('/task/taskrecord/', { params })
}
//新建执行记录
export function addTaskRecord(data) {
    return AXIOS.post('/task/taskrecord/', data)
}
//修改执行记录
export function putTaskRecord(data) {
    return AXIOS.post('/task/task/?status', data)
}