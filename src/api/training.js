import AXIOS from '@/utils/request'
//获取实训项目
export function getTrainingProject(params){
    return AXIOS.get('/projects/training_projects/',{params})
}
