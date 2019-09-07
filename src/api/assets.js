import AXIOS from '@/utils/request'
//获取资产列表（搜索）
// export function getAssets() {
//     return AXIOS.get('/assets/assets/')
// }
//删除资产
export function deleteAssets(data) {
    return AXIOS.post('/assets/assets/?delete', {
        ...data,
        method: 'delete'
    })
}
//创建资产
export function postAssets(data) {
    return AXIOS.post('/assets/assets/', data)
}
//获取资产
export function queryAssets(params) {
    return AXIOS.get('/assets/assets/?01', {
        params
    })
}
//修改资产
export function editAssets(data) {
    return AXIOS.post('/assets/assets/?put', data)
}
//导入资产列表
export function uploadAssets(data) {
    return AXIOS.post('/assets/batch/', data, {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        transformRequest: [params => {
            return JSON.stringify(params)
        }]
    })
}
//后端解析excel
export function parseExcel(data) {
    return AXIOS.post('/excel/excel/', data, {
        transformRequest: [data => {
            return data;
        }],

        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}