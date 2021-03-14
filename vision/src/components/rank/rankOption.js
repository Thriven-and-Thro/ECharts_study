export const initOption = {
  title: {
    text: "▎地区销售排行",
    left: 20,
    top: 20,
  },
  grid: {
    top: "40%",
    left: "5%",
    right: "5%",
    bottom: "5%",
    // 是位置设置包含文字
    containLabel: true,
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
  xAxis: {
    type: 'category'
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      type: 'bar'
    }
  ]
}
export const colorArr = [
  ['#0BA82C', '#4FF778'],
  ['#2E72BF', '#23E5E5'],
  ['#5052EE', '#AB6EE5']
]