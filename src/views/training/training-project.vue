<template>
  <div id="training-project">
    <project :trainingProject="trainingProject"  />
    <!-- {{trainingProject}} -->
  </div>
</template>

<script>
// import { getTrainingProject } from "@/api/training";
import project from "@/views/overview/project";
import { mapState } from "vuex";
export default {
  name: "training-project",
  components: { project },
  computed:{
    ...mapState("trainingStatus",["trainingProject"])
  },
  data() {
    return {
      // trainingProject: []
    };
  },
  watch: {},
  methods: {
    // getTraining() {
    //   getTrainingProject().then(({ data }) => {
    //     if (data.status === 0) {
    //       this.trainingProject = [...data.msg];
    //     }
    //   });
    // }
  },
  created() {
    //this.getTraining();
    this.$store.dispatch("trainingStatus/get_TrainProject")
  }
};
</script>
<style lang='scss' scoped>
</style>