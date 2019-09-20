import {
    queryMyTask,
    addTaskRecord,
    putTaskRecord,
    queryTaskRecord,
    queryTask,
    getStatusTaskList
} from "@/api/task";
import draggable from "vuedraggable"
import taskForm from './components/task-form'
import tabLog from "./components/tab-log"
import tabApprove from "./components/tab-approve"
import tabTaskDtail from "./components/tab-task-detail"
import approveLog from "@/views/video/components/approve-log";
export default {
    components: {
        draggable,
        tabApprove,
        taskForm,
        tabLog,
        tabTaskDtail,
        approveLog
    },
    data() {
        return {
            activeTab: "second",
            TaskDetail: {
                name: ''
            },
            detailLoading: false,
            logsLoading: false,
            LogList: [],
            isDrag: false,
            isDrawerShow: false,
            StatusList: [{
                    label: '暂停',
                    value: 0
                },
                {
                    label: '未开始',
                    value: 1
                },
                {
                    label: '进行中',
                    value: 2
                },
                
               
                
            ],
            createLoading: false,
            TaskRecord: [],
            isDialogShow: false,
            MyTaskList: [],
            MyTaskList1: [],
            DraftArr: [],
            InProgressArr: [],
            TimeOutArr: [],
            FinishedArr: [],
            PauseArr: [],
            // PassArr : [],
            ApproveingArr:[],
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
           
           
            changecolor: 1,
            activeRow: {},//点击任务列表选中的列的数据
        };
    },
    methods: {
        //点击筛选任务
        task(status) {
            this.changecolor = status;
            getStatusTaskList({
                mytask: null,
                status: status
            }).then(({ data }) => {
                this.MyTaskList1 = [...data.msg];
            })

        },
        //表格中的快捷下拉切换任务状态
        statusChange(status, row) {
          //  console.log('row', row);

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
                    if(status === 0){
                        status = "暂停";
                    }
                    if(status === 1){
                        status = "未开始";
                    }
                    if(status === 2){
                        status = "进行中";
                    }
                    
                    this.$message.success("任务"+row.task.id+"状态已更改为："+status);
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
                case 'PauseArr':
                    status = 0
                    break;
                case 'DraftArr':
                    status = 1
                    break;
                case 'InProgressArr':
                    status = 2
                    break;
                case 'ApproveingArr':
                    status = 3
                    break;
                case 'FinishedArr':
                    status = 4
                    break;
                case 'TimeOutArr':
                    status = 5
                    break;
                // case 'PassArr':
                //     status = 6
                //     break;
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
                        this.isDialogShow = false;
                        this.createLoading = false;
                        this.isDrawerShow = false;
                    })
                    .catch(err => {
                        this.createLoading = false;
                    });
            
        },
        //是否显示任务板右侧
        taskBoardRightShow(row) {
            this.isDrawerShow = true;
            
            this.activeRow = {...row };
            this.TaskRecord = Object.assign({}, {
                task_id: row.task.id,
                type: 0
            });
            this.logsLoading = true;
            this.$refs['taskApprovelog'].getApproveLog(row.task.id);
            queryTaskRecord({
                task_id: row.task.id,
            }).then(({
                data
            }) => {
                this.LogList = [...data.msg];
                this.logsLoading = false;
            }).catch(() => {
                this.logsLoading = false;
            });
            this.detailLoading = true;
            queryTask({
                id: row.task.id,
            }).then(({
                data
            }) => {
                this.TaskDetail = {
                    ...data.msg
                }
                this.detailLoading = false;
            }).catch(() => {
                this.detailLoading = false;
            });
            
            
        },
        //http获取‘我的任务’
        async getMyTasks() {
            await getStatusTaskList({
                mytask: null,
                
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
            //暂停 0
            this.PauseArr = []
            //未开始 1
            this.DraftArr = []
            //进行中 2
            this.InProgressArr = []
            //审核中 3
            this.ApproveingArr = []
            //完成 4
            this.FinishedArr = []
            //超时 5
            this.TimeOutArr = []
            //审核通过 6
            // this.PassArr = []
            this.MyTaskList.forEach(item => {
                switch (item.task.status) {
                    case 0:
                        this.PauseArr.push(item.task);
                        break;
                    case 1:
                        this.DraftArr.push(item.task);
                        break;
                    case 2:
                        this.InProgressArr.push(item.task);
                        break;
                    case 3:
                        this.ApproveingArr.push(item.task);
                        break;
                    case 4:
                        this.FinishedArr.push(item.task);
                        break;
                    case 5:
                        this.TimeOutArr.push(item.task);
                    // case 6:
                    //     this.PassArr.push(item.task);
                }
            });
        }
    },
    computed: {
        topArr() {
            return [{
                    title: '所有任务',
                    status: null,
                    num: this.MyTaskList.length
                },
                {
                    title: '暂停',
                    status: 0,
                    num: this.PauseArr.length
                },
                {
                    title: '未开始',
                    status: 1,
                    num: this.DraftArr.length
                },
                {
                    title: '进行中',
                    status: 2,
                    num: this.InProgressArr.length
                },
                {
                    title: '审核中',
                    status: 3,
                    num: this.ApproveingArr.length
                },
                {
                    title: '完成',
                    status: 4,
                    num: this.FinishedArr.length
                },
                {
                    title: '超时',
                    status: 5,
                    num: this.TimeOutArr.length
                },
                // {
                //     title: '审核通过',
                //     status: 6,
                //     num: this.PassArr.length
                // }
            ]
        }
    },
    created() {
        this.getMyTasks();
        this.task(2);
    },
};