<template>
  <div class="rank">
    <div
      class="rank_contain"
      ref="rank"
      @mouseover="endInterval"
      @mouseout="startInterval"
    ></div>
  </div>
</template>

<script>
import { initOption, colorArr } from "@/components/rank/rankOption";
import { commonData } from "@/common/mixin";
import { mapState } from "vuex";
export default {
  name: "RankPage",
  data() {
    return {
      startValue: 0,
      endValue: 9,
    };
  },
  mixins: [commonData],
  created() {
    // 注册回调函数
    this.$socket.registerCallBack("rankData", this.getData);
  },
  mounted() {
    this.initChart();
    // this.getData();
    this.$socket.send({
      action: "getData",
      socketType: "rankData",
      chartName: "rank",
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
    this.$socket.unRegisterCallBack("rankData");
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
      this.chartInstance = this.$echarts.init(this.$refs.rank, this.theme);
      this.chartInstance.setOption(initOption);
    },
    // 获取数据
    getData(ret) {
      // const { data: ret } = await this.$http.get("rank");
      this.allData = ret;
      this.sortDate();
      this.updateChart();
      this.startInterval();
    },
    sortDate() {
      // 排序
      this.allData.sort((a, b) => {
        return b.value - a.value;
      });
    },
    updateChart() {
      const provinceArr = this.allData.map((item) => {
        return item.name;
      });
      const valueArr = this.allData.map((item) => {
        return item.value;
      });
      const dataOption = {
        xAxis: {
          data: provinceArr,
        },
        series: [
          {
            data: valueArr,
            itemStyle: {
              color: (arg) => {
                let targetColorArr = null;
                if (arg.value > 300) {
                  targetColorArr = colorArr[0];
                } else if (arg.value > 200) {
                  targetColorArr = colorArr[1];
                } else {
                  targetColorArr = colorArr[2];
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: targetColorArr[0],
                  },
                  {
                    offset: 1,
                    color: targetColorArr[1],
                  },
                ]);
              },
            },
          },
        ],
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue,
        },
      };
      // 使用
      this.chartInstance.setOption(dataOption);
    },
    // 屏幕适配
    screenAdapter() {
      const titleFontSize = (this.$refs.rank.offsetWidth / 100) * 3.6;
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
              barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0],
            },
          },
        ],
      };
      this.chartInstance.setOption(adapterOption);
      // 要调用实例的resize方法
      this.chartInstance.resize();
    },
    startInterval() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        this.startValue++;
        this.endValue++;
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0;
          this.endValue = 9;
        }
        this.updateChart();
      }, 1500);
    },
    endInterval() {
      clearInterval(this.timer);
    },
  },
};
</script>

<style lang='less' scoped>
</style>