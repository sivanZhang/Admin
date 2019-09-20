import AXIOS from '@/utils/request'
//获取工种列表 或者 信息
export function getDept(params) {
    return AXIOS.get('/dept/dept/', {
        params
    })
}
//查询属于该用户部门的所有用户信息
export function getDeptUsers(params) {
    return AXIOS.get('/dept/dept/?02', {
        params
    })
}

//添加工种
export function addDept(data) {
    return AXIOS.post('/dept/dept/', data)
}
//删除
export function removeDept(data) {
    return AXIOS.post('/dept/dept/?delete', data)
}
//工种信息修改
export function putDept(data) {
    return AXIOS.post('/dept/dept/?01', data)
}
//获取某工种下的审批模板列表
export function getWKTemplate(params) {
    return AXIOS.get('/wktemplate/wktemplate_v2/', {
        params
    })
}
//给某工种添加模板
export function addWKTemplate(params) {
    return AXIOS.post('/wktemplate/wktemplate_v2/', params, {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        transformRequest: [params => {
            return JSON.stringify(params)
        }]
    })
}
//给某工种修改模板 
export function updateWKTemplate(params) {
    return AXIOS.post('/wktemplate/wktemplate_v2/', params, {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        transformRequest: [data => {
            return JSON.stringify(data)
        }],
    })
}
//给某工种删除模板
export function deleteWKTemplate(params) {
    return AXIOS.post('/wktemplate/wktemplate_v2/', params)
}
//获取用户列表
export function getUserList(params) {
    return AXIOS.get('/users/list/', {
        params
    })
}
//修改用户信息
export function editUserDetail(params) {
    return AXIOS.post('/users/list/?put', params)
}
//获取用户管理权限
export function getUserPerfession() {
    return AXIOS.get('/users/list/?auth')
}
//角色列表
export function getRoles() {
    return AXIOS.get('/role/role/?list')
}
//通过id获取用户角色。或者通过角色id获取用户列表
export function getUsersRole(params) {
    return AXIOS.get('/role/role/', {
        params
    })
}
//获取客户角色列表
export function getClientList(params) {
    return AXIOS.get('/users/list/?client', {
        params
    })
}
//添加角色
export function addRole(data) {
    return AXIOS.post('/role/role/', data)
}
//修改角色/为角色绑定/解绑用户
export function updateRole(data) {
    return AXIOS.post('/role/role/?01', data)
}
//删除角色
export function removeRole(data) {
    data = {
        ...data,
        method: 'delete'
    }
    return AXIOS.post('/role/role/?delete', data)
}
//获取权限列表
export function permissions(params) {
    return AXIOS.get('/role/permissions/', {
        params
    })
}
//获取某个角色的权限列表
export function userPermissions(params) {
    return AXIOS.get('/role/permissions/?01', {
        params
    })
}
//用户批量导入
export function uploadUsers(data) {
    return AXIOS.post('/users/batch/', data, {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        transformRequest: [params => {
            return JSON.stringify(params)
        }]
    })
}