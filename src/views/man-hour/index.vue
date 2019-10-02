<template>
  <div id="man-hour">
    <label for>总工时：{{0}}小时</label>
    <br />
    <label for>加班工时：{{0}}小时</label>
    <chart ref="man-hour" chart-id="man-hour" />
  </div>
</template>

<script>
import Chart from "@/components/ECharts/PieChart";
import Ajax from "@/api/manHour";
export default {
  name: "my-man-hour",
  components: { Chart },
  data() {
    return {
        ProjectList:[],
    };
  },
  methods: {
      getProjectManhour(){

      }
    /* 
      
    this.$refs["man-hour"].openLoading()
    this.$refs["man-hour"].initChart("", data.msg);
        
      
      */
  },
  created() {
      
  },
};
</script>
