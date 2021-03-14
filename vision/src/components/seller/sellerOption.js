export const initOption = {
  title: {
    text: "▎商家销售统计",
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
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "line",
      z: 0,
      lineStyle: {
        color: "#2d3443",
      },
    },
  },
  series: [
    {
      type: "bar",
      label: {
        show: true,
        position: "right",
        textStyle: {
          color: "#fff",
        },
      },
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: "#5052ee",
            },
            {
              offset: 1,
              color: "#ab6ee5",
            },
          ]
        }
      }
    },
  ],
}