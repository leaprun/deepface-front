<template>
    <el-container style="height: 100vh; border: 1px solid #eee">
        <el-aside width="200px" style="background-color: rgb(238, 241, 246); height: 100%">
            <el-menu :default-openeds="['1', '3']">
                <el-submenu index="1">
                    <template slot="title"><i class="el-icon-menu"></i>班级管理</template>
                    <router-link tag="div" to="classes">
                        <el-menu-item index="1-1">我的班级</el-menu-item>
                    </router-link>
                </el-submenu>

                <!-- <el-submenu index="2">
                    <template slot="title"><i class="el-icon-user-solid"></i>学生管理</template>
                    <router-link to="student">
                        <el-menu-item index="2-1">学生管理</el-menu-item>
                    </router-link>
                </el-submenu> -->

                <el-submenu index="3">
                    <template slot="title"><i class="el-icon-s-grid"></i>考勤签到</template>
                    <router-link tag="div" to="attendance">
                        <el-menu-item index="3-1">开始考勤</el-menu-item>
                    </router-link>
                </el-submenu>
            </el-menu>
        </el-aside>

        <el-container>
            <!-- <el-header style="text-align: right; font-size: 12px; height: 60px;">
                <el-dropdown>
                    <i class="el-icon-setting" style="margin-right: 15px"></i>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>查看</el-dropdown-item>
                        <el-dropdown-item>新增</el-dropdown-item>
                        <el-dropdown-item>删除</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <span>王小虎</span>
            </el-header> -->

            <el-main style="height: calc(100vh - 60px)">
                <el-button type="primary" icon="el-icon-plus" @click="addCourse">新增空课程</el-button>
                <el-col :span="6">
                        <el-upload class="upload-demo"
                            action="http://10.243.140.27:8000/student/addBatch"
                            :on-success="handleSuccess" :on-error="handleError" :on-preview="handlePreview"  :headers="uploadHeaders"
                            :on-remove="handleRemove" :before-remove="beforeRemove" :limit="1" :on-exceed="handleExceed"
                            :file-list="fileList" accept=".pdf">
                            <el-button size="small" type="primary">批量上传学生信息</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传 PDF 文件</div>
                        </el-upload>
                    </el-col>
                    <!-- 批量上传学生信息 -->
                <el-table :data="tableData" height="600px">
                    <el-table-column prop="id" label="课程id">
                    </el-table-column>
                    <el-table-column prop="name" label="课程名称">
                        <template slot-scope="scope">
                            <!-- <a  @click="goToCourseStudent(scope.row.id,scope.row.name)">
                                {{ scope.row.name }}
                            </a> -->
                            <el-button type="success" @click="goToCourseStudent(scope.row.id, scope.row.name)">{{
                                scope.row.name }}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="startTime" label="开始时间">
                    </el-table-column>
                    <el-table-column prop="endTime" label="结束时间">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" @click="changeCourse(scope.row)">
                                修改课程
                            </el-button>
                            <el-button type="primary" icon="el-icon-delete" @click="deleteCourse(scope.row.id)">
                                删除课程
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 添加分页组件 -->
                <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize"
                    :current-page="start" @current-change="handleCurrentChange"></el-pagination>
            </el-main>
        </el-container>

        <!-- 修改课程的dialog -->
        <el-dialog title="修改课程" :visible.sync="dialogFormVisible">
            <el-form :model="courseData">
                <el-form-item label="课程名称">
                    <el-input v-model="courseData.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-date-picker v-model="courseData.startTime" type="date"
                        placeholder="选择日期时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker v-model="courseData.endTime" type="date"
                        placeholder="选择日期时间"></el-date-picker>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitChange">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 增加课程的dialog -->
        <el-dialog title="增加课程" :visible.sync="dialogFormVisible2">
            <el-form :model="courseData">
                <el-form-item label="课程名称">
                    <el-input v-model="courseData.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-date-picker v-model="courseData.startTime" type="date"
                        placeholder="选择日期时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker v-model="courseData.endTime" type="date"
                        placeholder="选择日期时间"></el-date-picker>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="submitAdd">确 定</el-button>
            </div>
        </el-dialog>

    </el-container>

</template>

<script>
//import axios from 'axios';
import service from '@/utils/request';

export default {
    data() {
        return {
            tableData: [],//当前分页课程的数据
            dialogFormVisible: false,//修改课程的对话框显示
            dialogFormVisible2: false,
            courseData: {},   //单个课程的数据
            total: 0,//课程总数
            pageSize: 3,//分页大小
            start: 1,//当前页面

            uploadHeaders: {}, // 上传的请求头
        };
    },

    mounted() {

        console.log("Classes 组件已加载");
        // 获取本地存储中的 token 并设置为默认请求头
        const token = localStorage.getItem('token');
        if (token) {
            service.defaults.headers.common['token'] = token;
            this.uploadHeaders = { token };
            this.loadTableData();
        }
        //service.defaults.headers.common["token"] = localStorage.getItem('token')
    },
    methods: {
        loadTableData() {
            service.get("/classes",
                {
                    // headers: {
                    //     "Token": localStorage.getItem("token")
                    // },
                    params: {
                        start: this.start,
                        pageSize: this.pageSize
                    }
                }
            )
                .then((result) => {
                    this.tableData = result.data.data.rows;
                    this.total = result.data.data.total;
                }).catch((error) => {
                    console.error("网络请求失败：", error);
                    this.$message.error("网络请求失败，请检查网络连接或联系管理员");
                });
        },
        goToCourseStudent(id, name) {
            localStorage.setItem('classesId', id);
            localStorage.setItem('classesName', name);
            this.$router.push("student");//路由到对应班级的学生管理页面
        },
        handleCurrentChange(page) {
            this.start = page;
            this.loadTableData();
        },
        changeCourse(row) {
            this.dialogFormVisible = true;
            this.courseData = row
        },
        submitChange() {
            service.put("/classes", this.courseData, {
                headers: {
                    "token": localStorage.getItem("token")
                }
            })
                .then((result) => {
                    if (result.data.code == 1) {
                        alert("修改成功")
                        this.dialogFormVisible = false;
                    } else {
                        alert("修改失败" + result.data.msg)
                    }
                })
            this.dialogFormVisible = false
        },
        deleteCourse(id) {
            service.delete("/classes/" + id, {
                headers: {
                    "token": localStorage.getItem("token")
                }
            })
                .then((result) => {
                    if (result.data.code == 1) {
                        alert("删除成功")
                    }
                    else {
                        alert("删除失败" + result.data.msg)
                    }
                })
        },
        addCourse() {
            this.dialogFormVisible2 = true;
        },
        submitAdd() {
            service.post("/classes", this.courseData, {
                headers: {
                    "token": localStorage.getItem("token")
                }
            })
                .then((result) => {
                    if (result.data.code == 1) {
                        alert("增加成功")
                        this.dialogFormVisible2 = false;
                    } else {
                        alert("增加失败" + result.data.msg)
                    }
                })
        }
    }
};
</script>

<style>
.el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
}

.el-aside {
    color: #333;
}

.el-main {
    height: calc(100vh - 60px);
}
</style>