
//字符形式的头像 格式化保留前一位
export function avatarFormat(text) {
  return `${text}`.substring(0, 1);
}
//时间戳格式化为 yyyy/dd/mm
export function dateFormat(date) {
  return new Date(date).toLocaleDateString();
}
//项目工作流格式化
export function projectStatus(code) {
  switch (code) {
    case 0:
      return '草稿'
      break
    case 1:
      return '正在进行'
      break
    case 2:
      return '已完成'
      break
    case 3:
      return '超期'
      break
    case 4:
      return '重启'
      break
  }
}
//数字保留两位小数并且格式化
export function numberFormat(num) {
    return (+num).toLocaleString(undefined, { maximumFractionDigits: 2 })
}