import AXIOS from '@/utils/request'
/**
 * 截图
 * @param {} params 
 */
export function drawImage(params = null) {
    return AXIOS.get('http://tl.chidict.com:8081/video/', { params,headers:{1:111} })
}