//字符形式的头像 格式化保留前一位
export function avatarFormat(text) {
    return `${text}`.substring(0, 1);
}
//时间戳格式化为 yyyy/dd/mm
export function dateFormat(date) {
    if (date) {
        const TIME = new Date(date * 1000)

        function add0(val) {
            if (val < 10) {
                return `0${val}`
            } else {
                return val
            }
        }
        let [dd, mm] = [add0(TIME.getDate()),
            add0(TIME.getMonth() + 1)
        ]

        return `${TIME.getFullYear()}/${mm}/${dd}`
    } else {
        return '-'
    }
}
//时间戳格式化为 yyyy/dd/mm hh:mm:ss
export function dateTimeFormat(date) {
    if (date) {
        const TIME = new Date(date * 1000)

        function add0(val) {
            if (val < 10) {
                return `0${val}`
            } else {
                return val
            }
        }
        let [dd, mm, MM, hh,ss] = [add0(TIME.getDate()),
            add0(TIME.getMonth() + 1),
            add0(TIME.getMinutes()),
            add0(TIME.getHours()),
            add0(TIME.getSeconds()),
        ]

        return `${TIME.getFullYear()}/${mm}/${dd} ${hh}:${MM}:${ss}`
    } else {
        return '-'
    }
}
//项目工作流格式化
export function projectStatus(code) {
    switch (code) {
        case 0:
            return '未开始'
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
            return '暂停'
            break
    }
}
//数字保留两位小数并且格式化
export function numberFormat(num) {
    return (+num).toLocaleString(undefined, {
        maximumFractionDigits: 2
    })
}
//资产优先级
export function Priority(priority) {
    switch (priority) {
        case 0:
            return '正常'
            break
        case 1:
            return '优先'
            break
    }
}
//难度等级
export function Level(level) {
    switch (level) {
        case 0:
            return '简单'
            break
        case 1:
            return '标准'
            break
        case 2:
            return '复杂'
            break
        case 3:
            return '高难度'
            break
    }
}
//通知是否已读
export function isRead(data) {
    switch (data) {
        case 0:
            return '未读'
            break
        case 1:
            return '已读'
            break
    }
}
//通知的紧急程度
export function urgencyLevel(data) {
    switch (data) {
        case 0:
            return '一般'
            break
        case 1:
            return '紧急'
            break
        case 2:
            return '特急'
            break

    }
}
//审批流程等级
export function WKLevel(data) {
    switch (data) {
        case 0:
            return '收文'
            break
        case 1:
            return '一级审批'
            break
        case 2:
            return '二级审批'
            break
        case 3:
            return '三级审批'
            break

    }
}
//任务状态
export function taskStatus(data) {
    switch (data) {
        case 0:
            return '未开始'
            break
        case 1:
            return '已启动'
            break
        case 2:
            return '结束'
            break
        case 3:
            return '任务超时'
            break

    }
}