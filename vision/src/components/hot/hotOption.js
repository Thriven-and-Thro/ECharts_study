export const initOption = {
  series: [
    {
      type: 'pie',
      label: {
        show: false,
      },
      // 处于高亮时
      emphasis: {
        label: {
          show: true
        },
        labelLine: {
          show: false
        }
      }
    }
  ],
  title: {
    text: "▎热销商品的占比",
    left: 20,
    top: 20,
  },
  legend: {
    top: '15%',
    icon: 'circle'
  },
  tooltip: {
    show: true,
    formatter: (arg) => {
      const thirdCategory = arg.data.children
      // 三级菜单总和
      let total = 0
      thirdCategory.forEach(item => {
        total += item.value
      })
      // 计算出百分比并拼接
      let retStr = ''
      thirdCategory.forEach(item => {
        retStr += `
        ${item.name}:${parseInt(item.value / total * 100) + '%'}
        </br>
        `
      })
      return retStr
    }
  }
}