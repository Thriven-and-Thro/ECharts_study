<template>
  <div class="seller">
    <div
      class="seller_contain"
      ref="seller"
      @mouseover="endInterval"
      @mouseout="startInterval"
    ></div>
  </div>
</template>

<script>
import { initOption } from "@/components/seller/sellerOption";
import { commonData } from "@/common/mixin";
export default {
  name: "SellerPage",
  mixins: [commonData],
  data() {
    return {
      currentPage: 1,
      totalPage: 0,
      showData: null,
    };
  },
  mounted() {
    this.initChart();
    this.getData();
    // 监听屏幕变化
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    clearInterval(this.timer);
    // 注销事件
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    // 初始化
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.seller, "chalk");
      this.chartInstance.setOption(initOption);
    },
    // 获取数据
    async getData() {
      const { data: ret } = await this.$http.get("seller");
      this.allData = ret;
      this.sortDate();
      this.updateChart();
      this.startInterval();
    },
    // 排序方法
    sortDate() {
      // 排序
      this.allData.sort((a, b) => {
        return a.value - b.value;
      });
      // 判断一共多少页
      this.totalPage =
        this.allData.length % 5 === 0
          ? this.allData.length / 5
          : this.allData.length / 5 + 1;
    },
    updateChart() {
      // 起始索引
      const start = (this.currentPage - 1) * 5;
      // 末尾索引
      const end = this.currentPage * 5;
      // 截取数组
      this.showData = this.allData.slice(start, end);
      // 将数据拿出
      const sellerNames = this.showData.map((item) => {
        return item.name;
      });
      const sellerValues = this.showData.map((item) => {
        return item.value;
      });
      // 柱状图配置
      const dataOption = {
        yAxis: {
          data: sellerNames,
        },
        series: [
          {
            data: sellerValues,
          },
        ],
      };
      // 使用
      this.chartInstance.setOption(dataOption);
    },
    startInterval() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        this.currentPage++;
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1;
        }
        this.updateChart();
      }, 3000);
    },
    endInterval() {
      clearInterval(this.timer);
    },
    // 屏幕适配
    screenAdapter() {
      const titleFontSize = (this.$refs.seller.offsetWidth / 100) * 3.6;
      const adapterOption = {
        xAxis: {
          axisLabel: {
            fontSize: titleFontSize / 2,
          },
        },
        yAxis: {
          axisLabel: {
            fontSize: titleFontSize / 2,
          },
        },
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        label: {
          fontSize: titleFontSize / 2,
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize,
            },
          },
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
            },
          },
        ],
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