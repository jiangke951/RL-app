<template>
    <div class="feedback maxWH">
        <!-- 头部 -->
        <div class="header flex">
            <span class="title">lida 试用</span>
        </div>
        <!-- 主体 -->
        <main class="main">  
            <div class="container">  
                <div class="sidebar">  
                    <p class="tip">1、上传数据( 选择一个CSV文件)</p>
                    <div class="file-upload-wrapper">  
                        <!-- 使用label包裹input，并通过for和id关联 -->  
                        <label for="file-upload" class="file-upload-label">  
                           选择上传  (limit 200MB)
                           <span v-if="selectedFileName">{{ selectedFileName }}</span>
                            <!-- 通过CSS隐藏input元素 -->  
                            <input type="file" id="file-upload" @change="onFileChange" accept=".csv" style="display: none;"/>  
                        
                        </label>  
                    </div>  
                    <p class="tip">2、描述你的目标</p>
                    <!-- 新增的input输入框 -->  
                    <input type="text" class="goal-input" placeholder="请输入你的目标描述" v-model="formData.goal">  
                    <p class="tip">3、选择一个可视化库</p>
                     <!-- 新增的下拉框 -->  
                    <select v-model="formData.category" @change="onCategoryChange" class="library">  
                        <option value="seaborn">seaborn</option>  
                        <option value="matplotlib">matplotlib</option>  
                        <option value="plotly">plotly</option>  
                    </select>  
                    <div class="button-wrapper">  
                        <button @click="submitForm" class="beautiful-button">生成</button>  
                    </div>  
                </div>  
                
                <div class="image-display">  
                    <p>数据摘要</p> 
                    <div class="gray-box">  
        
                        <chart-component :data="uploadedData.chartData" />     
                    
                    </div>  
                    <p>选择一个可视化目标</p> 
                    <div class="goal">
                        <select v-model="selectedGoal">  
                            
                            <option  
                            v-for="goal in uploadedData.goalData"   
                            :value="goal.value"> <!-- 假设每个goal对象都有一个用于显示的value -->  
                            {{ goal.name }} <!-- 假设每个goal对象都有一个用于显示的name -->  
                            </option>  
                         </select>  
                    </div>
                    <div class="gray-box1" :style="grayBoxStyle">  
                         <img v-if="selectedImageUrl" :src="selectedImageUrl" alt="Selected Image" style="width: 100%; height: auto;">  
                    </div>  
                    <p>可视化代码</p> 
                    <div class="gray-box1" >  
                        <pre><code>  
                           {{selectedCode}}
                        </code></pre>
                    </div>  
                </div>  
                
            </div>  

        </main>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import shap from 'shap'
import ChartComponent from '../../Home/ChartComponent.vue'
import axios from 'axios'
import { requestsA, requestsB, requestsC } from '../../../../api/axios'
export default {
    name: 'lida',
    components: {  
    ChartComponent  
  }, 
    data() {
       
        return {
            file: null,
            formData: {  
                category: '',  
                goal: ''  
                // 可以添加更多表单字段  
            },
            selectedFileName: '', // 用于存储选中的文件名  
            uploadedData: null,  
            goalDescription: '', // 用于存储用户输入的目标描述  
            // selectedVisualizationLibrary: 'matplotlib', // 用于存储用户选择的可视化库 
            selectedGoal: '', // 用于v-model绑定的变量  
            selectedImageUrl: '', // 用于存储选中的图片URL  
            selectedCode: '', // 用于存储选中的代码  
            uploadedData: {  
                 chartData: [  
                //  ['column', 'dtype', 'samples', 'num_unique_values', 'semantic_type', 'description'], ['Name', 'string', "['Nissan Altima S 4dr', 'Mercury Marauder 4dr', 'Toyota Prius 4dr (gas/electric)']", 385, '', ''], ['Type', 'category', "['SUV', 'Minivan', 'Sports Car']", 5, '', ''], ['AWD', 'number', 0, 0, 1, '[1, 0]', 2, '', ''], ['RWD', 'number', 0, 0, 1, '[1, 0]', 2, '', ''], ['Retail_Price', 'number', 19724, 10280, 192465, '[22775, 37245]', 370, '', ''], ['Dealer_Cost', 'number', 17901, 9875, 173560, '[18030, 31558]', 384, '', ''], ['Engine_Size__l_', 'number', 1.0266787710109588, 0.0, 6.0, '[2.2, 5.3]', 40, '', ''], ['Cyl', 'number', 1, 0, 12, '[4, 9]', 8, '', ''], ['Horsepower_HP_', 'number', 70, 73, 493, '[126, 138]', 100, '', ''], ['City_Miles_Per_Gallon', 'number', 50, 10, 1000, '[59, 32]', 29, '', ''], ['Highway_Miles_Per_Gallon', 'number', 57, -1100, 66, '[43, 37]', 33, '', ''], ['Weight', 'number', 706, 1850, 6400, '[4473, 3472]', 315, '', ''], ['Wheel_Base', 'number', 8, 0, 130, '[110, 0]', 34, '', ''], ['Len', 'number', 13, 143, 221, '[197, 183]', 60, '', ''], ['Width', 'number', 4, 2, 81, '[72, 70]', 19, '', '']
            ]  ,
              
                goalData: [  
                // { id: 0, name: 'What is the distribution of Retail Price among different car types?', value: 'bar chart showing average Retail Price by Type', imageUrl: 'http://127.0.0.1:9540/static/test.png', code: 'console.log("代码1");'  },  
                // { id: 1, name: 'How does Engine Size vary with Horsepower for different cars?', value: 'scatter plot of Engine Size vs. Horsepower colored by Type', imageUrl: 'http://127.0.0.1:9540/static/test.png', code: 'console.log("代码1");'  } 
                ],  
            }  
        }
    },
    watch: {  
    // 监听selectedGoal的变化，并更新selectedImageUrl和selectedCode  
    selectedGoal(newValue) {  
      const goal = this.uploadedData.goalData.find(goal => goal.value === newValue);  
      if (goal) {  
        this.selectedImageUrl = 'data:image/png;base64,' + goal.imageUrl  
        this.selectedCode = goal.code;  

      } else {  
        console.log('nogoal:', goal.imageUrl)
        this.selectedImageUrl = '';  
        this.selectedCode = '';  
      }  
    },  
  },  
    computed: {
        grayBoxStyle() {  
      // 如果没有选择图像，则返回一个包含背景颜色的样式对象  
      // 否则返回一个空对象（因为图像已经设置了样式）  
      return this.selectedImageUrl ? {} : { backgroundColor: '#f0f0f0' }; // 假设您想要灰色背景  
    },  
    },
    methods: {
        onFileChange(e) {  
            this.file = e.target.files[0];  
            const files = event.target.files;  
            // 检查是否有文件被选中  
            if (files.length > 0) {  
                // 获取第一个文件的名称（因为这里只接受一个文件）  
                this.selectedFileName = files[0].name;  
            } else {  
                // 如果没有文件被选中，可以清空文件名或者设置为默认文本  
                this.selectedFileName = '';  
            }  
         },  
        onCategoryChange(e) {  
             // 这里通常不需要做什么，因为v-model已经处理了双向绑定  
             // 但你可以在这里添加额外的逻辑，比如验证  
        }, 
        submitForm() {  
            const formData = new FormData();  
            formData.append('file', this.file);  
            // formData.append('category', this.formData.category);  
            // formData.append('goal', this.formData.goal);  
            if (this.formData.category && this.formData.category.trim() !== '') {  
                formData.append('category', this.formData.category);  
            } 
            if (this.formData.goal && this.formData.goal.trim() !== '') {  
                formData.append('goal', this.formData.goal);  
            }  
            requestsC.post('http://127.0.0.1:9540/lida/front/test/sendForm', formData, {  
                    headers: {  
                        // 设置 Content-Type 为 multipart/form-data，但通常这一步是可选的，  
                        // 因为 axios 会自动设置正确的 Content-Type 当你传递一个 FormData 实例  
                        'Content-Type': 'multipart/form-data', // 通常不需要这行  
                    },  
                })  
                .then(response => {  
                    console.log('成功:', response.data);  
                    this.uploadedData.chartData = response.data.chartData; 
                    this.uploadedData.goalData = response.data.goalData; 
            
                    // 这里可以处理上传成功后的逻辑，如更新UI等  
                })  
                .catch(error => {  
                    console.error('错误:', error);  
                    // 这里可以处理上传失败后的逻辑，如显示错误信息  
                });  
     
        },
    
        handleFileUpload(event) {  
            // 处理文件上传的逻辑，例如读取文件内容  

            const file = event.target.files[0];  
            if (file) {  
                // 这里只是模拟，实际中您可能需要将文件发送到服务器  
                console.log('File uploaded:', file.name);  
                // 假设服务器返回了某些数据  
                // this.uploadedData = { message: '文件上传成功' };  
                 // 创建一个 FormData 实例  
                const formData = new FormData();  
                // 将文件添加到 FormData 实例中  
                // 假设后端接口期望的文件字段名为 "file"  
                formData.append('file', file);  
                requestsC.post('http://127.0.0.1:9540/lida/front/test/sendForm', formData, {  
                    headers: {  
                        // 设置 Content-Type 为 multipart/form-data，但通常这一步是可选的，  
                        // 因为 axios 会自动设置正确的 Content-Type 当你传递一个 FormData 实例  
                        'Content-Type': 'multipart/form-data', // 通常不需要这行  
                    },  
                })  
                .then(response => {  
                    console.log('成功:', response.data);  
                    this.uploadedData.chartData = response.data.chartData; 
                    this.uploadedData.goalData = response.data.goalData; 
            
                    // 这里可以处理上传成功后的逻辑，如更新UI等  
                })  
                .catch(error => {  
                    console.error('错误:', error);  
                    // 这里可以处理上传失败后的逻辑，如显示错误信息  
                });  

            }  
        },  
        submitFileUpload() {  
            // 在这个示例中，我们不需要这个方法，因为文件选择即触发上传  
            // 如果您需要额外的上传按钮来触发上传逻辑（例如，在选择了文件后），请取消注释以下代码  
            // 并在handleFileUpload中添加逻辑以区分是立即上传还是稍后上传  
            // console.log('Submitting file...');  
        },  
        generateVisualization() {  
            // 这里可以添加将数据和可视化库提交到服务器的逻辑  
            // 或者在前端进行处理的逻辑  
            console.log('目标描述:', this.goalDescription);  
            console.log('选择的可视化库:', this.selectedVisualizationLibrary);  
            // 示例：调用某个函数或API来生成可视化  
            // generateVisualizationData(this.goalDescription, this.selectedVisualizationLibrary);  
        },  
        fetchImage() {  
      // ...（与之前相同的方法实现）  
      const goal = this.uploadedData.goalData.find(goal => goal.value === this.selectedGoal);  
      if (goal) {  
        this.selectedImageUrl = goal.imageUrl;  
      } else {  
        this.selectedImageUrl = null;  
      }  
    },  
    },
}
</script>

<style lang="less" scoped>
.header {
    width: 100%;
    height: 100px;
    background-color: #324057;
    box-sizing: border-box;
    padding: 50px 10% 10px;
    overflow: hidden;

    .title {
        font-size: 25px;
        color: #fff;
    }
}

.main {
    width: 100%;
    box-sizing: border-box;
    // padding: 50px 10% 0;

    .container {  
        display: flex;  
        justify-content: space-between;  
        //   padding: 20px;  
}  
  
.sidebar {  
  width: 30%;  
  border-right: 1px solid #ccc;  
  padding-right: 20px; 
  background-color: #e9ecef; 
  height: 250vh; /* 视口高度的100% */  
  overflow-y: auto; /* 超出部分可滚动 */  
  box-sizing: border-box; /* 防止内边距影响总高度 */  
  .tip{
    // background-color: red; 
    padding:10px;
    margin-left:15px;
    font-size: 15px;  
    margin:30px 0 20px 20px
  }
  .file-upload-label {  

    background-color: #f8f9fa;    
    border: 1px solid #ced4da;  
    color: #495057;  
    margin:0 0 10px 15px;
    padding-top:30px;
    font-size: 15px;  
    // font-weight: 400;  
    line-height: 1.5;  
    text-align: center;  
    vertical-align: middle;  
    cursor: pointer;  
    border-radius: 0.1rem;  
    transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;  
    user-select: none;  
    width: 70%; /* 或者其他适合您布局的宽度 */ 
    height:60px; 
    display: block; /* 如果您希望它占满整个侧边栏的宽度 */  
}  
.goal-input{
    margin:0 0 10px 20px;
    font-size: 15px;  
    border: 2px solid #ced4da;  
    padding:10px;
    border-radius: 8px;
    padding-right:100px;
}
.library{
    margin:0 0 10px 20px;
    font-size: 15px;  
    border: 2px solid #ced4da;  
    padding:8px;
    padding-right:100px;
    border-radius: 6px; /* 设置圆角 */  
    border: 1px solid #ccc; /* 示例边框 */  

}
.button-wrapper {  
  margin-top: 40px; /* 可选：增加按钮上方的间距 */  
  margin-left:20px;
}  
  
.beautiful-button {  
  background-color: #324057; 
  border: none;  
  color: white;  
  padding: 8px 16px;  
  text-align: center;  
  text-decoration: none;  
  display: inline-block;  
  font-size: 16px;  
  margin: 4px 2px;  
  cursor: pointer;  
  border-radius: 8px; /* 圆角 */  
}  
  
.beautiful-button:hover {  
  background-color: #409EFF; /* 鼠标悬停时的颜色 */  
}  
  
.file-upload-label:hover {  
    background-color: #e9ecef;  
} 


}  
  
.image-display {  
  width: 70%;  
  display: flex;  
  margin-top:10px;
  flex-direction: column; /* 修改为列方向，使子元素垂直排列 */  
  .gray-box {  
    width: 70%; 
    // background-color:#f8f9fa; /* 浅灰色背景 */  
    // padding: 10px; /* 内边距 */  
    border: 1px solid #ddd; /* 边框颜色比背景稍深，增加对比度 */  
    border-radius: 8px; /* 边框圆角 */  
    // margin: 20px 0 0 20px; /* 上边距，以便与其他内容区分 */  
    margin: 20px auto; /* 上下外边距为0，左右外边距自动，以实现水平居中 */ 
    box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* 可选的阴影效果，增加立体感 */  
    height: 400px; /* 或你需要的任何固定高度 */  
    overflow-x: auto; /* 当内容宽度超出时显示水平滚动条 */  
}
.gray-box1 {  
    width: 70%; 
    // background-color:#f8f9fa; /* 浅灰色背景 */  
    // padding: 10px; /* 内边距 */  
    border: 1px solid #ddd; /* 边框颜色比背景稍深，增加对比度 */  
    border-radius: 8px; /* 边框圆角 */  
    // margin: 20px 0 0 20px; /* 上边距，以便与其他内容区分 */  
    margin: 20px auto; /* 上下外边距为0，左右外边距自动，以实现水平居中 */ 
    box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* 可选的阴影效果，增加立体感 */  
    height: 500px; /* 或你需要的任何固定高度 */  
    overflow-x: auto; /* 当内容宽度超出时显示水平滚动条 */  
}
}
.image-display p {  
  margin:10px 0 0 40px;  
  font-size: 15px;  
}  
.goal {  
    width:70%;
    display: flex;  
    text-align:center;
    flex-direction: column; /* 修改为列方向，使子元素垂直排列 */  
    margin:10px 0 0 40px;  
    font-size: 15px;  
    border: 2px solid #ced4da;  
    padding:8px;
    border-radius: 6px; /* 设置圆角 */   
    border: 1px solid #ccc; /* 示例边框 */ 
} 

/* 为pre标签设置样式，包括字体、背景色、边距等 */  
pre {  
  background-color: #f4f4f4; /* 浅灰色背景 */  
  border: 1px solid #ddd; /* 边框 */  
  border-left: 3px solid #f36d33; /* 左侧边框颜色更深，以突出显示 */  
  color: #666; /* 文本颜色 */  
  page-break-inside: avoid; /* 避免在打印时分割代码块 */  
  font-family: 'Courier New', Courier, monospace; /* 设置字体为等宽字体 */  
  font-size: 15px; /* 字体大小 */  
  line-height: 1.6; /* 行高 */  
  margin-bottom: 1.6em; /* 外边距 */  
  max-width: 100%; /* 最大宽度 */  
  overflow: auto; /* 如果内容超出容器宽度，则显示滚动条 */  
  padding: 1em 1.5em; /* 内边距 */  
  display: block; /* 显式声明为块级元素 */  
  word-wrap: break-word; /* 长单词或URL地址自动换行 */  
}  
  
/* 也可以为code标签设置一些样式，但通常pre的样式就足够了 */  
code {  
  /* 这里通常不需要太多样式，因为pre已经包含了它 */  
  font-family: inherit; /* 继承pre的字体设置 */  
}
  

}


</style>