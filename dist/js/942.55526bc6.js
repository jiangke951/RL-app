"use strict";(self["webpackChunkvue_library"]=self["webpackChunkvue_library"]||[]).push([[942],{3942:function(e,t,r){r.r(t),r.d(t,{default:function(){return p}});var i=function(){var e=this,t=e._self._c;return t("div",{staticClass:"myinfo maxWH flex"},[t("el-form",{staticStyle:{width:"100%","min-width":"1000px","text-align":"center"},attrs:{inline:"","label-width":"80px","label-position":"right"}},[t("el-form-item",{attrs:{label:"账号"}},[t("el-input",{attrs:{disabled:""},model:{value:e.userinfo.account,callback:function(t){e.$set(e.userinfo,"account","string"===typeof t?t.trim():t)},expression:"userinfo.account"}})],1),t("el-form-item",{attrs:{label:"用户名"}},[t("el-input",{attrs:{disabled:""},model:{value:e.userinfo.username,callback:function(t){e.$set(e.userinfo,"username","string"===typeof t?t.trim():t)},expression:"userinfo.username"}})],1),t("el-form-item",{attrs:{label:"身份"}},[t("el-input",{attrs:{disabled:""},model:{value:e.userinfo.identity,callback:function(t){e.$set(e.userinfo,"identity","string"===typeof t?t.trim():t)},expression:"userinfo.identity"}})],1)],1),t("el-form",{ref:"backPwdForm",staticStyle:{width:"40%","min-width":"400px","margin-top":"100px"},attrs:{model:e.pwdForm,rules:e.rules,align:"center","label-width":"80px","label-position":"right","hide-required-asterisk":""}},[t("el-form-item",{attrs:{label:"旧密码",prop:"oldpwd"}},[t("el-input",{attrs:{type:"password"},model:{value:e.pwdForm.oldpwd,callback:function(t){e.$set(e.pwdForm,"oldpwd","string"===typeof t?t.trim():t)},expression:"pwdForm.oldpwd"}})],1),t("el-form-item",{attrs:{label:"新密码",prop:"newpwd"}},[t("el-input",{attrs:{type:"password"},model:{value:e.pwdForm.newpwd,callback:function(t){e.$set(e.pwdForm,"newpwd","string"===typeof t?t.trim():t)},expression:"pwdForm.newpwd"}})],1),t("el-form-item",{attrs:{label:"确认密码",prop:"newpwd1"}},[t("el-input",{attrs:{type:"password"},model:{value:e.pwdForm.newpwd1,callback:function(t){e.$set(e.pwdForm,"newpwd1","string"===typeof t?t.trim():t)},expression:"pwdForm.newpwd1"}})],1),t("el-form-item",{attrs:{align:"center"}},[t("el-button",{staticStyle:{"margin-left":"-40px"},attrs:{type:"primary"},nativeOn:{click:function(t){return t.preventDefault(),t.stopPropagation(),e.updatePwd("backPwdForm")}}},[e._v("修 改")]),t("el-button",{nativeOn:{click:function(t){return t.preventDefault(),t.stopPropagation(),e.resetForm("backPwdForm")}}},[e._v("重 置")])],1)],1)],1)},s=[],n=(r(7658),r(408)),o={name:"BMyInfo",data(){const e=(e,t,r)=>{const i=/^[a-zA-Z0-9_]{8,12}$/;t.trim().length<=0?r(new Error("请输入旧密码")):i.test(t.trim())?r():r(new Error("密码格式错误"))},t=(e,t,r)=>{const i=/^[a-zA-Z0-9_]{8,12}$/;t.trim().length<=0?r(new Error("请输入新密码")):i.test(t.trim())?t.trim()===this.pwdForm.oldpwd?r(new Error("新密码不能与旧密码相同")):r():r(new Error("密码格式错误"))},r=(e,t,r)=>{""===this.pwdForm.newpwd.trim()?r(new Error("请先输入新密码")):t.trim().length<=0?r(new Error("确认密码不得为空")):t.trim()!==this.pwdForm.newpwd?r(new Error("两次输入密码不一致")):r()};return{rules:{oldpwd:[{required:!0,trigger:["blur","change"],validator:e}],newpwd:[{required:!0,trigger:["blur","change"],validator:t}],newpwd1:[{required:!0,trigger:["blur","change"],validator:r}]},pwdForm:{oldpwd:"",newpwd:"",newpwd1:""}}},computed:{...(0,n.Se)(["userinfo"])},methods:{resetForm(e){this.$refs[e].resetFields()},async updatePwd(e){await this.$refs[e].validate((async t=>{t&&await this.$confirm("确定修改?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((async()=>{try{const t={user_id:this.userinfo.user_id,oldpwd:this.pwdForm.oldpwd,newpwd:this.pwdForm.newpwd};await this.$store.dispatch("updatePwd",JSON.stringify(t)).then((t=>{this.$message({type:"success",message:t}),this.resetForm(e),setTimeout((()=>{this.$store.dispatch("userLogout").then((e=>this.$router.push("/login")))}),1e3)})).catch((e=>this.$message({type:"warning",message:e.message})))}catch(t){this.$message({type:"warning",message:t.message})}})).catch((()=>{this.$message({type:"info",message:"已取消"})}))}))}}},a=o,l=r(1001),d=(0,l.Z)(a,i,s,!1,null,"51219b8b",null),p=d.exports}}]);
//# sourceMappingURL=942.55526bc6.js.map