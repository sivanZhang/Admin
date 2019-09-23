import AXIOS from '@/utils/request'
//获取项目列表或者项目详情
export function getProjects(params = null) {
    return AXIOS.get('/projects/projects/', { params })
}
//创建项目
export function addProjects(data) {
    return AXIOS.post('/projects/projects/', data)
}
//编辑项目
export function putProjects(data) {
    return AXIOS.post('/projects/projects/?01', data)
}
//我的项目
export function getMyProject(params) {
    return AXIOS.get('/projects/projects/?mine', { params })
}
//添加/删除项目参与的工种
export function projectProfession(data) {
    return AXIOS.post('/projects/projects/?method=put', data)
}
//删除项目
export function delOneProject(data) {
    return AXIOS.post('/projects/projects/?delete', data)
}