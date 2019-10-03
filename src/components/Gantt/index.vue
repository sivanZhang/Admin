<style lang="scss">
.gantt-elastic__header-btn-recenter {
  padding: 6px 12px !important;
  font-size: 14px !important;
}
.gantt-elastic__task-list-header-label {
  text-align: left;
}
</style>
<template>
  <div>
    <gantt-elastic :options="options" :tasks="ganttData">
      <gantt-header slot="header" :options="defaultHeaderOption"></gantt-header>
    </gantt-elastic>
  </div>
</template>

<style>
</style>

<script>
import GanttElastic from "gantt-elastic";
import GanttHeader from "gantt-elastic-header";
import dayjs from "dayjs";
let defaultOptions = {
  //甘特图配置
  taskMapping: {
    progress: "percent"
  },
  maxRows: 100,
  maxHeight: 500,
  row: {
    height: 24
  },
  taskList: {
    //甘特图中的表格配置
    columns: [
      {
        id: 1,
        label: "工种名称",
        value: "label",
        width: 200
      },
      {
        id: 2,
        label: "开始时间",
        value: task => dayjs(task.start).format("YYYY-MM-DD"),
        width: 120,
        html: true
      },
      {
        id: 3,
        label: "结束时间",
        value: task => dayjs(task.end).format("YYYY-MM-DD"),
        width: 120
      }
    ]
  },
  locale: {
    name: "zh-cn",
    weekdays: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    months: [
      "01月",
      "02月",
      "03月",
      "04月",
      "05月",
      "06月",
      "07月",
      "08月",
      "09月",
      "10月",
      "11月",
      "12月"
    ]
  }
};
/* locale: {
      //locale的配置
      name: 'en',
      weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
      weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
      weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
      months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
      monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
      weekStart: 1,
      relativeTime: {
        future: 'in %s',
        past: '%s ago',
        s: 'a few seconds',
        m: 'a minute',
        mm: '%d minutes',
        h: 'an hour',
        hh: '%d hours',
        d: 'a day',
        dd: '%d days',
        M: 'a month',
        MM: '%d months',
        y: 'a year',
        yy: '%d years'
      },
      formats: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY HH:mm',
        LLLL: 'dddd, D MMMM YYYY HH:mm'
      },
      ordinal: n => {
        const s = ['th', 'st', 'nd', 'rd'];
        const v = n % 100;
        return `[${n}${s[(v - 20) % 10] || s[v] || s[0]}]`;
      }
    } */
export default {
  name: "Gantt",
  components: {
    GanttElastic,
    GanttHeader
  },
  props: {
    ganttData: {
      //甘特图渲染的数据
      type: Array,
      required: true
    },
    customHeaderOption: {
      type: Object
    },
    customOptions:{
      type: Object
    }
  },
  data() {
    return {
      options:Object.assign({},defaultOptions,this.customOptions),
      HeaderOption: Object.assign(
        {},
        {
          //甘特图header部分配置
          title: {
            label: "<h6 style='letter-spacing:initial'>项目甘特图:</h6>",
            html: true
          },
          locale: {
            Now: "当前时间",
            "X-Scale": "横向尺寸",
            "Y-Scale": "纵向尺寸",
            "Task list width": "表格宽度",
            "Before/After": "日期范围",
            "Display task list": "表格显示"
          }
        },
        this.customHeaderOption
      )
    };
  }
};
</script>
