import {
    queryMyTask,
    addTaskRecord,
    putTaskRecord,
    queryTaskRecord
} from "@/api/task";
import draggable from "vuedraggable";
import top from './components/top'
import taskForm from './components/task-form'
export default {
    components: {
        draggable,
        top,
        taskForm
    },
    data() {
        return {
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
            checked: false
        };
    },
    methods: {
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
                } else {
                    this.$message.warning(data.msg)
                }
            }).catch(err => {
                loading.close()
            })
        },
        setData(dataTransfer) {
            // to avoid Firefox bug
            dataTransfer.setData("Text", "");
        },
        checkMove(e) {
            console.log(e);
            return false;

            /* console.log(e); */

            /* if (e.draggedContext.element.status !== e.relatedContext.element.status) {
                let loading = this.$loading({
                    fullscreen: true
                });
                putTaskRecord({
                    method: 'put',
                    id: e.draggedContext.element.id,
                    status: e.relatedContext.element.status,
                }).then(({
                    data
                }) => {
                    loading.close()
                    if (data.status === 0) {
                        e.draggedContext.element.status = e.relatedContext.element.status
                        this.$message.success(data.msg)
                    } else {
                        this.$message.warning(data.msg).
                        e.returnValue = false
                    }
                    this.getMyTasks()
                }).catch(err => {
                    this.$message.error(data.msg)
                    loading.close()
                    e.returnValue = false
                })
            } else {
                return false
            } */
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
        },
        //http获取‘我的任务’
        async getMyTasks() {
            this.DraftArr = []
            this.InProgressArr = []
            this.FinishedArr = []
            this.TimeOutArr = []
            this.PauseArr = []
            await queryMyTask({
                user: this.$store.state.login.userInfo.id
            }).then(({
                data
            }) => {
                this.MyTaskList = [...data.msg];
            });
            this.DraftArr['status'] = 0
            this.InProgressArr['status'] = 1
            this.FinishedArr['status'] = 2
            this.TimeOutArr['status'] = 3
            this.PauseArr['status'] = 4
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
    }
};