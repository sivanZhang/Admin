<template>
  <div id="project">
    <div class="container">
      <div v-for="item in 10" :key="item">
        <el-card :body-style="{ padding: '0px' }">
          <div class="dropdow">
            <el-dropdown>
            <el-button type="text" style="color:#fff;font-size:18px">
              <i class="el-icon-more"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
              <el-dropdown-item>螺蛳粉</el-dropdown-item>
              <el-dropdown-item>双皮奶</el-dropdown-item>
              <el-dropdown-item>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          </div>
          <div class="color" :style="{backgroundColor:'rgb(0,255,255)',boxShadow: '0 2px 10px 3px rgba(0,255,255, .12)'}">
            
          </div>
          <el-image
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            fit="cover"
            style="width:100%;height:150px"
          ></el-image>
          <div style="padding: 15px;">
            <h3>[DEMO] Development</h3>
            <p>demo_development</p>
            <el-row>
              <el-col v-for="item1 in 4" :key="item1" :span="12">
                <p>工作流</p>
                <div>DEVELOPMENT</div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "project"
};
</script>

<style lang="scss" src="./project.scss">
</style>
