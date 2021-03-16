const theme = {
  chalk: {
    backgroundColor: '#161522',
    titleColor: '#fff',
    backgroundExpand: "/img/expand.88903f88.svg",
    backgroundNarrow: "/img/narrow.0aed56f7.svg",
  },
  vintage: {
    backgroundColor: '#eee',
    titleColor: '#000',
    backgroundExpand: "/img/expand2.1d557753.svg",
    backgroundNarrow: '/img/narrow2.347bca2b.svg'
  }
}

export function getThemeValue(themName) {
  return theme[themName]
}