import {
    queryMyTask,
    addTaskRecord,
    putTaskRecord,
    queryTaskRecord,
    queryTask
} from "@/api/task";
import draggable from "vuedraggable"

import taskForm from './components/task-form'
import tabLog from "./components/tab-log"
import tabTaskDtail from "./components/tab-task-detail"
import {getStatusTaskList} from "@/api/task"
export default {
    components: {
        draggable,
        
        taskForm,
        tabLog,
        tabTaskDtail
    },
    data() {
        return {
            activeTab:"second",
            TaskDetail: {
                name: ''
            },
            detailLoading: false,
            logsLoading: false,
            LogList: [],
            isDrag: false,
            isDrawerShow: false,
            StatusList: [{
                    label: '未开始',
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
                    label: '超时',
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
            MyTaskList1:[],
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
            end_date: null,
            time: Date.parse(new Date())/1000,
            changecolor:1
        };
    },
    methods: {
        //点击筛选任务
        task(status){
            this.changecolor=status;
            getStatusTaskList({
                mytask:null,
                status:status
            }).then(({data})=>{
                this.MyTaskList1 = [...data.msg];
            })
            
        },
        //表格中的快捷下拉切换任务状态
        statusChange(status, row) {
            console.log('row', row);

            let loading = this.$loading({
                fullscreen: true
            });
            putTaskRecord({
                method: 'put',
                id: row.task.id,
                status
            }).then(({
                data
            }) => {
                loading.close()
                if (data.status === 0) {
                    row.task.status = status
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
            if (this.end_date > this.time) {
                addTaskRecord(this.TaskRecord)
                    .then(res => {
                        if (res.data.status === 0) {
                            this.$message.success(res.data.msg);
                            this.getMyTasks()
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                        this.isDialogShow = false;
                        this.createLoading = false;
                        this.isDrawerShow = false;
                    })
                    .catch(err => {
                        this.createLoading = false;
                    });
            } else {
                this.$alert('此任务已超期，禁止提交执行记录。', '警告', {
                    confirmButtonText: '确定',
                    callback: action => {
                        
                    }
                });
                this.createLoading = false;
                this.isDrawerShow = false;
            }
        },
        //是否显示任务板右侧
        taskBoardRightShow(row) {
            this.isDrawerShow = true;
            this.end_date = row.task.end_date;
            this.TaskRecord = Object.assign({}, {
                task_id: row.task.id,
                type: 0
            });
            this.logsLoading = true
            queryTaskRecord({
                task_id: row.task.id,
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
                id: row.task.id,
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
                // [...data.msg].forEach(item => {
                //         this.MyTaskList.push(item.task)
                //     })
                this.MyTaskList = [...data.msg];
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
                switch (item.task.status) {
                    case 0:
                        this.DraftArr.push(item.task);
                        break;
                    case 1:
                        this.InProgressArr.push(item.task);
                        break;
                    case 2:
                        this.FinishedArr.push(item.task);
                        break;
                    case 3:
                        this.TimeOutArr.push(item.task);
                        break;
                    case 4:
                        this.PauseArr.push(item.task);
                        break;
                }
            });
        }
    },
    computed: {
        topArr() {
            return [{
                    title: '所有任务',
                    status:null,
                    num: this.MyTaskList.length
                },
                {
                    title: '未开始',
                    status:0,
                    num: this.DraftArr.length
                },
                {
                    title: '进行中',
                    status:1,
                    num: this.InProgressArr.length
                },
                {
                    title: '完成',
                    status:2,
                    num: this.FinishedArr.length
                },
                {
                    title: '超时',
                    status:3,
                    num: this.TimeOutArr.length
                },
                {
                    title: '暂停',
                    status:4,
                    num: this.PauseArr.length
                },
                {
                    title: '审核中',
                    status:5,
                    num: 0
                }
            ]
        }
    },
    created() {
        this.getMyTasks();
        this.task(1);
    },
};