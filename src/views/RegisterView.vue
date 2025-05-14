<template>
    <div class="registerBody">
        <el-form ref="registerForm" :model="registerForm" width=" 80px" class="register-box">

            <h3 class="register-title">账号注册</h3>

            <el-form-item label="账号" prop="username" :rules="rules.username">
                <el-col :span="20">
                    <el-input type="text" placeholder=" 请输入用户名" v-model="registerForm.username"
                        @blur="validate('username')" />
                </el-col>
            </el-form-item>

            <el-form-item label="密码" prop="password" :rules="rules.password">
                <el-col :span="20">
                    <el-input type="password" placeholder=" 请输入密码" v-model="registerForm.password"
                        @blur="validate('password')" />
                </el-col>
            </el-form-item>

            <el-form-item label="姓名" prop="name" :rules="rules.name">
                <el-col :span="20">
                    <el-input type="text" placeholder=" 请输入姓名" v-model="registerForm.name" @blur="validate('name')" />
                </el-col>
            </el-form-item>
            <el-form-item label="邮件" prop="email" :rules="rules.email">
                <el-col :span="20">
                    <el-input type="text" placeholder=" 请输入邮箱" v-model="registerForm.email" @blur="validate('email')" />
                </el-col>
            </el-form-item>

            <el-form-item label="验证码" prop="vCode" :rules="rules.vCode">
                <el-col :span="10">
                    <el-input type="text" placeholder=" 请输入验证码" v-model="registerForm.vCode" @blur="validate('vCode')"
                        size="small" />
                </el-col>
                <el-col :span="8">
                    <el-image :src="vCodePic" :fit="fit" @click="loadVCode()"></el-image>
                </el-col>

            </el-form-item>

            <el-form-item>
                <div class="container">
                    <el-button class="left" type="primary" @click="goLogin()">返回登录</el-button>
                    <el-button class="right" type="primary" @click="goRegister()">确认注册</el-button>
                </div>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
import service from '@/utils/request';
//import axios from "axios";
export default {
    data() {
        return {
            registerForm: {
                id: 0,
                username: "",
                password: "",
                name: "",
                email: "",
                vCode: ""
            },
            // vCodePic: require("../assets/vCodePic.png"),

            flag: 0,//判断注册是否成功，默认失败(0)
            uuid: "",
            /////////////////////////////////////
            rules: {
                username: [{ validator: this.checkUsername, trigger: "blur" }],
                password: [{ validator: this.checkPassword, trigger: "blur" }],
                name: [{ validator: this.checkName, trigger: "blur" }],
                email: [{ validator: this.checkEmail, trigger: "blur" }],
                vCode: [{ validator: this.checkVCode, trigger: "blur" }],
            },
        };
    },
    mounted() {
        const token = localStorage.getItem('token');
        if (token) {
            service.defaults.headers.common['token'] = token;
            this.getUuid(); // 加载验证码
        }
       
    },
    methods: {
        getUuid() {
            service.get("/login/uuid").then((result) => {
                if (result.data.code == 1) {
                    this.uuid = result.data.data;
                    this.loadVCode();
                }else{
                    alert(result.data.msg)
                }
            })
        },
        
        loadVCode() {
            service.get('/vCode', {
                params: { length: 4 }, // 如果需要传递参数
                responseType: 'blob', // 设置响应类型为 blob，用于接收图片
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
        goRegister() {
            this.$refs.registerForm.validate((valid) => {
                if (valid) {
                    service
                        .post("/login/register", this.registerForm, {
                            headers: {
                                "Uuid": this.uuid,
                            }
                        })
                        .then((result) => {
                            this.flag = result.data.code
                            if (this.flag == 1) {
                                alert("注册成功")
                                this.$router.push("login");
                            }
                            else {
                                alert("注册失败"+result.data.msg)
                            }

                        });
                } else {
                    alert("注册失败");
                    return;
                }
            });
        },


        goLogin() {
            this.$router.push("login");
        },
        //////////////////////////////////////
        checkUsername(rule, value, callback) {
            if (value == "") {
                return callback(new Error("账号不能为空"));
            } else callback();
        },
        checkName(rule, value, callback) {
            if (value == "") {
                return callback(new Error("姓名不能为空"));
            } else callback();
        },
        checkPassword(rule, value, callback) {
            if (value == "") {
                callback(new Error("请输入密码"));
            } else {
                setTimeout(() => {
                    if (value.length < 3) {
                        callback(new Error("密码长度必须大于3"));
                    } else {
                        callback();
                    }
                }, 500);
            }
        },
        checkEmail(rule, value, callback) {
            if (value === "") {
                callback(new Error("邮箱不能为空"));
            } else {
                // 定义邮箱的正则表达式
                const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                setTimeout(() => {
                    if (!emailRegex.test(value)) {
                        callback(new Error("邮箱格式不正确"));
                    } else {
                        callback();
                    }
                }, 500);
            }
        },
        checkVCode(rule, value, callback) {
            if (value == "") {
                return callback(new Error("验证码不能为空"));
            } else callback();
        },
        ///////////////////////////////////////////

        validate(prop) {
            this.$refs.registerForm.validateField(prop);
        },

        //////////////////////////////////////////
    },
};
</script>

<style>
.register-box {
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

.register-title {
    text-align: center;
    margin: 0 auto 40px auto;
    color: #303133;
}

.registerBody {
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

.left {
    align-items: center
}

.right {
    align-items: center
}

.container {
    display: flex;
    justify-content: space-between;
    width: 100%;

}
</style>