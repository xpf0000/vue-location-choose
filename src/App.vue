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
        this.$baseLocationChoose(this.location).then((res) => {
          console.log('res: ', res)
          this.location = res
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
