<template>
  <div class="trend">
    <div class="trend_title" :style="titleSize">
      <div @click="showSelect = !showSelect">
        <span :style="changeTheme">▎ {{ showName }}</span
        ><span :style="changeTheme"> ﹀</span>
      </div>
      <div v-if="showSelect" :style="titleMargin">
        <div
          v-for="(item, index) in selectTypes"
          :key="index"
          @click="handleSelect(item.key)"
          :style="changeTheme"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="trend_contain" ref="trend"></div>
  </div>
</template>

<script>
import { commonData } from "@/common/mixin";
import {
  initOption,
  colorArr1,
  colorArr2,
} from "@/components/trend/trendOption";
import { mapState } from "vuex";
import { getThemeValue } from "@/utils/theme_utils.js";
export default {
  name: "TrendPage",
  mixins: [commonData],
  data() {
    return {
      showSelect: false,
      currentSelect: "map",
      titleFontSize: 0,
    };
  },
  created() {
    // 注册回调函数
    this.$socket.registerCallBack("trendData", this.getData);
  },
  mounted() {
    this.initChart();
    // this.getData();
    // 发送数据给服务器
    this.$socket.send({
      action: "getData",
      socketType: "trendData",
      chartName: "trend",
      value: "",
    });
    // 监听屏幕变化
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    // 注销事件
    window.removeEventListener("resize", this.screenAdapter);
    // 销毁回调函数
    this.$socket.unRegisterCallBack("trendData");
  },
  computed: {
    // 数据依赖于allData
    selectTypes() {
      if (!this.allData) {
        return [];
      } else {
        return this.allData.type.filter((item) => {
          return item.key !== this.currentSelect;
        });
      }
    },
    showName() {
      if (!this.allData) {
        return "";
      } else {
        return this.allData[this.currentSelect].title;
      }
    },
    // 标题大小
    titleSize() {
      return {
        fontSize: this.titleFontSize + "px",
      };
    },
    // 标题对齐
    titleMargin() {
      return {
        marginLeft: this.titleFontSize + "px",
      };
    },
    ...mapState(["theme"]),
    changeTheme() {
      return {
        color: getThemeValue(this.theme).titleColor,
      };
    },
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
      this.chartInstance = this.$echarts.init(this.$refs.trend, this.theme);
      this.chartInstance.setOption(initOption);
    },
    // ret就是服服务端发送给客户端的，即realData
    getData(ret) {
      // 获得数据
      // const { data: ret } = await this.$http.get("trend");
      this.allData = ret;
      this.updateChart();
    },
    updateChart() {
      // 处理数据
      const timeArr = this.allData.common.month;
      const valueArr = this.allData[this.currentSelect].data;
      // series中有多组数据，使用return
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: "line",
          data: item.data,
          stack: this.currentSelect,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index],
              },
              {
                offset: 1,
                color: colorArr2[index],
              },
            ]),
          },
        };
      });
      // 图例数据
      const legendArr = valueArr.map((item) => {
        return item.name;
      });
      const dataOption = {
        xAxis: {
          data: timeArr,
        },
        // 图例
        legend: {
          data: legendArr,
        },
        series: seriesArr,
      };
      this.chartInstance.setOption(dataOption);
    },

    screenAdapter() {
      this.titleFontSize = (this.$refs.trend.offsetWidth / 100) * 3.6;
      const adapterOption = {
        xAxis: {
          axisLabel: {
            fontSize: this.titleFontSize / 2,
          },
        },
        yAxis: {
          axisLabel: {
            fontSize: this.titleFontSize / 2,
          },
        },
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
        },
      };
      this.chartInstance.setOption(adapterOption);
      // 要调用实例的resize方法
      this.chartInstance.resize();
    },
    handleSelect(currentType) {
      this.currentSelect = currentType;
      this.updateChart();
      this.showSelect = false;
    },
  },
};
</script>

<style scoped>
.trend {
  position: relative;
}
.trend_title {
  position: absolute;
  top: 20px;
  left: 20px;
  color: #fff;
  z-index: 10;
}
</style>