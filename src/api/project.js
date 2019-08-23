import AXIOS from '@/utils/request'
//获取项目列表
export function getProjects() {
    return AXIOS.get('/projects/projects/')
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
export function getMyProject(params){
    return AXIOS.get('/projects/projects/?mine',{params})
}
//获取项目详情
export function projectDetail(params){
    return AXIOS.get('/projects/projects/?id=7',{params})
}
//添加/删除项目参与的工种
export function projectProfession(data){
    return AXIOS.post('/projects/projects/?method=put',data)
}