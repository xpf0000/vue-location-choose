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
    return this.$baseDialog(BaseLocationChoose)
      .data(data)
      .title('选择地址')
      .className('location-choose-dialog')
      .show()
  }
}

const plugin = {
  install
}

export default plugin
