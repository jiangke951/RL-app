<template>
  <div class="LineChart maxWH" ref="lineCharts">
  
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'LineChart',
  props: ['echarts_info'],
  mounted() {                             
      // 初始化echarts实例
      let lineCharts = echarts.init(this.$refs.lineCharts)
      if (!this.echarts_info || typeof this.echarts_info.learning_curve !== 'string') {  
        // console.error(this.echarts_info);  
        // console.error('echarts_info 或 learning_curve 未正确初始化');  
        return;  
    }  
      // 配置数据
      lineCharts.setOption({
        tooltip: {  
        trigger: 'axis', // 触发类型，默认数据项触发，可选为：'item' | 'axis'  
        axisPointer: {  
            type: 'cross', // 默认为直线，可选为：'line' | 'shadow'  
            crossStyle: {  
                color: '#999'  
            }  
        },  },
             // 图表的标题
             title: {
              text: '动作选择',
               
            },
            xAxis: {
                type: 'category',
                data: ['0', '1', '2', '3', '4', '5', '6','7', '8', '9', '10', '11', '12', '13','14', '15', '16', '17', '18', '19', '20']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
            data: [...this.echarts_info.movement_decision.split(",")],
            type: 'line',
            lineStyle: {  
            width: 0,  // 设置线宽为 0，表示不显示线  
            type: 'none'  // 设置线条类型为 'none'，表示不显示线  
        }  
            }
        ]
                })


  },
}
</script>
