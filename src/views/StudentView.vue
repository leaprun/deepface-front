<template>
    <el-container style="height: 100vh; border: 1px solid #eee">
        <el-aside width="200px" style="background-color: rgb(238, 241, 246); height: 100%">
            <el-menu :default-openeds="['1', '3']">
                <el-submenu index="1">
                    <template slot="title"><i class="el-icon-menu"></i>班级管理</template>
                    <router-link to="classes">
                        <el-menu-item index="1-1" route="/student">我的课程</el-menu-item>
                    </router-link>
                </el-submenu>

                <el-submenu index="2">
                    <template slot="title"><i class="el-icon-user-solid"></i>学生管理</template>
                    <router-link to="student">
                        <el-menu-item index="2-1">学生管理</el-menu-item>
                    </router-link>
                </el-submenu>

                <el-submenu index="3">
                    <template slot="title"><i class="el-icon-s-grid"></i>考勤签到</template>
                    <router-link to="attendance">
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
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-button type="primary" icon="el-icon-plus" @click="addStudent">增加学生</el-button>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" icon="el-icon-search" @click="searchStudent">搜索</el-button>
                    </el-col>
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

                </el-row>



                <el-form>
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <el-form-item label="课程id">
                                <el-input v-model="searchData.classesId"  :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="课程名称"  >
                                <el-input v-model="searchData.classesName" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="学生id">
                                <el-input v-model="searchData.studentId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="学生姓名">
                                <el-input v-model="searchData.studentName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

                <el-table :data="tableData" height="600px">
                    <el-table-column prop="studentId" label="学生id">
                    </el-table-column>
                    <el-table-column prop="studentName" label="学生姓名">
                    </el-table-column>
                    <el-table-column prop="studentEmail" label="学生邮箱">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" @click="changeStudent(scope.row)">
                                修改学生信息
                            </el-button>
                            <el-button type="primary" icon="el-icon-delete" @click="deleteStudent(scope.row.studentId)">
                                删除学生信息
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 添加分页组件 -->
                <el-pagination background layout="prev, pager, next" :total="total" :page-size="searchData.pageSize"
                    :current-page="searchData.start" @current-change="handleCurrentChange"></el-pagination>
            </el-main>
        </el-container>

        <!-- 修改学生的dialog -->
        <el-dialog title="修改学生信息" :visible.sync="dialogFormVisible">
            <el-form :model="studentData">
                <el-form-item label="学生id">
                    <el-input v-model="studentData.studentId" autocomplete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="学生姓名">
                    <el-input v-model="studentData.studentName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="学生邮箱">
                    <el-input v-model="studentData.studentEmail" autocomplete="off"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitChange">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 增加课程的dialog -->
        <el-dialog title="新增学生" :visible.sync="dialogFormVisible2">
            <el-form :model="studentData">
                <el-form-item label="课程id">
                    <el-input v-model="studentData.classesId" autocomplete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="课程名称">
                    <el-input v-model="studentData.classesName" autocomplete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="学生id">
                    <el-input v-model="studentData.studentId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="学生姓名">
                    <el-input v-model="studentData.studentName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="学生邮箱">
                    <el-input v-model="studentData.studentEmail" autocomplete="off"></el-input>
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
import service from '@/utils/request';
//import axios from 'axios';
export default {
    data() {
        return {
            tableData: [],//当前分页学生的数据
            dialogFormVisible: false,//修改学生的对话框显示
            dialogFormVisible2: false,
            studentData: {
                classesId: localStorage.getItem('classesId'),
                classesName: localStorage.getItem('classesName'),
                studentId: "",
                studentName: "",
                studentEmail:"",
            },   //单个学生的数据
            total: 0,//学生总数
            searchData: {
                pageSize: 5,//分页大小
                start: 1,//当前页面
                studentId: "",
                studentName: "",
                classesId: localStorage.getItem('classesId'),
                classesName: localStorage.getItem('classesName'),
            },
            fileList: [],
            uploadHeaders: {}, // 上传的请求头

        };
    },

    mounted() {
        console.log("student 组件已加载");
        // 获取本地存储中的 token 并设置为默认请求头
        const token = localStorage.getItem('token');
        if (token) {
            service.defaults.headers.common['token'] = token;
            this.uploadHeaders = { token };
            this.loadTableData();
        }
        //axios.defaults.headers.common["token"] = localStorage.getItem('token')
    },
    methods: {
        loadTableData() {
            service.get("/student",
                {
                    headers: {
                        "token": localStorage.getItem("token")
                    },
                    params: this.searchData
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
        searchStudent() {
            this.searchData.start = 1;
            // alert(JSON.stringify(this.searchData));
            this.tableData = [];
            this.loadTableData();
            //location.reload();
        },
        handleCurrentChange(page) {
            this.searchData.start = page;
            this.loadTableData();
        },
        changeStudent(row) {
            this.dialogFormVisible = true;
            this.studentData = row
        },
        submitChange() {
            service.put("/student", this.studentData, {
                headers: {
                    "token": localStorage.getItem("token")
                }
            })
                .then((result) => {
                    if (result.data.code == 1) {
                        alert("修改成功")
                    } else {
                        alert("修改失败")
                    }
                })
            this.dialogFormVisible = false
        },
        deleteStudent(id) {
            service.delete("/student/" + id +"&"+ localStorage.getItem('classesId'), {
                headers: {
                    "token": localStorage.getItem("token")
                }
            })
                .then((result) => {
                    if (result.data.code == 1) {
                        alert("删除成功")
                        location.reload();
                    }
                    else {
                        alert("删除失败")
                    }
                })
        },
        addStudent() {
            this.dialogFormVisible2 = true;
        },
        submitAdd() {
            service.post("/student/add", this.studentData, {
                headers: {
                    "token": localStorage.getItem("token")
                }
            })
                .then((result) => {
                    if (result.data.code == 1) {
                        alert("增加成功")
                    } else {
                        alert("增加失败")
                    }
                })
        },
        handleSuccess(response, file) {
            // 在这里处理文件上传成功后的逻辑
            console.log('文件上传成功', response);
            console.log('文件信息', file);
            // 获取文件的名字
            const fileName = file.name;
            // 获取文件的 URL
            const fileUrl = response.url || file.url;
            // 将文件信息添加到 fileList
            this.fileList.push({
                name: fileName,
                url: fileUrl
            });
            this.$message.success('文件上传成功');
        },
        handleError(err) {
            // 在这里处理文件上传失败的逻辑
            console.error('文件上传失败', err);
            this.$message.error('文件上传失败，请检查网络连接或联系管理员');
        },
        handleRemove(file) {
            console.log('删除文件', file);
            // 在这里处理文件删除的逻辑
        },
        handlePreview(file) {
            console.log('预览文件', file);
            // 在这里处理文件预览的逻辑
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file) {
            return this.$confirm(`确定移除 ${file.name}？`);
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