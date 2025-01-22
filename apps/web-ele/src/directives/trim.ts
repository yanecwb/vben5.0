/**
 * 去除两边空格
 * 使用 <el-input v-model="xxx" v-trim></el-input>
 */
function getInput(el: { tagName: string; querySelector: (arg0: string) => any }) {
  let inputEle
  if (el.tagName !== 'INPUT') {
    inputEle = el.querySelector('input')
  } else {
    inputEle = el
  }
  return inputEle
}
function dispatchEvent(el: { dispatchEvent: (arg0: Event) => void }, type: string) {
  const evt = document.createEvent('HTMLEvents')
  evt.initEvent(type, true, true)
  el.dispatchEvent(evt)
}
export const trim:any = {
  inserted: (el: any) => {
    const inputEle = getInput(el)
    const handler = function (event: { target: { value: string } }) {
      const newVal = event.target.value.trim()
      if (event.target.value != newVal) {
        event.target.value = newVal
        dispatchEvent(inputEle, 'input')
      }
    }
    el.inputEle = inputEle
    el._blurHandler = handler
    if (inputEle) {
      inputEle.addEventListener('blur', handler)
    }
  },
  unbind(el: { _blurHandler?: any; inputEle?: any }) {
    const { inputEle } = el
    if (inputEle) {
      inputEle.removeEventListener('blur', el._blurHandler)
    }
  }
}
