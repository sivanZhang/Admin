import AXIOS from '@/utils/request'
//获取练习项目
export function getTrainingProject(params){
    return AXIOS.get('/projects/training_projects/',{params})
}

// 获取项目参与人员（练习项目的练习生）
export function getProjectJoinMeb(params) {
    return AXIOS.get('/projects/stat/', { params })
}

//创建阶段
export function createGroup(data){
    return AXIOS.post('/assets/group/',data)
}
//删除阶段
export function removeGroup(data){
    return AXIOS.post('/assets/group/?delete',data)
}
//修改阶段
export function putGroup(data){
    return AXIOS.post('/assets/group/?put',data)
}
//获取阶段列表
export function getGroup(params){
    return AXIOS.get('/assets/group/',{params})
}
//获取所有项目下所有资产
export function allScene(params){
    return AXIOS.get('/assets/assets/?10',{params})
}
//查询实习成员成绩权重
export function getRecord(params){
    return AXIOS.get('/projects/scoreconfig/',{params})
}
//新建实习成员成绩权重
export function setRecord(data){
    return AXIOS.post('/projects/scoreconfig/',data)
}
//删除实习成员成绩权重
export function removeRecord(data){
    return AXIOS.post('/projects/scoreconfig/',data)
}