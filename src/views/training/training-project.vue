<template>
  <div id="training-project">
    <project :trainingProject="trainingProject" />
  </div>
</template>

<script>
import { getTrainingProject } from "@/api/training";
import project from "@/views/overview/project";
export default {
  name: "training-project",
  components: { project },
  data() {
    return {
      trainingProject: []
    };
  },
  watch: {},
  methods: {
    getTraining() {
      getTrainingProject().then(({ data }) => {
        if (data.status === 0) {
          this.trainingProject = [...data.msg];
        }
      });
    }
  },
  created() {
    this.getTraining();
  }
};
</script>
<style lang='scss' scoped>
</style>