<template>
  <div class="map">
    <div class="map_contain" ref="map" @dblclick="revertMap"></div>
  </div>
</template>

<script>
import axios from "axios";
import { initOption } from "@/components/map/mapOption";
import { commonData } from "@/common/mixin";
import { getProvinceMapInfo } from "@/common/map_utils";
export default {
  name: "MapPage",
  data() {
    return {
      mapData: {},
    };
  },
  mixins: [commonData],
  mounted() {
    this.initChart();
    // 监听屏幕变化
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    // 注销事件
    window.removeEventListener("resize", this.screenAdapter);
    this.chartInstance = null;
  },
  methods: {
    // 初始化
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map, "chalk");

      // 从本地获取
      const ret = await axios.get(
        "http://localhost:8999/static/map/china.json"
      );
      this.$echarts.registerMap("china", ret.data);
      this.chartInstance.setOption(initOption);
      this.getData();

      // 地图点击
      this.chartInstance.on("click", async (arg) => {
        const provinceInfo = getProvinceMapInfo(arg.name);
        if (!provinceInfo.key) {
          return;
        } else {
          if (!this.mapData[provinceInfo.key]) {
            const ret = await axios.get(
              "http://localhost:8999" + provinceInfo.path
            );
            this.mapData[provinceInfo.key] = ret.data;
            this.$echarts.registerMap(provinceInfo.key, ret.data);
          }
          const changeOption = {
            geo: {
              map: provinceInfo.key,
            },
          };
          this.chartInstance.setOption(changeOption);
        }
      });
    },
    // 获取数据
    async getData() {
      const { data: ret } = await this.$http.get("map");
      this.allData = ret;
      this.updateChart();
    },
    updateChart() {
      const legendArr = this.allData.map((item) => {
        return item.name;
      });
      const seriesArr = this.allData.map((item) => {
        return {
          type: "effectScatter",
          name: item.name,
          data: item.children,
          coordinateSystem: "geo",
          rippleEffect: {
            scale: 5,
            brushType: "stroke",
          },
          symbolSize: 20,
        };
      });
      const dataOption = {
        legend: {
          data: legendArr,
        },
        series: seriesArr,
      };
      // 使用
      this.chartInstance.setOption(dataOption);
    },
    // 屏幕适配
    screenAdapter() {
      const titleFontSize = (this.$refs.map.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2,
          },
        },
        geo: {
          label: {
            fontSize: titleFontSize / 2,
          },
        },
      };
      this.chartInstance.setOption(adapterOption);
      // 要调用实例的resize方法
      this.chartInstance.resize();
    },
    // 双击返回
    revertMap() {
      const revertOption = {
        geo: {
          map: "china",
        },
      };
      this.chartInstance.setOption(revertOption);
    },
  },
};
</script>

<style lang='less' scoped>
</style>