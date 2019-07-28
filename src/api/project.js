import AXIOS from '@/utils/request'
//获取项目列表
export function getProjects() {
    return AXIOS.get('/projects/projects/')
}
//创建项目/projects/projects/
export function addProjects(data) {
    return AXIOS.post('/projects/projects/', data)
}