<template>
  <div class="background-container" style="background-color:#006666;margin:0px;padding:200px 0px 0px 20px;">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="container">
         <div class="banner__brand">
            <a href="/" data-logo-video>
            </a>
        </div>
        <div class="banner__content  animation-element " data-animation data-animation-options="type:fadeInTop;">
        <h3 class="title" style="font-size: 26px;font-weight: bold;font-family:Monospace;color:black;">欢迎登录</h3>




      <el-form-item prop="username">
        <!--<span class="svg-container">
          <svg-icon icon-class="user" />
        </span>-->

         <span class="input-group__icon" >
						<svg-icon icon-class="user" />
					</span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入邮箱"
          name="username"
          type="text"
          tabindex="1"

          required="required"
          autofocus
        />

      </el-form-item>

      <el-form-item prop="password">
        <!--<span class="svg-container">
          <svg-icon icon-class="password" />
        </span>-->

        <span class="input-group__icon">
						<svg-icon icon-class="password" />
					</span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          required="required"
          @keyup.enter.native="handleLogin"
        />

        <!--<span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>-->
      </el-form-item>
        <el-row :gutter="24">
        <el-col :span="24" class="link">
          <router-link to="/forgot">找回密码</router-link>
        </el-col>
        </el-row>

       <!--
       <div style="height: 20px; width: 100%;"></div>
				<p	style="font-size:15px;font-weight:bold;text-align:left;">Please enter the characters you see:</p>
        <div style="height: 20px; width: 100%;"></div>
						<el-form-item prop="verifycode">
						   <el-input
               v-model="loginForm.verifycode" placeholder="请输入验证码" class="identiftinput">

						   </el-input>
						</el-form-item>
							<el-form-item>
          <div class="identifybox">
            <div @click="refreshCode">
              <s-identify :identifyCode="identifyCode"></s-identify>
            </div>
            <el-button @click="refreshCode" type='text' class="textbtn">看不清，换一张</el-button>
          </div>
        </el-form-item>

            <br>
            -->
            <div style="height: 100px; width: 100%;"></div>
            <div style="clear: both"></div>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px; height:37px;"
        @click.native.prevent="handleLogin"
      >登录</el-button>
            
      <!--<el-row :gutter="15">
        <el-col :span="12" class="link">
          <router-link to="/signup">申请账号</router-link>
        </el-col>
        <el-col :span="12" class="link">
          <router-link to="/forgot">找回密码</router-link>
        </el-col>
      </el-row>-->
      </div>
   </div>
    </el-form>
      
     <div class="so center">
  <div class="inner">
    <div class="stack-box">
      <div class="stack">
        <div class="item">
          <div class="inner-item"></div>
        </div>
        <div class="item">
          <div class="inner-item"></div>
        </div>
        <div class="item">
          <div class="inner-item"></div>
        </div>
        <div class="item">
          <div class="inner-item"></div>
        </div>
        <div class="item">
          <div class="inner-item"></div>
        </div>
      </div>
      <div class="box">
        <div class="bottom"></div>
        <div class="left"></div>
        <div class="right"></div>
        <div class="top"></div>
      </div>
    </div>
    <div class="name">
      <span class="b">wefxs</span>
    </div>
  </div>
</div>


    </div>
</template>

<script>

import { validUsername } from "@/utils/validate";

export default {
  name: "SignIn",
 
  data() {
    const validateVerifycode = (rule, value, callback) => {
			let newVal = value.toLowerCase()
			let identifyStr =	this.identifyCode.toLowerCase()
      if (newVal === '') {
        callback(new Error('请输入验证码'))
      } else if (newVal !== identifyStr) {
        console.log('validateVerifycode:', value)
        callback(new Error('验证码不正确!'))
      } else {
        callback()
      }
		}
    return {
      loginForm: {
        username: "", //1212@1212.com
        password: "",
        verifycode:""
      },
      checked: false,
      identifyCodes: '1234567890ABCDEFGHIGKLMNoPQRSTUVWXYZ',
      identifyCode: '',
      loginRules: {
        username: [
          {
            required: true,
            trigger: "blur",
            message: "请输入登录邮箱"
          }
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            message: "请输入密码"
          }
        ],
        verifycode: [
          { required: true, trigger: 'blur', validator: validateVerifycode }
        ]
      },
      loading: false,
      passwordType: "password",
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }

  },
  created(){

  },
  mounted(){
  this.identifyCode = ''
  this.makeCode(this.identifyCodes, 4)
  },
  filters: {
  checkChange (formName) {
    if (this.checked === true) {
      this.loginForm.username = 'admin'
      this.loginForm.password = '111111'
      this.loginForm.verifycode = ''
    } else {
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })
    }
  }
},
computed: {
},
props: [],
methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    // 生成随机数
  randomNum (min, max) {
    return Math.floor(Math.random() * (max - min) + min)
  },
  // 切换验证码
  refreshCode () {
    this.identifyCode = ''
    this.makeCode(this.identifyCodes, 4)
  },
  // 生成四位随机验证码
  makeCode (o, l) {
    for (let i = 0; i < l; i++) {
      this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
    }
    console.log(this.identifyCode)
  },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("login/login", this.loginForm)
            .then(res => {
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
              this.$message.success(res.msg);
            })
            .catch(err => {
              this.$message.error(err.msg);
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:white;
$light_gray:white;
$cursor:gray;


.link {
  font-size: 20px;


  &:last-of-type {
    text-align: right;
  }
}

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}


/* reset element-ui css */

.container {
  .el-input {
    display: inline-block;
    height: 50px;
    width: 80%;
    background:transparent;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 4px;
    padding: 12px 5px 12px 15px;
    color: $light_gray;
    
    caret-color: $cursor;
  }
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }



  .el-form-item {
    border: 1px solid gray;
    background:transparent;
    border-radius: 5px;
    color:black;
    margin:40px;
  }
}
</style>

<style lang="scss" scoped>
$bg:white;
$dark_gray:black;
$light_gray: black;

.container {
  height: 600px;
  width: 500px;
  
  margin:0px 50px 0px 450px;
  padding: 80px 50px 50px 50px;
  background-color: $bg;
  overflow: hidden;
  text-align:center;
  .login-form {
    position: relative;
    width: 407px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .input-group__icon {
    width:25px;
    height:25px;
    color: $dark_gray;
    vertical-align: middle;
    display: inline-block;




  }

  
  
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}

</style>
<style lang="scss" scoped src="../login/signin.scss">
