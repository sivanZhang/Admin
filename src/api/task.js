import AXIOS from '@/utils/request'
//获取项目列表
export function queryTaskLogs() {
    return AXIOS.get('/task/taskrecord')
}
//新建任务执行记录
export function addTaskLogs(data) {
    return AXIOS.post('/task/taskrecord', data)
}
//新建任务执行记录
export function addTask(data) {
    return AXIOS.post('/task/task', data)
}
//获取任务
export function queryTask(params = null) {
    return AXIOS.get('/task/task', { params })
}
//删除任务
export function deleteTask(data) {
    return AXIOS.post('/task/task/?delete', data)
}
//修改任务
export function putTask(data) {
    return AXIOS.post('/task/task/?01', data)
}