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
import { mapState } from "vuex";
import { getThemeValue } from "@/utils/theme_utils.js";
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
    ...mapState(["theme"]),
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
        color: getThemeValue(this.theme).titleColor,
      };
    },
  },
  created() {
    // 注册回调函数
    this.$socket.registerCallBack("hotData", this.getData);
  },
  mounted() {
    this.initChart();
    // this.getData();
    // 发送数据给服务器
    this.$socket.send({
      action: "getData",
      socketType: "hotData",
      chartName: "hotproduct",
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
    this.$socket.unRegisterCallBack("hotData");
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
      this.chartInstance = this.$echarts.init(this.$refs.hot, this.theme);
      this.chartInstance.setOption(initOption);
    },
    // 获取数据
    getData(ret) {
      // const { data: ret } = await this.$http.get("hotproduct");
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
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize * 0.8,
          },
        },
        series: [
          {
            radius: this.titleFontSize * 4,
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
.hot {
  position: relative;
}
.left,
.right {
  position: absolute;
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
  position: absolute;
  bottom: 10%;
  right: 5%;
  color: #fff;
}
</style>