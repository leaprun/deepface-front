<!-- 签到页面 -->
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

            <el-main style="height: calc(100vh - 60px)">
                <el-table :data="tableData" height="600px">
                    <el-table-column prop="id" label="课程id">
                    </el-table-column>
                    <el-table-column prop="name" label="课程名称">
                    </el-table-column>
                    <el-table-column prop="startTime" label="开始时间">
                    </el-table-column>
                    <el-table-column prop="endTime" label="结束时间">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-date" @click="check(scope.row.id)">
                                {{ scope.row.isBegin ? '开始考勤' : '结束考勤' }}
                            </el-button>
                            <el-button type="primary" icon="el-icon-s-claim" @click="checkInfo(scope.row.id)">
                                考勤结果
                            </el-button>

                        </template>
                    </el-table-column>
                </el-table>
                <!-- 添加分页组件 -->
                <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize"
                    :current-page="start" @current-change="handleCurrentChange"></el-pagination>
            </el-main>

            <el-dialog title="考勤结果" :visible.sync="dialogCheckInfoVisible">
                <el-table :data="checkData">
                    <el-table-column property="classesId" label="课程id"></el-table-column>
                    <el-table-column property="classesName" label="课程名称"></el-table-column>
                    <el-table-column property="studentId" label="学生id"></el-table-column>
                    <el-table-column property="studentName" label="学生姓名"></el-table-column>
                    <el-table-column prop="status" label="考勤状态" :formatter="formatStatus"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-s-claim"
                                @click="checkChange(scope.row.studentId)">
                                修改考勤
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
        </el-container>
    </el-container>

</template>

<script>
// import axios from 'axios';
import service from '@/utils/request';
export default {
    data() {
        return {
            tableData: [],//当前分页课程的数据
            courseData: {},   //单个课程的数据
            total: 0,//课程总数
            pageSize: 3,//分页大小
            start: 1,//当前页面
            checkData: [],//考勤结果的数据
            dialogCheckInfoVisible: false,
            // showSuccessResult: false,//展示考勤成功
            // showErrorResult: false,//展示考勤失败
            isBegin: true,
        };
    },

    mounted() {
        console.log("Classes 组件已加载");
        const token = localStorage.getItem('token');
        if (token) {
            service.defaults.headers.common['token'] = token;
            this.loadTableData();
        }
        
    },
    methods: {
        loadTableData() {
            service.get("/classes",
                {
                    headers: {
                        "token": localStorage.getItem("token")
                    },
                    params: {
                        start: this.start,
                        pageSize: this.pageSize
                    }
                }
            )
                .then((result) => {
                    // 遍历 result.data.data.rows，为每个对象添加 isBegin 
                    this.tableData = result.data.data.rows.map(item => {
                        return {
                            ...item, // 保留原始数据
                            isBegin:true,
                        };
                    });
                    this.total = result.data.data.total;
                }).catch((error) => {
                    console.error("网络请求失败：", error);
                    this.$message.error("网络请求失败，请检查网络连接或联系管理员");
                });
        },
        handleCurrentChange(page) {
            this.start = page;
            this.loadTableData();
        },
        check(id) {
            // 找到对应行并切换 isBegin 状态
            const row = this.tableData.find(item => item.id === id);
            //开始考勤
            if (row.isBegin == true) {
                service.get("/check/begin/" + id)
                    .then((result) => {
                        if (result.data.code == 1) {
                            this.$message({
                                message: '开始考勤成功',
                                type: 'success'
                            });
                            row.isBegin = !row.isBegin;
                        } else {
                            this.$message({
                                message: '开始考勤失败',
                                type: 'warning'
                            });
                        }
                    })
            }
            //结束考勤
            else {
                service.get("/check/stop/" + id)
                    .then((result) => {
                        if (result.data.code == 1) {
                            this.$message({
                                message: '结束考勤成功',
                                type: 'success'
                            });
                            row.isBegin = !row.isBegin;
                        } else {
                            this.$message({
                                message: '结束考勤失败',
                                type: 'warning'
                            });
                        }
                    })
            }
        },
        checkInfo(id) {
            this.dialogCheckInfoVisible = true;
            service.get("/check/getInfo", {
                params: {
                    classesId: id
                }
            }).then((result) => {
                if (result.data.code == 1) {
                    this.checkData = result.data.data.check_in;
                } else {
                    alert(result.data.msg)
                }
            }).catch((error) => {
                console.error("网络请求失败：", error);
                this.$message.error("网络请求失败，请检查网络连接或联系管理员");
            });
        },
        checkChange(studentId) {
            // 找到对应行并切换 isBegin 状态
            const row = this.checkData.find(item => item.studentId === studentId);
            row.status = !row.status;
            service.get("/check/update", {
                params: {
                    classesId: row.classesId,
                    studentId: row.studentId,
                    status: row.status,
                }
            }).then((result) => {
                if (result.data.code == 1) {
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                } else {
                    alert("修改考勤结果失败" + result.data.msg)
                }
            }).catch((error) => {
                console.error("网络请求失败：", error);
                this.$message.error("网络请求失败，请检查网络连接或联系管理员");
            });
        },
        formatStatus(row, column, cellValue) {
            // 根据 status 的值返回不同的文本
            return cellValue ? '是' : '否';
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