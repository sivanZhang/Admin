import AXIOS from '@/utils/request'
//获取资产列表（搜索）
export function getAssets() {
    return AXIOS.get('/assets/assets/')
}
export function deleteAssets(data) {
    return AXIOS.post('/assets/assets/?delete', {...data, method: 'delete' })
}
//创建资产
export function postAssets(data) {
    return AXIOS.post('/assets/assets/', data)
}
//获取资产
export function queryAssets(params) {
    return AXIOS.get('/assets/assets/?01', { params })
}