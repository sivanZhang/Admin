<template>
  <div id="man-hour">
      <label for="">总工时：{{0}}小时</label>
      <br>
      <label for="">加班工时：{{0}}小时</label>
  </div>
</template>

<script>
import Ajax from '@/api/manHour'
export default {
    name:"my-man-hour",
    data() {
        return {
            
        }
    },
    methods:{

    }
}
</script>
