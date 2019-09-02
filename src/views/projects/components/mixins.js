import { mapState } from "vuex";
export default {
    computed: {
        ...mapState("admin", ["UserList"])
    },
    data() {
        return {
            rules: {
                name: [{
                    required: true,
                    message: "请输入任务名称",
                    trigger: "blur"
                }],
                priority: [{
                    required: true,
                    message: "请输入优先等级",
                    trigger: "blur"
                }],
                content: [{
                    required: true,
                    message: "请输入任务内容",
                    trigger: "blur"
                }],
                executorlist: [{
                    required: true,
                    message: "请输入任务执行人",
                    trigger: "blur"
                }],
                total_hour: [{
                    required: true,
                    message: "请输入总工时",
                    trigger: "blur"
                }],
                datetime: [{
                    required: true,
                    message: "请输入任务时间",
                    trigger: "blur"
                }]
            },
            TaskForm: {},
            StatusList: [{
                    label: "未开始",
                    value: 0
                },
                {
                    label: "已启动",
                    value: 1
                },
                {
                    label: "结束",
                    value: 2
                },
                {
                    label: "任务超时",
                    value: 3
                }
            ],
        }
    },
}