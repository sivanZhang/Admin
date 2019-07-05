import AXIOS from '@/utils/request'

export function getList(params) {
  return AXIOS({
    url: '/table/list',
    method: 'get',
    params
  })
}
