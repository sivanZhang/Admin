<template functional>
    <div class="layout_main_top">
      <div class="layout_main_top_left">
        <div class="layout_task" v-for="(item,index) of props.arr" :key="index">
          <h3>{{item.num}}</h3>
          <span class="layout_top_span">{{item.title}}</span>
        </div>
      </div>
    </div>
</template>
<style lang="scss" scoped>
 .layout_main_top {
        display: flex;
    }
    .layout_main_top_left {
        display: flex;
        width: 70%;
        height: 50px;
        justify-content: flex-start
    }
    .layout_main_top_right {
        display: flex;
        width: 30%;
        height: 50px;
        justify-content: flex-end;
    }
    .layout_task {
        width: 100px;
        height: 40px;
        border-right: 1px solid #ddd;
        text-align: center;
        .layout_top_span {
            color: #909399;
            font-size: small
        }
        &:first-child {
            border-left: 1px solid #ddd;
        }
    }
</style>
