export default {
  // 图片地址
  BASE_URL: process.env.NODE_ENV === 'development' ? 'http://tl.chidict.com:8081/' : `${location.origin}/`,
  // 是否设置了basURL
  hasSetUrl: false
}
