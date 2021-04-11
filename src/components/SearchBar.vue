<template>
  <div>
    <div class="bar">
      <b-form-group label-cols-sm="2" label="縣市：" label-for="county">
        <b-form-select
          sm="10"
          @change="handleCountyChange(selectedCounty)"
          class="searchCounty"
          id="county"
          v-model="selectedCounty"
          :options="countyList"
        />
      </b-form-group>
      <b-form-group label-cols-sm="2" label="地區：" label-for="town">
        <b-form-select
          sm="10"
          class="searchCounty"
          id="town"
          @change="handleTown(selectedTown)"
          v-model="selectedTown"
          :options="cityList"
        />
      </b-form-group>
      <span class="amountDesc"
        >有取得口罩數量的藥局有
        <span class="amount">{{ filterData.length }}</span> 家</span
      >
    </div>
    <div class="result">
      <ul>
        <li
          v-for="(item, index) in filterData"
          :key="index"
          class="resultItem p-4"
        >
          <span class="storeTitle">{{ item.properties.name }}</span>
          <div class="storeInfo">
            <div>
              <i class="icon mapIcon"></i>
              <a
                target="_blank"
                :href="`https://www.google.com.tw/maps/place/${item.properties.address}`"
                >{{ item.properties.address }}</a
              >
            </div>
            <div>
              <i class="icon phoneIcon"></i>
              <a
                :href="`tel:+886-${item.properties.phone
                  .substring(1)
                  .replace(' ', '')}`"
                >{{ item.properties.phone }}</a
              >
            </div>
            <div class="maskStock">
              <div :class="` adult adult${item.properties.mask_adult}`">
                成人口罩:
                {{
                  item.properties.mask_adult
                    ? item.properties.mask_adult
                    : "已售完"
                }}
              </div>
              <div :class="`child child${item.properties.mask_child}`">
                小孩口罩:
                {{
                  item.properties.mask_child
                    ? item.properties.mask_child
                    : "已售完"
                }}
              </div>
            </div>
            <div class="updateTime">
              更新時間:
              {{
                item.properties.updated === ""
                  ? "(不明)"
                  : item.properties.updated
              }}
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import district from "@/assets/json/district";
export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      today: "",
      date: moment().format("YYYY-MM-dd"),
      countyList: [],
      cityList: [],
      selectedCounty: "臺北市",
      selectedTown: "",
      searchText: "",
      updatedData: [],
      district,
    };
  },
  computed: {
    filterData: {
      get: function () {
        const vm = this;
        const filterCountyData = vm.data.filter((item) => {
          return item.properties.county === vm.selectedCounty;
        });
        const filterInputData = vm.data.filter((item) => {
          return item.properties.address.includes(vm.searchText);
        });
        const filterData = vm.data.filter((item) => {
          return (
            item.properties.county === vm.selectedCounty &&
            item.properties.town === vm.selectedTown
          );
        });
        vm.updatedData = vm.searchText
          ? filterInputData
          : vm.selectedTown
          ? filterData
          : filterCountyData;
        return vm.updatedData;
      },
    },
  },
  methods: {
    handleCountry() {
      for (let [key, value] of Object.entries(this.district.areaData)) {
        this.countyList.push({ value: key, text: key, towns: value });
      }
    },
    handleCountyChange(value) {
      console.log(value);
      Object.values(this.countyList).forEach((item) => {
        if (value === item.value) {
          this.cityList = [];
          this.cityList.push({ value: null, text: "請選擇" });
          this.selectedTown = null;
          for (let [key, value] of Object.entries(item.towns)) {
            this.cityList.push({ value: value, text: value, key: key });
          }
        }
      });
    },
    handleTown() {},
  },
  watch: {
    updatedData: {
      deep: true,
      handler() {
        console.log(this.updatedData);
        if (this.updatedData.length) this.$emit("updated", this.updatedData);
      },
    },
  },
  mounted() {
    console.log(this.selectedTown);
  },
  created() {
    this.handleCountry();
    this.handleCountyChange(this.selectedCounty);
  },
};
</script>

