<template>
  <div class="hot">
    <div class="hot_contain" ref="hot"></div>
    <span class="left" @click="left_click" :style="somStyle">＜</span>
    <span class="right" @click="right_click" :style="somStyle">＞</span>
    <span class="title" :style="somStyle">
      {{ catName }}
    </span>
  </div>
</template>

<script>
import { initOption } from "@/components/hot/hotOption";
import { commonData } from "@/common/mixin";
export default {
  name: "SellerPage",
  data() {
    return {
      currentIndex: 0,
      titleFontSize: 0,
    };
  },
  mixins: [commonData],
  computed: {
    catName() {
      if (!this.allData) {
        return "";
      } else {
        return this.allData[this.currentIndex].name;
      }
    },
    somStyle() {
      return {
        fontSize: this.titleFontSize + "px",
      };
    },
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
      this.chartInstance = this.$echarts.init(this.$refs.hot, "chalk");
      this.chartInstance.setOption(initOption);
    },
    // 获取数据
    async getData() {
      const { data: ret } = await this.$http.get("hotproduct");
      this.allData = ret;
      this.updateChart();
      // this.startInterval();
    },
    updateChart() {
      const legendData = this.allData[this.currentIndex].children.map(
        (item) => {
          return item.name;
        }
      );
      // 传入children给series就可以在tooltip的formatter的回调函数参数arg的data中拿到
      const seriesData = this.allData[this.currentIndex].children.map(
        (item) => {
          return {
            name: item.name,
            value: item.value,
            children: item.children,
          };
        }
      );
      const dataOption = {
        legend: {
          data: legendData,
        },
        series: [
          {
            data: seriesData,
          },
        ],
      };
      // 使用
      this.chartInstance.setOption(dataOption);
    },

    // 屏幕适配
    screenAdapter() {
      this.titleFontSize = (this.$refs.hot.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        legend: {
          itemWidth: this.titleFontSize / 2,
          itemHeight: this.titleFontSize / 2,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
        },
        series: [
          {
            radius: this.titleFontSize * 5,
            center: ["50%", "60%"],
          },
        ],
      };
      this.chartInstance.setOption(adapterOption);
      // 要调用实例的resize方法
      this.chartInstance.resize();
    },
    right_click() {
      if (this.currentIndex >= 2) {
        this.currentIndex = 0;
      } else {
        this.currentIndex++;
      }
      this.updateChart();
    },
    left_click() {
      if (this.currentIndex <= 0) {
        this.currentIndex = 2;
      } else {
        this.currentIndex--;
      }
      this.updateChart();
    },
  },
};
</script>

<style lang='less' scoped>
.left,
.right {
  position: fixed;
  top: 50%;
  color: #fff;
  z-index: 10;
  // 使文字不能选中
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  // 更改鼠标样式
  cursor: pointer;
}
.left {
  left: 10%;
}
.right {
  right: 10%;
}
.title {
  position: fixed;
  bottom: 10%;
  right: 5%;
  color: #fff;
}
</style>