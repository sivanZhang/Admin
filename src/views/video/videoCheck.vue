<template>
  <div id="videoCheck">

    <div class=“left”>
      <video-player :url="url"/>
    </div>
    <div class="right">

    </div>
  </div>
</template>

<script>
  import VideoPlayer from '@/components/VideoPlayer'
  import kscreenshot from 'kscreenshot'

  export default {
    components: { VideoPlayer },
    data() {
      return {
        url: 'http://localhost:8080/banner01.mp4'
      }
    },
    created() {

    },
    mounted() {

    },
    methods: {}
  }
</script>

<style lang="scss">
  #videoCheck {

  }
</style>
