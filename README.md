## vue 地址坐标选择

### 安装
```js
npm install @xpf0000/vue-location-choose
```

### 使用
```js
// 引用
import Vue from 'vue'
import BaseLocationChoose from '@xpf0000/vue-location-choose'
Vue.use(BaseLocationChoose, {
  type: 'QQ',
  key: '',
  keyName: ''
})

// 使用
this.$baseLocationChoose().then((res) => {
          console.log('res: ', res)
        })
```
