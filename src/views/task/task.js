import {
    queryMyTask,
    addTaskRecord,
    putTaskRecord,
    queryTaskRecord,
    queryTask
} from "@/api/task";
import draggable from "vuedraggable"
import top from './components/top'
import taskForm from './components/task-form'
import tabLog from "./components/tab-log"
import tabTaskDtail from "./components/tab-task-detail"
export default {
    components: {
        draggable,
        top,
        taskForm,
        tabLog,
        tabTaskDtail
    },
    data() {
        return {
            TaskDetail: {
                name: ''
            },
            detailLoading: false,
            logsLoading: false,
            LogList: [],
            isDrag: false,
            isDrawerShow: false,
            StatusList: [{
                    label: '草稿',
                    value: 0
                },
                {
                    label: '正在进行',
                    value: 1
                },
                {
                    label: '已完成',
                    value: 2
                },
                {
                    label: '超期',
                    value: 3
                },
                {
                    label: '暂停',
                    value: 4
                }
            ],
            createLoading: false,
            TaskRecord: [],
            isDialogShow: false,
            MyTaskList: [],
            DraftArr: [],
            InProgressArr: [],
            TimeOutArr: [],
            FinishedArr: [],
            PauseArr: [],
            taskList: [{
                value: "1",
                label: "任何项目"
            }],
            taskProgress: [{
                    value: "1",
                    label: "任何备注"
                },
                {
                    value: "2",
                    label: "已完成"
                },
                {
                    value: "3",
                    label: "未完成"
                }
            ],
            typeList: [{
                    value: "1",
                    label: "任何类型"
                },
                {
                    value: "2",
                    label: "备注"
                },
                {
                    value: "3",
                    label: "资产上传"
                },
                {
                    value: "4",
                    label: "状态更改"
                },
                {
                    value: "5",
                    label: "任务分配"
                }
            ],
            taskTime: [{
                    value: "1",
                    label: "昨天"
                },
                {
                    value: "2",
                    label: "上星期"
                },
                {
                    value: "3",
                    label: "最近一个月"
                }
            ],
            options: [{
                    value: "1",
                    label: "截止时间"
                },
                {
                    value: "2",
                    label: "项目"
                },
                {
                    value: "3",
                    label: "状态"
                },
                {
                    value: "4",
                    label: "父级"
                },
                {
                    value: "5",
                    label: "优先级"
                }
            ],
            value1: [],
            value2: [],
            value3: [],
            value4: [],
            taskAvailableSel: [],
            notStartedSel: [],
            inProgressSel: [],
            doneSel: [],
            taskListSortSel: [],
            taskListProgramSel: [],
            taskListProgressSel: [],
            checked: false,
        };
    },
    methods: {
        //表格中的快捷下拉切换任务状态
        statusChange(status, row) {
            let loading = this.$loading({
                fullscreen: true
            });
            putTaskRecord({
                method: 'put',
                id: row.id,
                status
            }).then(({
                data
            }) => {
                loading.close()
                if (data.status === 0) {
                    row.status = status
                    this.$message.success(data.msg)
                    this.resetTasks()
                } else {
                    this.$message.warning(data.msg)
                }
            }).catch(err => {
                loading.close()
            })
        },
        checkMove() {
            return false
        },
        handelChanged(e) {
            const self = this
            if (e.to.dataset.arr === e.from.dataset.arr) {
                return false
            }
            let status
            switch (e.to.dataset.arr) {
                case 'DraftArr':
                    status = 0
                    break;
                case 'InProgressArr':
                    status = 1
                    break;
                case 'FinishedArr':
                    status = 2
                    break;
                case 'TimeOutArr':
                    status = 3
                    break;
                case 'PauseArr':
                    status = 4
                    break;
            }
            let loading = this.$loading({
                fullscreen: true
            });
            putTaskRecord({
                method: 'put',
                id: e.item.dataset.taskid,
                status
            }).then(({
                data
            }) => {
                loading.close()
                if (data.status === 0) {
                    this[e.to.dataset.arr][e.newIndex]['status'] = status
                    self.resetTasks()
                    this.$message.success(data.msg)
                } else {
                    this.$message.warning(data.msg)
                }
            }).catch(err => {
                loading.close()
                self.resetTasks()
            })
        },
        cancel() {
            this.isDialogShow = false;
        },
        openDialog(obj) {
            this.isDialogShow = true;
            this.TaskRecord = Object.assign({}, {
                task_id: obj.id,
                type: 0
            });

        },
        addRecord() {
            this.createLoading = true;
            addTaskRecord(this.TaskRecord)
                .then(res => {
                    if (res.data.status === 0) {
                        this.$message.success(res.data.msg);
                        this.getMyTasks()
                    } else {
                        this.$message.warning(res.data.msg);
                    }
                    this.isDialogShow = false
                    this.createLoading = false;
                })
                .catch(err => {
                    this.createLoading = false;
                });
        },
        //是否显示任务板右侧
        taskBoardRightShow(row) {
            this.isDrawerShow = true
            this.TaskRecord = Object.assign({}, {
                task_id: row.id,
                type: 0
            });
            this.logsLoading = true
            queryTaskRecord({
                task_id: row.id,
            }).then(({
                data
            }) => {
                this.LogList = [...data.msg]
                this.logsLoading = false
            }).catch(() => {
                this.logsLoading = false
            })
            this.detailLoading = true
            queryTask({
                id: row.id,
            }).then(({
                data
            }) => {
                this.TaskDetail = {
                    ...data.msg
                }
                this.detailLoading = false
            }).catch(() => {
                this.detailLoading = false
            })
        },
        //http获取‘我的任务’
        async getMyTasks() {
            await queryMyTask({
                user: this.$store.state.login.userInfo.id
            }).then(({
                data
            }) => {
                [...data.msg].forEach(item => {
                        this.MyTaskList.push(item.task)
                    })
                    /* this.MyTaskList = [...data.msg]; */
                this.resetTasks()
            });

        },
        resetTasks() {
            this.DraftArr = []
            this.InProgressArr = []
            this.FinishedArr = []
            this.TimeOutArr = []
            this.PauseArr = []
            this.MyTaskList.forEach(item => {
                switch (item.status) {
                    case 0:
                        this.DraftArr.push(item);
                        break;
                    case 1:
                        this.InProgressArr.push(item);
                        break;
                    case 2:
                        this.FinishedArr.push(item);
                        break;
                    case 3:
                        this.TimeOutArr.push(item);
                        break;
                    case 4:
                        this.PauseArr.push(item);
                        break;
                }
            });
        }
    },
    computed: {
        topArr() {
            return [{
                    title: '所有任务',
                    num: this.MyTaskList.length
                },
                {
                    title: '草稿',
                    num: this.DraftArr.length
                },
                {
                    title: '进行中',
                    num: this.InProgressArr.length
                },
                {
                    title: '完成',
                    num: this.FinishedArr.length
                },
                {
                    title: '超时',
                    num: this.TimeOutArr.length
                },
                {
                    title: '暂停',
                    num: this.PauseArr.length
                }
            ]
        }
    },
    created() {
        this.getMyTasks();
    },
};