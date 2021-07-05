<template>
  <ul class="common-location-choose">
    <li class="tool">
      <el-row type="flex" align="middle" justify="space-between">
        <span>详细地址:</span>
        <el-col :span="4">
          <el-input
            v-model="location.city"
            class="city"
            placeholder="城市"
            @input="cityChange"
          ></el-input>
        </el-col>
        <el-col :span="10">
          <el-autocomplete
            v-model="location.address"
            class="address"
            :fetch-suggestions="querySearch"
            placeholder="输入地址"
          ></el-autocomplete>
        </el-col>
        <el-button @click="searchKeyword">搜索位置</el-button>
      </el-row>
    </li>
    <li id="postion-container"></li>
  </ul>
</template>
<script>
  /**
   * @author 徐鹏飞
   * @desc 通用坐标选择
   */
  export default {
    components: {},
    props: {},
    data() {
      return {
        location: {
          detail: {},
          city: '',
          address: '',
          lat: '',
          lng: ''
        },
        type: 'QQ',
        key: '',
        keyName: ''
      }
    },
    watch: {
      'location.lat': {
        handler() {
          this.findAddressByLatLng()
        },
        immediate: true
      },
      'location.lng': {
        handler() {
          this.findAddressByLatLng()
        },
        immediate: true
      }
    },
    created() {
      this.addresses = []
      this.markers = []
    },
    mounted() {
      this.initQQ()
    },
    methods: {
      findAddressByLatLng() {
        if (!this.geocoder) {
          this.geocoder = new qq.maps.Geocoder()
          this.geocoder.setComplete((result) => {
            console.log('geocoder getAddress: ', result)
            let info = result.detail.addressComponents
            let city = info.city
            let address = result.detail.nearPois[0].name
            this.location.city = city
            this.location.detail = info
            if (this.isClick) {
              this.location.address = address
              this.addresses = result.detail.nearPois.map((item) => {
                return { value: item.name }
              })
            }
            this.isClick = false
          })
        }
        if (!this.location.lat || !this.location.lng) {
          return
        }
        this.geocoder.getAddress(
          new qq.maps.LatLng(this.location.lat, this.location.lng)
        )
      },
      cityChange() {
        this.addresses = []
      },
      onSubmit() {
        for (let k in this.location) {
          if (!this.location[k]) {
            this.$message.warning('请选择一个位置')
            return
          }
        }
        this.callBack &&
          this.callBack(JSON.parse(JSON.stringify(this.location)))
      },
      getLocation() {
        this.geolocation.getLocation(
          (position) => {
            let curr_lat = position.lat
            let curr_lng = position.lng
            // 逆地址解析，设置起点的地址位置
            let center = new qq.maps.LatLng(curr_lat, curr_lng)
            if (!this.changed) this.map.setCenter(center)
          },
          null,
          { timeout: 20000 }
        )
      },
      querySearch(queryString, cb) {
        cb(this.addresses)
      },
      //清除地图上的marker
      clearOverlays(overlays) {
        let overlay
        while ((overlay = overlays.pop())) {
          overlay.setMap(null)
        }
        this.markers.forEach(function (item, index, arr) {
          item.setMap(null)
        })
        this.markers = []
      },
      //点击搜索
      searchKeyword() {
        this.isClick = false
        this.changed = true
        this.clearOverlays(this.markers) //清除地图上的marker
        this.searchService.setLocation(this.location.city)
        this.searchService.search(this.location.address)
      },
      initQQ() {
        this.geolocation = new qq.maps.Geolocation(this.key, this.keyName)
        let center
        let hasloc = false

        let lat = this.location.lat
        let lng = this.location.lng

        if (lat !== '' && lng !== '') {
          hasloc = true
          center = new qq.maps.LatLng(lat, lng)
        } else {
          center = new qq.maps.LatLng(39.918056, 116.397027)
        }

        let opt = { zoom: 14 }
        if (center) opt['center'] = center
        this.map = new qq.maps.Map(
          document.getElementById('postion-container'),
          opt
        )
        if (hasloc) {
          let marker = new qq.maps.Marker({
            position: center,
            map: this.map
          })
          this.markers.push(marker)
        }
        //添加监听事件   获取鼠标单击事件
        qq.maps.event.addListener(this.map, 'click', (event) => {
          this.isClick = true
          this.changed = true
          this.clearOverlays(this.markers)
          let marker = new qq.maps.Marker({
            position: event.latLng,
            map: this.map
          })
          this.markers.push(marker)
          this.location.lat = marker.position.lat
          this.location.lng = marker.position.lng
        })
        this.searchService = new qq.maps.SearchService({
          complete: (results) => {
            if (results.type === 'CITY_LIST') {
              this.$message.warning('查询结果过多,请添加所在城市重新搜索')
              return
            }
            let pois = results.detail.pois
            console.log('pois: ', pois)
            if (pois && pois[0]) {
              let poi = pois[0]
              this.location.lat = poi.latLng.lat
              this.location.lng = poi.latLng.lng
              let marker = new qq.maps.Marker({
                map: this.map,
                position: poi.latLng
              })
              marker.setTitle(poi.name)
              this.markers.push(marker)

              this.map.setCenter(poi.latLng)
              this.map.setZoom(14)
              this.map.zoomTo(14)
            }
            this.addresses = pois.map((item) => {
              return { value: item.name }
            })
          }
        })
        if (!hasloc) {
          this.getLocation()
        }
      }
    }
  }
</script>
<style lang="scss">
  .common-location-choose {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 500px;
    padding: 0 20px;
    list-style: none;
    user-select: none;
    box-sizing: border-box;

    > li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;

      .el-row {
        width: 100%;
      }
    }

    .tool {
      flex-shrink: 0;
      margin-bottom: 24px;

      .el-autocomplete {
        width: 100%;
      }
    }

    #postion-container {
      flex: 1;
    }
  }
</style>
