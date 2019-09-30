import AXIOS from '@/utils/request'
//获取实训项目
export function getTrainingProject(params){
    return AXIOS.get('/projects/training_projects/',{params})
}

// 获取项目参与人员（实训项目的实训生）
export function getProjectJoinMeb(params) {
    return AXIOS.get('/projects/stat/', { params })
}