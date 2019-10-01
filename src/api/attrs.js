import AXIOS from '@/utils/request'
// 删除属性
export function delAttrs(data){
    return AXIOS.post('/attrs/attrs/?delete',data)
}
//修改属性实体
export function updateAttrsEntity(data){
    return AXIOS.post('/attrs/instance/?01',data)
}
//属性实体绑定(1.给类别绑定属性)
export function attrsEntityBind(data){
    return AXIOS.post('/attrs/bind/',data)
}
//修改属性
export function updateAttrs(data){
    return AXIOS.post('/attrs/attrs/?01',data)
}
//创建属性
export function createAttrs(data){
    return AXIOS.post('/attrs/attrs/',data)
}
// 获取属性列表
export function getAttrsList(){
    return AXIOS.get('/attrs/attrs/?list')
}
//属性实体解绑
export function  attrsEntityUnbind(data){
    return AXIOS.post('/attrs/bind/?delete',data)
}
//创建属性实体 
export function createAttrsEntity(data){
    return AXIOS.post('/attrs/instance/',data)
}
//获取属性信息
export function getAttrsInfo(params){
    return AXIOS.get('/attrs/attrs/',{params})
}
//获取属性实体列表
export function getAttrsEntityList(){
    return AXIOS.get('/attrs/instance/?list')
}
//删除属性实体
export function delAttrsEntity(data){
    return AXIOS.post('/attrs/instance/?delete',data)
}
//获取属性实体信息
export function getAttrsEntityInfo(params){
    return AXIOS.get('/attrs/instance/',{params})
}
//查询类别绑定属性（1.查询给类别绑定的属性）
export function searchBind(params){
    return AXIOS.get('/attrs/bind/',{params})
}