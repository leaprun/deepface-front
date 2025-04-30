<template>
    <div class="loginBody">
        <el-form ref="loginForm" :model="loginForm" class="login-box">

            <h3 class="login-title">欢迎登录</h3>

            <!-- 账号输入框 -->
            <el-form-item label="账号" prop="username" :rules="rules.username">
                <el-col :span="20">
                    <el-input type="text" placeholder=" 请输入账号" v-model="loginForm.username"
                        @blur="validate('username')" />
                </el-col>
            </el-form-item>

            <!-- 密码输入框 -->
            <el-form-item label="密码" prop="password" :rules="rules.password">
                <el-col :span="20">
                    <el-input type="password" placeholder=" 请输入密码" v-model="loginForm.password"
                        @blur="validate('password')" />
                </el-col>
            </el-form-item>


            <el-form-item label="验证码" prop="vCode" :rules="rules.vCode">
                <el-col :span="10">
                    <!-- 验证码输入框 -->
                    <el-input type="text" placeholder=" 请输入验证码" v-model="loginForm.vCode" @blur="validate('vCode')"
                        size="small" />
                </el-col>
                <el-col :span="8">
                    <!-- 验证码显示图片 -->
                    <el-image :src="vCodePic" :fit="fit" @click="loadVCode"></el-image>
                </el-col>

            </el-form-item>

            <br><br>

            <!-- 操作按钮 -->
            <el-form-item>
                <div class="container">
                    <el-button class="left" type="primary" @click="login()">立即登录</el-button>
                    <el-button class="mid" type="primary" @click="dialogFormVisible = true">忘记密码</el-button>
                    <el-button class="right" type="primary" @click="goRegister()">注册账号</el-button>
                </div>
            </el-form-item>
        </el-form>

        <div>
            <!-- 忘记密码dialog -->
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
                            <el-input type="text" placeholder=" 请输入邮箱验证码" v-model="resetPswForm.vCodeMail"
                                @blur="validate2('vCode')" size="small" />
                        </el-col>
                        <el-col :span="8">
                            <el-button  @click="emailVCode">获取验证码</el-button>
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
// import axios from "axios";
import service from '@/utils/request';
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
                vCodeMail: ""
            },//忘记密码用户信息
            userForm: {
                id: 0,
                token: "",
            },//用于接收用户的id等信息
            //vCodePic: require("../assets/vCodePic.png"),
            dialogFormVisible: false,//忘记密码的表单的显示
            flag: false, //用于判断账号密码是否正确
            uuid: "",

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
    mounted() {
        this.getUuid(); // 加载验证码
    },
    methods: {
        getUuid() {
            service.get("/login/uuid").then((result) => {
                if (result.data.code == 1) {
                    this.uuid = result.data.data;
                    this.loadVCode();
                }
            })
        },
        loadVCode() {
            service.get('/vCode', {
                params: { len: 4 }, // 如果需要传递参数
                responseType: 'blob',// 设置响应类型为 blob，用于接收图片
                //withCredentials: true // 允许携带 Cookie
                headers: {
                    "Uuid": this.uuid,
                }
            })
                .then(response => {
                    // 将 blob 数据转换为 URL 并赋值给 vCodePic
                    this.vCodePic = URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
                })
                .catch(error => {
                    console.error('获取验证码失败：', error);
                });
        },
        emailVCode() {
            service.get('/vCode/email', {
                params: {
                    len: 6,
                    username: this.resetPswForm.username
                },
                headers: {
                    "Uuid": this.uuid,
                }
            }).then((result) => {
                if (result.data.code == 0) {
                    alert("获取邮箱验证码失败");
                }

            });
        },
        checkUsername(rule, value, callback) {
            //检查输入的账号是否为空
            if (value == "") {
                return callback(new Error("账号不能为空"));
            } else callback();
        },

        checkPassword(rule, value, callback) {
            //检查输入的新密码是否为空
            if (value == "") {
                return callback(new Error("新密码不能为空"));
            } else callback();

        },

        checkVCode(rule, value, callback) {
            //检查输入的验证码是否为空
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
        //登录
        login() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    //判断登录类型
                    service
                        .get("/login/login", {
                            params: this.loginForm,
                            headers: {
                                "Uuid": this.uuid,
                            }
                            //withCredentials: true // 允许携带 Cookie
                        })
                        .then((result) => {
                            if (result.data.code == 1) {
                                this.userForm = result.data.data//接收登录用户数据
                                localStorage.setItem('token', this.userForm.token)//保存token为全局变量
                                this.$router.push("classes");//路由到默认的班级管理界面

                            } else {
                                alert("登录失败");
                            }
                            this.flag = 0;
                        });

                }
            });
        },
        //忘记密码
        resetPsw() {
            this.$refs.resetPswForm.validate((valid) => {//合法判断
                if (valid) {
                    service
                        .put("/login/resetPsw",{
                            params: this.resetPswForm,
                            headers: {
                                "Uuid": this.uuid,
                            }
                        })
                        .then((result) => {
                            this.flag = result.data.code; //修改密码是否成功
                            if (this.flag == 1) {
                                alert(this.flag)
                                this.dialogFormVisible = false;//重新回到登录界面
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