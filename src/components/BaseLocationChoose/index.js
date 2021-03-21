import BaseDialog from '@xpf0000/vue-element-dialog'
import BaseLocationChoose from './index.vue'
function install(
  Vue,
  opt = {
    type,
    key,
    keyName
  }
) {
  if (install.installed) return
  install.installed = true
  Vue.use(BaseDialog)
  Vue.prototype.$baseLocationChoose = function (
    location = {
      city: '',
      address: '',
      lng: '',
      lat: ''
    }
  ) {
    let data = JSON.parse(JSON.stringify(opt))
    data.location = location
    return Vue.prototype
      .$baseDialog(BaseLocationChoose)
      .data(data)
      .title('选择地址')
      .className('location-choose-dialog')
      .show()
  }
}

const plugin = {
  install
}

let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue
}
if (GlobalVue) {
  GlobalVue.use(plugin)
}

export default plugin
