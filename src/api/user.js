import AXIOS from '@/utils/request'

export function login(data) {
    return AXIOS.post('/users/login/?json', data)
}

export function getInfo(token) {
    return AXIOS({
        url: '/user/info',
        method: 'get',
        params: {
            token
        }
    })
}

export function logout() {
    return AXIOS({
        url: '/user/logout',
        method: 'post'
    })
}
//发送邮箱验证码   state = true为找回密码 ； 否则为申请账号
export function getEmailCode(email, state = false) {
    const params = {
        codetype: 1
    };
    return AXIOS.get('/users/emailscode/' + email, {
        params: state ? params : null
    })
}