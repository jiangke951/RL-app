<template>
    <div class="test-list maxWH clearfix">
       
        <!-- 添加 -->
        <el-button type="primary" @click.native.prevent.stop="testAddDialog = true"
            style="margin: 15px 0;">添加算法</el-button>
        <!-- 列表显示实验 -->
        <el-table :data="testlist" border style="width: 100%" max-height="250">
           
            <el-table-column prop="test_name" label="算法名" show-overflow-tooltip>
               
            </el-table-column>
            <el-table-column prop="user_name" label="实验者">
            </el-table-column>
            <el-table-column prop="test_status" label="实验状态">
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作" header-align="center" >
                <template slot-scope="scope">
                    <div class="handler flex-center">
                        <el-button type="warning" @click.native.prevent.stop="openUpdateTest(scope.$index, testlist)">
                            修改
                        </el-button>
                        <el-button type="warning" @click.native.prevent.stop="goPath('testdetail',scope.row.test_id)"> 
                            历史实验
                        </el-button>
                        
                        <!-- <el-button type="warning" @click.native.prevent.stop="goPath('reserveinfo',scope.$index)">
                            查看实验
                        </el-button> -->
                       
                       
                        <el-button type="warning" @click.native.prevent.stop="openDetailTest(scope.$index, testlist)">
                            参数推荐
                        </el-button>
                       
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page_no"
            :page-sizes="page_sizes" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper"
            :total="test_count" style="padding: 10px 0;">
        </el-pagination>
        <!-- dialog -->
        <!-- 添加实验 -->
        <el-dialog title="添加实验" :visible.sync="testAddDialog">
            <!-- el-form-item是el-form的子组件，父组件中使用:model="testAddForm"则子组件中调用父组件的值可以用testAddForm.account-->
            <el-form ref="testAddForm" :model="testAddForm" label-width="80px" :rules="rules">
                 <!-- prop=“规则名” 验证表单里元素属性 -->
                <el-form-item label="算法名" prop="account">
                    <el-input v-model.trim="testAddForm.account" autocomplete="off" placeholder="请输入算法名"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model.trim="testAddForm.username" autocomplete="off" placeholder="请输入用户名">
                    </el-input>
                </el-form-item>
                <el-form-item label="算法状态" prop="test_status">
                    <!-- v-model 实现双向绑定-->
                    <el-radio-group v-model="testAddForm.test_status">
                        <el-radio :label="test_status[1].label"></el-radio>
                        <el-radio :label="test_status[2].label"></el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button type="primary" @click.native.prevent.stop="addTest('testAddForm')">确 定</el-button>
                <el-button @click.native.prevent.stop="resetForm('testAddForm')">重 置</el-button>
            </div>
        </el-dialog>
        <!-- 修改实验信息 -->
        <el-dialog title="修改算法信息" :visible.sync="testUpdateDialog">
            <el-form ref="testUpdateForm" :model="testUpdateForm" label-width="80px" :rules="rules"
                hide-required-asterisk>
                <el-form-item label="算法名"  prop="test_name">
                    <el-input v-model.trim="testUpdateForm.test_name" autocomplete="off"
                        placeholder="请输入算法名"></el-input>
                </el-form-item>
                <el-form-item label="实验者" prop="user_name">
                    <el-input v-model.trim="testUpdateForm.user_name" autocomplete="off" placeholder="请输入实验者">
                    </el-input>
                </el-form-item>
        
                <el-form-item label="算法状态" prop="test_status">
                    <el-radio-group v-model="testUpdateForm.test_status">
                        <el-radio :label="test_status[1].label"></el-radio>
                        <el-radio :label="test_status[2].label"></el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button type="primary" @click.native.prevent.stop="updateTest('testUpdateForm')">确 定</el-button>
                <el-button @click.native.prevent.stop="resetForm1('testUpdateForm')">重 置</el-button>
            </div>
        </el-dialog>

         <!-- 实验参数展示 -->
         <el-dialog title="推荐超参数" :visible.sync="testDetailDialog">
            <el-form ref="testDetailForm" :model="testDetailForm" label-width="110px" :rules="rules"
                hide-required-asterisk>
                <el-row>  
                    <el-col :span="8"> <!-- 这里设置 span 为 8，表示占据三分之一的空间 ，使用的是 24 列的栅格系统-->  
                        <el-form-item label="learning_rate"  prop="learning_rate" >
                            <el-input :style="{ width: '80px' }" disabled v-model.trim="testDetailForm.learning_rate"></el-input>
                        </el-form-item>
                    </el-col>
                     
                    <el-col :span="8"> 
                        <el-form-item label="batch_size"  prop="batch_size" >
                            <el-input :style="{ width: '80px' }" disabled v-model.trim="testDetailForm.batch_size"></el-input>
                        </el-form-item>
                    </el-col>  
                     
                    <el-col :span="8"> 
                        <el-form-item label="tau"  prop="tau" >
                            <el-input :style="{ width: '80px' }" disabled v-model.trim="testDetailForm.tau"></el-input>
                        </el-form-item>
                    </el-col> 
                </el-row> 
                 
        
                <el-row>  
                    <el-col :span="8"> <!-- 这里设置 span 为 8，表示占据三分之一的空间 ，使用的是 24 列的栅格系统-->  
                        <el-form-item label="gamma"  prop="gamma" >
                            <el-input :style="{ width: '80px' }" disabled v-model.trim="testDetailForm.gamma"></el-input>
                        </el-form-item>
                    </el-col>  
                     
                    <el-col :span="8"> 
                        <el-form-item label="learning_starts"  prop="learning_starts" >
                            <el-input :style="{ width: '80px' }" disabled v-model.trim="testDetailForm.learning_starts"></el-input>
                        </el-form-item>
                    </el-col>  
                     
                    <el-col :span="8"> 
                        <el-form-item label="train_freq"  prop="train_freq" >
                            <el-input :style="{ width: '80px' }" disabled v-model.trim="testDetailForm.train_freq"></el-input>
                        </el-form-item>
                    </el-col> 
                </el-row> 


                <el-row>  
                    <el-col :span="8"> <!-- 这里设置 span 为 8，表示占据三分之一的空间 ，使用的是 24 列的栅格系统-->  
                        <el-form-item label="gradient_steps"  prop="gradient_steps" >
                            <el-input :style="{ width: '80px' }" disabled v-model.trim="testDetailForm.gradient_steps"></el-input>
                        </el-form-item>
                    </el-col>  
                     
                    <el-col :span="8"> 
                        <el-form-item label="exploration_fraction"  prop="exploration_fraction" >
                            <el-input :style="{ width: '80px' }" disabled v-model.trim="testDetailForm.exploration_fraction"></el-input>
                        </el-form-item>
                    </el-col>  
                     
                    <el-col :span="8"> 
                        <el-form-item label="exploration_initial_eps"  prop="exploration_initial_eps" >
                            <el-input :style="{ width: '80px' }" disabled v-model.trim="testDetailForm.exploration_initial_eps"></el-input>
                        </el-form-item>
                    </el-col> 
                </el-row> 


                <el-row>  
                    <el-col :span="8"> <!-- 这里设置 span 为 8，表示占据三分之一的空间 ，使用的是 24 列的栅格系统-->  
                        <el-form-item label="buffer_size"  prop="buffer_size" >
                            <el-input :style="{ width: '80px' }" disabled v-model.trim="testDetailForm.buffer_size"></el-input>
                        </el-form-item>
                    </el-col>  
                     
                    <el-col :span="8"> 
                        <el-form-item label="ent_coef"  prop="ent_coef" >
                            <el-input :style="{ width: '80px' }" disabled v-model.trim="testDetailForm.ent_coef"></el-input>
                        </el-form-item>
                    </el-col>  
                     
                    <el-col :span="8"> 
                        <el-form-item label="vf_coef"  prop="vf_coef" >
                            <el-input :style="{ width: '80px' }" disabled v-model.trim="testDetailForm.vf_coef"></el-input>
                        </el-form-item>
                    </el-col> 
                </el-row> 

                
            </el-form>
           
            <!-- <div class="el-dialog__title">mean reward:-1303.4206398</div>  -->
        </el-dialog>
    </div>
</template>

<script>
import { test_status_true, test_status_false } from '@/config'
import { user_status_true, user_status_false } from '@/config'
import { mapGetters } from 'vuex'
export default {
    name: 'TestList',
    data() {
        const validataAccount = (rule, value, callback) => {
            // const reg = /^[0-9]{6,12}$/
            const reg =/^[\u4e00-\u9fa5]{1,7}$|^[\dA-Za-z_]{1,14}$/
            if (value.trim().length <= 0) {
                callback(new Error('请输入账号'))
            } else if (!reg.test(value.trim())) {
                callback(new Error('实验名不能超过7个汉字或者14个字符'))
            } else {
                callback()
            }
        }
        const validataUsername = (rule, value, callback) => {
            //const reg = /^[\u4e00-\u9fa5]{2,6}$/
            if (value.trim().length <= 0) {
                callback(new Error('请输入用户名'))
            } else {
                callback()
            }
        }
        const validataPassword = (rule, value, callback) => {
            const reg = /^[a-zA-Z0-9_]{8,12}$/
            if (value.trim().length <= 0) {
                callback(new Error('请输入密码'))
            } else if (!reg.test(value.trim())) {
                callback(new Error('密码由8到12位的字母、数字或下划线组成'))
            } else {
                callback()
            }
        }
        const validataAddUserPassword1 = (rule, value, callback) => {
            if (this.userAddForm.password.trim() === '') {
                callback(new Error('请先输入密码'))
            } else if (value.trim().length <= 0) {
                callback(new Error('确认密码不得为空'))
            } else if (value.trim() !== this.userAddForm.password) {
                callback(new Error('两次输入密码不一致'))
            } else {
                callback()
            }
        }
        const validataUpdateUserPassword1 = (rule, value, callback) => {
            if (this.userUpdateForm.password.trim() === '') {
                callback(new Error('请先输入密码'))
            } else if (value.trim().length <= 0) {
                callback(new Error('确认密码不得为空'))
            } else if (value.trim() !== this.userUpdateForm.password) {
                callback(new Error('两次输入密码不一致'))
            } else {
                callback()
            }
        }
        return {
            // 表单验证规则
            rules: {
                account: [{ required: true, trigger: ['blur', 'change'], validator: validataAccount }],
                username: [{ required: true, trigger: ['blur', 'change'], validator: validataUsername }],
                password: [{ required: true, trigger: ['blur', 'change'], validator: validataPassword }],
                adduserpwd1: [{ required: true, trigger: ['blur', 'change'], validator: validataAddUserPassword1 }],
                updateuserpwd1: [{ required: true, trigger: ['blur', 'change'], validator: validataUpdateUserPassword1 }],
                test_status: [{ required: true, message: '请选择用户状态', trigger: 'change' }],
            },
            user_status: [
                { label: '全部', value: '0' },
                { label: user_status_true, value: '1' },
                { label: user_status_false, value: '2' },
            ],
            test_status: [
                { label: '全部', value: '0' },
                { label: test_status_true, value: '1' },
                { label: test_status_false, value: '2' },
            ],
            // 搜索列表的表单
            searchForm: {
                account: '',
                username: '',
                user_status: '',
                create_name:'',
            },
            // 当前页
            page_no: 1,
            // 初始化每页条目数
            page_size: 8,
            // 个数选择器
            page_sizes: [8, 16, 30, 50, 100],
            // 添加实验信息的表单
            testAddDialog: false,
            // 修改用户信息的表单
            userUpdateDialog: false,
            // 修改实验信息的表单
            testUpdateDialog:false,
            // 添加实验信息表单
            testAddForm: {
                account: '',
                username: '',
                create_name:'',
                test_status:''
            },
             // 实验参数表单
            testDetailDialog:false,
            // 实验参数表单
            testDetailForm: {
                seed: '',
                env_id: '',
                learning_rate:'',
                input_size:'',
                info:'',
            },
            // 修改用户信息表单
            userUpdateForm: {
                user_id: 0, // 用户id
                account: '', // 账号
                username: '', // 用户名
                update_pwd: false, // 是否修改密码
                password: '', // 密码
                updateuserpwd1: '', // 确认密码
                user_status: user_status_true, // 用户状态
            },
             // 修改实验信息表单
             testUpdateForm: {
                test_id:0,    //实验id
                test_name: '', // 实验名
                user_name: '', // 用户名
                test_status: '', // 用户状态
            },
        }
    },
    
    // vuex中mapGetters的使用
    computed: {
        ...mapGetters(['user_id', 'userlist','testlist', 'user_count','test_count','userinfo'])
    },
    mounted() {
        this.searchForm.user_status = this.user_status[0].value
        this.searchForm.create_name = this.userinfo.username
        this.testAddForm.create_name = this.userinfo.username
        // 获取用户列表
        this.getUserList()
        //获取实验列表
        this.getTestList()
    },
    methods: {
        // 重置表单
        resetForm(formname) {
           
            
            this.$refs[formname].resetFields()
        },
        //重置修改表单
        resetForm1(formname) {
            this.testUpdateForm.test_name=''
            this.testUpdateForm.user_name=''
            this.testUpdateForm.test_status=''
            

       },
        // 添加用户信息
        async addUser(formname) {
            // console.log(this.$refs[formname])
            
            await this.$refs[formname].validate(async vaild => {
                if (vaild) {
                    
                    return
                    try {
                        await this.$store.dispatch('addUser', JSON.stringify(this.userAddForm))
                            .then(res => {
                                this.resetForm(formname)
                                this.testAddDialog = false
                                this.$message({ type: 'success', message: res })
                                // 重新获取用户列表
                                this.getUserList()
                            }).catch(err => this.$message({ type: 'warning', message: err.message }))
                    } catch (e) {
                        this.$message({ type: 'warning', message: e.message })
                    }
                }
            })
        },
         // 添加实验
         async addTest(formname) {
            // console.log(this.$refs[formname])
            // return
            await this.$refs[formname].validate(async vaild => {
                if (vaild) { 
                    try {
                        await this.$store.dispatch('addTest', JSON.stringify(this.testAddForm))
                            .then(res => {
                                this.resetForm(formname)
                                this.testAddDialog = false
                                this.$message({ type: 'success', message: res })
                                // 重新获取用户列表
                                this.getTestList()
                            }).catch(err => this.$message({ type: 'warning', message: err.message }))
                    } catch (e) {
                        this.$message({ type: 'warning', message: e.message })
                    }
                }
            })
        },
        // 打开修改用户信息的遮罩页
        openUpdateUser(index, rows) {
            this.userUpdateDialog = true
            const userinfo = rows[index]
            // 获取当前用户的信息
            this.userUpdateForm = {
                user_id: userinfo.user_id,
                account: userinfo.account,
                username: userinfo.username,
                update_pwd: false,
                password: '',
                updateuserpwd1: '',
                user_status: userinfo.user_status,
            }
            // console.log(userinfo)
        },
          // 打开修改实验信息的遮罩页
          openUpdateTest(index, rows) {
            
            this.testUpdateDialog = true
            const testinfo = rows[index]
            // 获取当前用户的信息
            this.testUpdateForm = {
                test_id:testinfo.test_id,
                test_name: testinfo.test_name,
                user_name: testinfo.user_name,
               
                test_status: testinfo.test_status,
            }
           
        },
         // 打开实验参数的遮罩页
         openDetailTest(index, rows) {
            
            this.testDetailDialog = true
            const testinfo = rows[index]
            let str = testinfo.hyperparameters;
            const hyperparameters = JSON.parse(str);
            // console.log(testinfo)
            
            // 获取当前用户的信息
            this.testDetailForm = {
                learning_rate: hyperparameters.learning_rate,
                batch_size: hyperparameters.batch_size,
                tau: hyperparameters.tau,
                gamma: hyperparameters.gamma,
                train_freq: hyperparameters.train_freq,
                learning_rate: hyperparameters.learning_rate,
                gradient_steps: hyperparameters.gradient_steps,
                exploration_fraction: hyperparameters.exploration_fraction,
                exploration_initial_eps: hyperparameters.exploration_initial_eps,
                buffer_size: hyperparameters.buffer_size,
                ent_coef: hyperparameters.ent_coef,
                vf_coef: hyperparameters.vf_coef,
            }
            
        },
        // 修改用户信息
        async updateUser(formname) {
            await this.$refs[formname].validate(async vaild => {
                if (vaild) {
                    try {
                        const userinfo = {
                            user_id: this.userUpdateForm.user_id,
                            password: this.userUpdateForm.password,
                            user_status: this.userUpdateForm.user_status
                        }
                        await this.$store.dispatch('backUpdateUserInfo', JSON.stringify(userinfo))
                            .then(res => {
                                this.resetForm(formname)
                                this.userUpdateDialog = false
                                this.$message({ type: 'success', message: res })
                                // 重新获取用户列表
                                this.getUserList()
                            }).catch(err => this.$message({ type: 'warning', message: err.message }))
                    } catch (e) {
                        this.$message({ type: 'warning', message: e.message })
                    }
                }
            })
        },
         // 修改实验信息
         async updateTest(formname) {
            try {
                        const testinfo = {
                            test_id: this.testUpdateForm.test_id,
                            test_name: this.testUpdateForm.test_name,
                            user_name: this.testUpdateForm.user_name,
                            test_status: this.testUpdateForm.test_status
                        }
                        await this.$store.dispatch('updateTestInfo', JSON.stringify(testinfo))
                            .then(res => {
                                this.resetForm(formname)
                                this.testUpdateDialog = false
                                this.$message({ type: 'success', message: res })
                                // 重新获取用户列表
                                this.getTestList()
                            }).catch(err => this.$message({ type: 'warning', message: err.message }))
                    } catch (e) {
                        this.$message({ type: 'warning', message: e.message })
                    }
        },
       
        // 每页多少条目
        handleSizeChange(val) {
            this.page_size = val
            this.page_no = 1
            this.getUserList()
        },
        // 当前第几页
        handleCurrentChange(val) {
            this.page_no = val
            this.getUserList()
        },
        // 获取用户列表
        async getUserList() {
            try {
                const { page_no, page_size } = this
                let account = this.searchForm.account
                const reg = /^[0-9]{1,12}$/
                if (!reg.test(account)) {
                    if (account !== '') {
                        account = '1111111111111111111111111111111111111'
                    }
                }
                let username = this.searchForm.username
                const name_reg = /^[\u4e00-\u9fa50-9a-zA-Z]{1,6}$/
                if (!name_reg.test(username)) {
                    if (username !== '') {
                        username = '1111111111111111111111111111111111111'
                    }
                }
                let user_status = Number.parseInt(this.searchForm.user_status) || 0
                if (user_status === 0) user_status = '全部'
                else if (user_status === 1) user_status = user_status_true
                else if (user_status === 2) user_status = user_status_false
                await this.$store.dispatch('getUserList', JSON.stringify({ page_no, page_size, account, username, user_status }))
            } catch (e) {
                this.$message({ type: 'warning', message: e.message })
            }
        },
         // 获取实验列表
         async getTestList() {
            // return '111'
            try {
                // console.log(this.searchForm)
                const { page_no, page_size } = this
                let account = this.searchForm.account
            
                const reg = /^[0-9]{1,12}$/
                if (!reg.test(account)) {
                    if (account !== '') {
                        account = '1111111111111111111111111111111111111'
                    }
                }
                let username = this.searchForm.username
                let create_name = this.searchForm.create_name
                const name_reg = /^[\u4e00-\u9fa50-9a-zA-Z]{1,6}$/
                if (!name_reg.test(username)) {
                    if (username !== '') {
                        username = '1111111111111111111111111111111111111'
                    }
                }
               
                let test_status = '正常'
                await this.$store.dispatch('getTestList', JSON.stringify({ page_no, page_size, account, username, test_status,create_name }))
            } catch (e) {
                this.$message({ type: 'warning', message: e.message })
            }
        },
        // 重置搜索表单
        resetSearchForm(formname) {
            this.resetForm(formname)
            this.searchForm.user_status = this.user_status[0].value
        },
        // 搜索
        search() {
            this.page_no = 1
            this.page_size = this.page_sizes[0]
            this.getTestList()
        },
    
          // 去哪个页面
          goPath(path,id) {
          
            // this.$router.push(path+'/'+id)
            // console.log(path)
            // this.$router.push(path)
            this.$router.push({path:path,query:{parent_id:id}});
            // this.$router.push({name:this.getFrontPath(path,id),params:{id:id}})

        },
        // 路由判断
        getFrontPath(path) {
            let href = this.$route.path
            if (href.includes('front')) {
                return path
            } else {
                return 'front/' + path
            }
        },
    },
}
</script>

<style lang="less" scoped>
.test-list {
    padding:20px 5%;
    .search {
        width: 100%;
        height: 80px;
        
        box-sizing: border-box;
        border: 1px solid rgb(220, 220, 220);
        padding-top: 15px;
        overflow: hidden;

        .search-form {
            min-width: 400px;
            justify-content: center;
        }
    }
}
</style>