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
export default {
  name: "Seller",
  data() {
    return {
      chartInstance: null,
      allData: null,
      currentPage: 1,
      totalPage: 0,
      showData: null,
      timer: null,
    };
  },
  mounted() {
    this.initChart();
    this.getData();
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    // 初始化
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.seller, "chalk");
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
      // // 起始索引
      // const start = (this.currentPage - 1) * 5;
      // // 末尾索引
      // const end = this.currentPage * 5;
      // // 截取数组
      // this.showData = this.allData.slice(start, end);
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
      const option = {
        title: {
          text: "▎商家销售统计",
          textStyle: {
            fontSize: 66,
          },
          left: 20,
          top: 20,
        },
        grid: {
          top: "20%",
          left: "3%",
          right: "6%",
          bottom: "3%",
          // 是位置设置包含文字
          containLabel: true,
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
          data: sellerNames,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            z: 0,
            lineStyle: {
              width: 66,
              color: "#2d3443",
            },
          },
        },
        series: [
          {
            type: "bar",
            data: sellerValues,
            barWidth: 66,
            label: {
              show: true,
              position: "right",
              textStyle: {
                color: "#fff",
              },
            },
            itemStyle: {
              barBorderRadius: [0, 33, 33, 0],
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: "#5052ee",
                },
                {
                  offset: 1,
                  color: "#ab6ee5",
                },
              ]),
            },
          },
        ],
      };
      // 使用
      this.chartInstance.setOption(option);
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
  },
};
</script>

<style lang='less' scoped>
.seller {
  height: 100%;
  width: 100%;
  .seller_contain {
    height: 100%;
    width: 100%;
  }
}
</style>