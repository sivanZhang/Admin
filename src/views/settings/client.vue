<template>
  <div>
    该功能将指定部门中哪个部门为客户部门
    <el-button @click="handelClick">测试</el-button>
  </div>
</template>
<script>
import QWebChannel from "./plugin/qwebchannel.js";
export default {
  methods: {
    handelClick() {
      new QWebChannel(qt.webChannelTransport, function(channel) {
        window.app_manager = channel.objects.app_manager;
        console.log(app_manager);
        app_manager.text = "33333333";
        app_manager.textChanged.connect(function(message) {
          document.getElementById("output").innerHTML =
            "Received message: " + message;
        });
      });
    }
  }
};
</script>