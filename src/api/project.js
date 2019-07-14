import AXIOS from '@/utils/request'
//获取项目列表
export function getProjects() {
    return AXIOS.get('/projects/projects/')
}