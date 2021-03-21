<template>
  <div id="app">
    <el-button @click="show">显示弹窗</el-button>
  </div>
</template>

<script>
  export default {
    name: 'App',
    mounted() {},
    methods: {
      show() {
        this.$baseLocationChoose().then((res) => {
          console.log('res: ', res)
        })
      }
    }
  }
</script>
<style>
  #app {
    height: 100vh;
  }
</style>
