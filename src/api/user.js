import AXIOS from '@/utils/request'

export function login(data) {
    return AXIOS.post('/users/login/?json',data)
}

export function getInfo(token) {
    return AXIOS({
        url: '/user/info',
        method: 'get',
        params: { token }
    })
}

export function logout() {
    return AXIOS({
        url: '/user/logout',
        method: 'post'
    })
}