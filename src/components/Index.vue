<template>
    <div class="mapItem">
        <b-row>
            <b-col cols="5" class="scrollHeight">
                <search-bar class="searchBar" :data="dataSource" @updated="updated"/>
            </b-col>
            <b-col cols="7"  class="scrollHeight">
                <div class="w-100 map" id="map"></div>
            </b-col>
        </b-row>
        <div class="d-flex justify-content-center align-items-center mb-3">
            <loading class="spinning" :isLoading="isLoading"/>
        </div>
    </div>
</template>
<script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"></script>
<script>
  import L from "leaflet";
  import 'leaflet.markercluster';
  import settings from '../assets/setting.json'
  import SearchBar from './SearchBar'
  import Loading from "./Loading";
  export default {
  name: 'Index',
      components: {
          SearchBar,
          Loading,
      },
  data(){
    return{
        masksURL:'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json?fbclid=IwAR1_UoJFvXnQz73Z2gLR0ZbFK2zVsw8Uf6l2hwtmZQM48YA8UpkPx4PSCyA',
        zoom:settings.zoom,
        url: settings.url,
        attribution: settings.attribution,
        geolocation: false,
        isLoading:true,
        userPosition: null,
        dataSource:[],
        center:[22.604799,120.2976256],
        icons: {
            grey: this.customIcon('grey'),
            yellow: this.customIcon('yellow'),
            green: this.customIcon('green'),
            red: this.customIcon('red')
        },
        map:{},
        mask:{},
    }
  },
  methods:{
         getPopup (item) {
          let phone = `(${item.phone.substr(0, 2)}) ${item.phone.substr(4, 4)}-${item.phone.substr(8)}`
          return `
        <h3 class="storeTitle">${item.name}</h3>
        <div class="storeInfo">
          <div><i class="iconMap mapIcon"></i> <a target="_blank" href="https://www.google.com.tw/maps/place/${item.address}">${item.address}</a></div>
          <div><i class="iconMap phoneIcon"></i> <a href="tel:+886-${item.phone.substring(1).replace(' ', '')}">${phone}</a></div>
          <hr>
          <div class="maskStock">
           <div class="adult">成人口罩: ${item.mask_adult}</div>
          <div class="child">小孩口罩: ${item.mask_child}</div>
          </div>
          <div class="updateTime">更新時間: ${item.updated === '' ? '(不明)' : item.updated}</div>
        </div>
      `
      },
      handleCustomIcon(markers,feature, latLng){
        let prop = feature.properties
        let range = prop.mask_adult + prop.mask_child
        let rangeIcon = this.icons.grey
        if (range > 100) {
            rangeIcon = this.icons.green
        } else if (range > 50) {
            rangeIcon = this.icons.yellow
        } else if (range > 0) {
            rangeIcon = this.icons.red
        }
          markers.addLayer(L.marker(latLng, {icon: rangeIcon}).
          bindPopup(this.getPopup(feature.properties)));

          return  markers
    },
    handleMap(data){
        let map = L.map('map', {
            center: this.center,
            zoom: 8,
            minZoom: 8,
        });
        this.map = map
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        map.locate({setView: true})//第一次進來會詢問使用者是否允許定位
        this.handlePosition(map)
        let markers = new L.MarkerClusterGroup().addTo(map);
        for(let i =0;data.length>i;i++){
            this.handleCustomIcon(markers,data[i],[data[i].geometry.coordinates[1],data[i].geometry.coordinates[0]])
        }
        map.addLayer(markers);
    },
    handlePosition(map){
      // 定位
      const vm = this
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    // 有使用者位置資訊就以定位為中心
                    function (position) {
                        vm.geolocation = true;
                        vm.userPosition = [position.coords.latitude, position.coords.longitude];
                        vm.zoom = 19;
                        map.setView(new L.LatLng(vm.userPosition[0], vm.userPosition[1]), vm.zoom);
                        vm.userMarker = L.marker([vm.userPosition[0], vm.userPosition[1]], { icon: vm.customIcon('red') });
                        map.addLayer(vm.userMarker);
                    }
                );
            }
    },
      customIcon (color) {
          return L.icon({
              ...settings.icon,
              iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`
          })
      },
      updated(data){
          this.center = [data[0].geometry.coordinates[1],data[0].geometry.coordinates[0]]
          this.map.panTo(this.center, 16)
      },
    handleInit(){
        this.$http.get(this.masksURL).then((data)=>{
            this.dataSource = data.data.features
            this.handleMap(this.dataSource)
            this.isLoading=false
        })
    }
  },
  created() {
      this.handleInit()
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import "~leaflet.markercluster/dist/MarkerCluster.css";
    @import "~leaflet.markercluster/dist/MarkerCluster.Default.css";


</style>
