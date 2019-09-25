//统计相关http API

import AXIOS from '@/utils/request'
//获取项目进度统计
export function getProjectStatistic(params) {
    return AXIOS.get('/statistic/project/', {
        params
    })
}
//获取资产状态统计
export function getAssetStatistic(params) {
    return AXIOS.get('/statistic/asset/', {
        params
    })
}
//获取任务状态统计
export function getTaskStatistic(params) {
    return AXIOS.get('/statistic/task/', {
        params
    })
}