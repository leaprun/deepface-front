<template>
    <div class="loginBody">
        <el-form ref="loginForm" :model="loginForm" class="login-box">

            <h3 class="login-title">欢迎登录</h3>

            <el-form-item label="账号" prop="username" :rules="rules.username">
                <el-col :span="20">
                    <el-input type="text" placeholder=" 请输入账号" v-model="loginForm.username"
                        @blur="validate('username')" />
                </el-col>
            </el-form-item>

            <el-form-item label="密码" prop="password" :rules="rules.password">
                <el-col :span="20">
                    <el-input type="password" placeholder=" 请输入密码" v-model="loginForm.password"
                        @blur="validate('password')" />
                </el-col>
            </el-form-item>

            <el-form-item label="验证码" prop="vCode" :rules="rules.vCode">
                <el-col :span="10">
                    <el-input type="text" placeholder=" 请输入验证码" v-model="loginForm.vCode" @blur="validate('vCode')"
                        size="small" />
                </el-col>
                <el-col :span="8">
                    <el-image :src="vCodePic" :fit="fit"></el-image>
                </el-col>

            </el-form-item>

            <br><br>

            <el-form-item>
                <div class="container">
                    <el-button class="left" type="primary" @click="login()">立即登录</el-button>
                    <el-button class="mid" type="primary" @click="dialogFormVisible=true">忘记密码</el-button>
                    <el-button class="right" type="primary" @click="goRegister()">注册账号</el-button>
                </div>

            </el-form-item>
        </el-form>

        <div>
            <el-dialog title="忘记密码" :visible.sync="dialogFormVisible" :modal="false" class="resetPsw-box">
                <el-form ref="resetPswForm" :model="resetPswForm">
                    <el-form-item label="账号" prop="username" :rules="rules2.username">
                        <el-input placeholder="请输入账号" v-model="resetPswForm.username" clearable=""
                            @blur="validate2('username')" />
                       
                    </el-form-item>

                    <el-form-item label="新密码" prop="password" :rules="rules2.password">
                        
                        <el-input placeholder="请输入密码" v-model="resetPswForm.password" show-password
                            @blur="validate2('password')" />
                       
                    </el-form-item>

                    <el-form-item label="确认密码" prop="checkPsw" :rules="rules2.checkPsw">
                        
                        <el-input placeholder="请输入密码" v-model="resetPswForm.checkPsw" show-password
                            @blur="validate2('checkPsw')" />
                        
                    </el-form-item>

                    <el-form-item label="验证码" prop="vCode" :rules="rules2.vCode">
                        <br>
                        <el-col :span="14">
                            <el-input type="text" placeholder=" 请输入验证码" v-model="resetPswForm.vCode"
                                @blur="validate2('vCode')" size="small" />
                        </el-col>
                        <el-col :span="8">
                            <el-image :src="vCodePic" :fit="fit"></el-image>
                        </el-col>

                    </el-form-item>

                    <el-form-item>
                        <div class="container">
                            <el-button class="left" type="primary" @click="resetPsw">确认</el-button>
                        <el-button class="right" type="primary" @click="dialogFormVisible = false">取消</el-button>
                        </div>

                    </el-form-item>

                </el-form>
            </el-dialog>
        </div>

    </div>
</template>

<script>
import axios from "axios";
export default {
    data() {
        return {
            loginForm: {
                username: "",
                password: "",
                vCode: ""
            },//登录用户信息
            resetPswForm: {
                username: "",
                password: "",
                checkPsw: "",
                vCode: ""
            },
            userForm: {
                id: 0,
                token:"",
            },//用于接收用户的id等信息
            vCodePic: require("../assets/vCodePic.png"),
            dialogFormVisible: false,//忘记密码的表单
            flag: false, //用于判断账号密码是否正确

            rules: {
                username: [{ validator: this.checkUsername, trigger: "blur" }],
                password: [{ validator: this.checkPassword, trigger: "blur" }],
                vCode: [{ validator: this.checkVCode, trigger: "blue" }]
            },
            rules2: {
                username: [{ validator: this.checkUsername, trigger: "blur" }],
                password: [{ validator: this.checkPassword, trigger: "blur" }],
                checkPsw: [{ validator: this.checkNewPassword, trigger: "blur" }],
                vCode: [{ validator: this.checkVCode, trigger: "blue" }]
            }
        };
    },
    methods: {

        checkUsername(rule, value, callback) {
            if (value == "") {
                return callback(new Error("账号不能为空"));
            } else callback();
        },

        checkPassword(rule, value, callback) {
            if (value == "") {
                return callback(new Error("新密码不能为空"));
            } else callback();
            
        },

        checkVCode(rule, value, callback) {
            if (value == "") {
                return callback(new Error("验证码不能为空"));
            } else callback();
        },
        checkNewPassword(rule, value, callback) {
            if (value == "") {
                return callback(new Error("确认密码不能为空"));
            } else if (value != this.resetPswForm.password) {
                return callback(new Error("两次密码必须一致"));
            } else callback();
        },

        validate(prop) {
            this.$refs.loginForm.validateField(prop);
        },
        validate2(prop) {
            this.$refs.resetPswForm.validateField(prop);
        },

        login() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    //判断登录类型
                    axios
                        .get("http://127.0.0.1:4523/m1/6023266-5712566-default/login/login", {
                            params: this.loginForm
                        })
                        .then((result) => {
                            this.flag = result.data.code; //检测账号密码是否正确
                            if (this.flag == 1) {
                                this.userForm = result.data.data
                                localStorage.setItem('token', this.userForm.token)
                                //进行登录
                                this.$router.push("classes");

                            } else {
                                alert("登录失败");
                            }

                            this.flag = 0;
                        });

                }
            });
        },
        resetPsw() {
            this.$refs.resetPswForm.validate((valid) => {
                if (valid) {
                    axios
                        .put("http://127.0.0.1:4523/m1/6023266-5712566-default/login/resetPsw", null,{
                            params: this.resetPswForm
                        })
                        .then((result) => {
                            this.flag = result.data.code; //修改密码是否成功
                            if (this.flag == 1) {
                                alert(this.flag)
                                //进行登录
                                this.$router.push("test");
                            } else {
                                alert("修改密码失败");
                            }
                            this.flag = 0;
                        });
                }
            });
        },
        goRegister() {
            this.$router.push("register");
        }
    },
};
</script>

<style scoped>
.login-box {
    border: 1px solid #dcdfe6;
    width: 350px;
    margin: 50px auto;
    padding: 35px 35px 15px 35px;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    box-shadow: 0 0 25px #909399;
    background-color: white;
}
.resetPsw-box {
    width: 1000px;
    margin: 40px auto;
    padding: 35px 35px 15px 35px;
    
}

.login-title {
    text-align: center;
    margin: 0 auto 40px auto;
    color: #303133;
}

.container {
    display: flex;
    justify-content: space-between;
    width: 100%;

}

.left {
    align-items: center
}

.mid {
    align-items: center
}

.right {
    align-items: center
}

.loginBody {
    width: 100%;
    height: 100%;
    min-width: 1000px;
    background-image: url("../assets/SummerAmbience.png");
    background-color: #606266;
    background-size: 100% 100%;
    background-position: center center;
    overflow: auto;
    background-repeat: no-repeat;
    position: fixed;
    line-height: 100%;
    padding-top: 150px;
}
</style>