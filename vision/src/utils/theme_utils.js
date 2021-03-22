const theme = {
  chalk: {
    backgroundColor: '#161522',
    titleColor: '#fff',
  },
  vintage: {
    backgroundColor: '#eee',
    titleColor: '#000',
  }
}

export function getThemeValue(themName) {
  return theme[themName]
}