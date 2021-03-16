<template>
  <div class="stock">
    <div
      class="stock_contain"
      ref="stock"
      @mousemove="endInterval"
      @mouseout="startInterval"
    ></div>
  </div>
</template>

<script>
import {
  initOption,
  centerArr,
  colorArr,
} from "@/components/stock/stockOption";
import { commonData } from "@/common/mixin";
import { mapState } from "vuex";
export default {
  name: "StockPage",
  mixins: [commonData],
  data() {
    return {
      currentIndex: 0,
    };
  },
  created() {
    // 注册回调函数
    this.$socket.registerCallBack("stockData", this.getData);
  },
  mounted() {
    this.initChart();
    // this.getData();
    // 发送数据给服务器
    this.$socket.send({
      action: "getData",
      socketType: "stockData",
      chartName: "stock",
      value: "",
    });
    // 监听屏幕变化
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },

  destroyed() {
    clearInterval(this.timer);
    // 注销事件
    window.removeEventListener("resize", this.screenAdapter);
    // 销毁回调函数
    this.$socket.unRegisterCallBack("stockData");
  },
  computed: {
    ...mapState(["theme"]),
  },
  watch: {
    theme() {
      // 销毁图表
      this.chartInstance.dispose();
      this.initChart();
      this.screenAdapter();
      this.updateChart();
    },
  },
  methods: {
    // 初始化
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.stock, this.theme);
      this.chartInstance.setOption(initOption);
    },
    // 获取数据
    getData(ret) {
      // const { data: ret } = await this.$http.get("stock");
      this.allData = ret;
      this.updateChart();
      this.startInterval();
    },
    updateChart() {
      const start = this.currentIndex * 5;
      const end = (this.currentIndex + 1) * 5;
      const showData = this.allData.slice(start, end);
      const seriesArr = showData.map((item, index) => {
        return {
          type: "pie",
          center: centerArr[index],
          // 关闭鼠标移入变小
          hoverAnimation: false,
          labelLine: {
            show: false,
          },
          label: {
            position: "center",
            color: colorArr[index][0],
          },
          data: [
            {
              name: item.name + "\n\n" + item.sales,
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArr[index][0],
                  },
                  {
                    offset: 1,
                    color: colorArr[index][1],
                  },
                ]),
              },
            },
            {
              value: item.stock,
              itemStyle: {
                color: "#333843",
              },
            },
          ],
        };
      });
      const dataOption = {
        series: seriesArr,
      };
      // 使用
      this.chartInstance.setOption(dataOption);
    },
    startInterval() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        this.currentIndex++;
        if (this.currentIndex > 1) {
          this.currentIndex = 0;
        }
        this.updateChart();
      }, 3000);
    },
    endInterval() {
      clearInterval(this.timer);
    },
    // 屏幕适配
    screenAdapter() {
      const titleFontSize = (this.$refs.stock.offsetWidth / 100) * 3.6;
      const innerRadius = titleFontSize * 3;
      const outterRadius = titleFontSize * 2.8;
      // 通过for循环和push方法将对象写入数组中进行赋值
      let seriesRadius = [];
      for (let i = 0; i < 5; i++) {
        seriesRadius.push({
          type: "pie",
          radius: [outterRadius, innerRadius],
          label: {
            fontSize: titleFontSize * 0.7,
          },
        });
      }
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        series: seriesRadius,
      };
      this.chartInstance.setOption(adapterOption);
      // 要调用实例的resize方法
      this.chartInstance.resize();
    },
  },
};
</script>

<style lang='less' scoped>
</style>