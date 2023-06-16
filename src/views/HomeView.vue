<template>
  <!-- 首页视图 -->
  <div
    class="w-full h-full dark:bg-blue-100 bg-gradient-to-tr from-white bg-blue-100 pt-2 pb-20"
  >
    <!-- 使用组件导航栏 -->
    <HearthNav
      @changeCityView="changeCityView"
      @giveinitCity="giveinitCity"
      @goHomeShow="goHomeShow"
    ></HearthNav>
    <!-- 展示天气 -->
    <main class="showWeather px-2">
      <div
        class="max mt-5 mx-auto rounded-2xl p-5 bg-opacity-100 dark:bg-blue-300"
        :class="`${bg}`"
      >
        <div class="top flex items-center justify-start">
          <i
            class="fa-solid fa-location-dot mr-2 dark:text-blue-500"
            v-show="gps"
          ></i>
          <h1 class="text-xl font-semibold flex-1 dark:text-blue-500">
            {{ ipcity }}
          </h1>
          <h1 class="text-xs opacity-70 dark:text-blue-500">{{ nowDate }}</h1>
        </div>
        <div
          class="showAQI w-14 h-6 rounded-xl float-right text-sm font-semibold flex items-center justify-center mt-5 opacity-100 text-blue-400 dark:text-blue-500 dark:bg-blue-200"
          :class="`${bg}`"
        >
          AQI&nbsp;{{ ipcitylist.list.humidity >= 50 ? "良" : "差" }}
        </div>
        <div class="middle w-full mx-auto relative">
          <div class="top w-full flex items-end justify-center">
            <i
              :class="`qi-${ipcitylist.list.icon} ${fontbg}`"
              class="text-9xl text-gray-800"
            ></i>
            <div class="absolute right-1 translate-y-12">
              <div
                class="opacity-80 text-blue-300 flex justify-between items-center dark:text-blue-500"
              >
                <i
                  class="fa-solid fa-person text-xl mr-3 text-blue-300 dark:text-blue-500"
                ></i
                ><span class="text-xl"
                  >{{ ipcitylist.list.feelsLike }}&#8451;</span
                >
              </div>
              <div
                class="opacity-80 text-blue-300 flex justify-between items-center mt-3 dark:text-blue-500"
              >
                <i
                  class="fa-solid fa-droplet text-xl text-blue-300 mr-3 dark:text-blue-500"
                ></i
                ><span class="text-xl">{{ ipcitylist.list.humidity }}%</span>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full text-center text-2xl my-4 mt-5" :class="`${fontbg}`">
          {{ ipcitylist.list.text }}
          <span :class="`${fontbg}`" class="text-2xl opacity-80"
            >{{ ipcitylist.list.temp }}&#8451;
          </span>
        </div>
        <div
          class="buttom flex items-center justify-between w-full h-24 mx-auto rounded-3xl bg-opacity-0 px-5"
          :class="`${bg}`"
        >
          <p class="flex flex-col justify-start dark:text-blue-500">
            <span
              class="text-black font-semibold text-xl mb-1 dark:text-blue-500"
              >{{ ipcitylist.list.windScale }}</span
            >
            <span class="text-sm">{{ ipcitylist.list.windDir }}</span>
          </p>
          <p class="flex flex-col justify-start dark:text-blue-500">
            <span
              class="text-black font-semibold text-xl mb-1 dark:text-blue-500"
            >
              {{ ipcitylist.list.humidity }}%</span
            >
            <span class="text-sm">相对湿度</span>
          </p>
          <p class="flex flex-col justify-start dark:text-blue-500">
            <span
              class="text-black font-semibold text-xl mb-1 dark:text-blue-500"
            >
              {{ ipcitylist.list.precip }}</span
            >
            <span class="text-sm">降雨量</span>
          </p>
        </div>
      </div>
    </main>
    <!-- 24小时天气 -->
    <main class="showWeather px-2">
      <div
        class="max mt-5 mx-auto rounded-2xl p-5 bg-opacity-60 dark:bg-blue-200"
        :class="`${bg}`"
      >
        <div class="text-blue element">
          <h1 class="mb-4 text-xl text-center dark:text-blue-500">
            24小时天气
          </h1>
          <div class="flex gap-5 overflow-x-scroll element">
            <div
              class="flex flex-col gap-2 items-center element p-5 rounded-2xl bg-opacity-50"
              :class="`${item.bg2}`"
              v-for="(item, index) in dayWearthList.list"
              :key="index"
            >
              <i :class="`qi-${item.icon} ${item.bg}`" class="text-3xl"></i>
              <p class="text-xs dark:text-blue-500" :class="`${item.bg}`">
                {{ item.text }}
              </p>
              <p class="text-xs dark:text-blue-500">{{ item.temp }}&#8451;</p>
              <p class="text-xs dark:text-blue-500">
                {{ dayjs(item.fxTime).hour() }}时
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
    <!-- 折线图 -->
    <main class="showWeather px-2">
      <div
        class="max mt-5 rounded-2xl px-5 h-80 pt-10 bg-opacity-60 dark:bg-blue-200"
        :class="`${bg}`"
        id="main"
      ></div>
    </main>
    <!-- 7天天气显示 -->
    <main class="showWeather px-2">
      <div
        class="max mt-5 mx-auto rounded-2xl px-5 bg-opacity-60 dark:bg-blue-200 dark:text-blue-500"
        :class="`${bg}`"
      >
        <ul class="py-2 flex flex-col">
          <h1 class="my-4 text-xl text-center flex-1">未来7天天气</h1>
          <li
            v-for="(item, index) in sevenWearthList.list"
            :key="index"
            class="my-2 flex items-center p-3 rounded-2xl bg-opacity-50"
            :class="`${item.bg2}`"
          >
            <p class="text-xm flex-1">
              {{
                weekDay.list[new Date(Date.parse(`${item.fxDate}`)).getDay()]
              }}
            </p>
            <i
              :class="`qi-${item.iconDay} ${item.bg}`"
              class="text-4xl flex-1 text-right"
              v-show="nowHour < 18"
            ></i>
            <i
              :class="`qi-${item.iconNight} ${item.bg}`"
              class="text-4xl flex-1 text-right"
              v-show="nowHour >= 18"
            ></i>
            <div class="relative text-sm flex-1 text-right text-orange-500">
              {{ item.tempMax }}&#8451;
            </div>
            <div class="relative text-sm flex-1 text-right">
              {{ item.tempMin }}&#8451;
            </div>
            <div
              class="relative text-sm flex-1 text-right"
              :class="`${item.bg}`"
              v-show="nowHour < 18"
            >
              {{ item.textDay }}
            </div>
            <div
              class="relative text-sm flex-1 text-right"
              :class="`${item.bg}`"
              v-show="nowHour >= 18"
            >
              {{ item.textNight }}
            </div>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, reactive, onMounted } from "vue";
//引入axios
import axios from "axios";
//引入dayjs
import dayjs from "dayjs";
//引入组件
import HearthNav from "../components/HearthNav.vue";
import * as echarts from "echarts";
//挂载配置
onMounted(() => {
  //获取当前时间判断白天黑夜
  nowHour.value = dayjs().hour();
}),
  //销毁前配置
  onBeforeUnmount(() => {
    if (timer) {
      //清除定时器
      clearInterval(timer.value);
    }
  });
//定义背景色
const bg = ref("bg-gradient-to-tr from-blue-100 bg-white");
//定义图标背景色
const fontbg = ref("text-yellow-300");
//实时时间
const timer = ref("");
//获取到的时间
const nowDate = ref("");
//获取当前小时判断白天夜晚
const nowHour = ref("");
//开启定时器获取实时时间
timer.value = setInterval(() => {
  nowDate.value = dayjs().format("YYYY-MM-DD HH:mm:ss");
}, 1000);

//定义变量用于存储定位城市
const ipcity = ref("信阳市");
//定义变量用于存储定位城市
const ipcitylist = reactive({
  list: [],
});
//定义经纬度
const homelng = ref("");
const homelat = ref("");
const gps = ref("");
//拿到子组件传的参数
const giveinitCity = (value) => {
  if (value) {
    //定位城市
    ipcity.value = value[0];
    localStorage.setItem("name", ipcity.value);
    //定位城市天气详情
    ipcitylist.list = value[1].data.now;
    if (ipcitylist.list.text == "晴") {
      bg.value = "bg-gradient-to-tr from-blue-100  bg-white";
      fontbg.value = "text-yellow-300";
    } else {
      bg.value = "bg-gradient-to-tr from-black-100  bg-gray-0";
      fontbg.value = "text-gray-500";
    }
    //经纬度赋值
    homelng.value = value[2][0];
    homelat.value = value[2][1];
    gps.value = value[3];
    dayWearth();
    sevenWearth();
    weatherMess();
  }
};
//拿到子组件传的参数
const changeCityView = (value) => {
  if (value) {
    //定位城市
    ipcity.value = value[0];
    localStorage.setItem("name", ipcity.value);
    document.title = ipcity.value;
    //定位城市天气详情
    ipcitylist.list = value[1].data.now;
    if (ipcitylist.list.text == "晴") {
      bg.value = "bg-gradient-to-tr from-blue-100 bg-white";
      fontbg.value = "text-yellow-300";
    } else {
      bg.value = "bg-gradient-to-tr from-black-100 bg-gray-0";
      fontbg.value = "text-gray-500";
    }
    //经纬度赋值
    homelng.value = value[2][0];
    homelat.value = value[2][1];
    gps.value = value[3];
    dayWearth();
    sevenWearth();
    weatherMess();
  }
};
const goHomeShow = (value) => {
  if (value) {
    //定位城市
    ipcity.value = value[0];
    localStorage.setItem("name", ipcity.value);
    document.title = ipcity.value;
    //定位城市天气详情
    ipcitylist.list = value[1].data.now;
    if (ipcitylist.list.text == "晴") {
      bg.value = "bg-gradient-to-tr from-blue-100 bg-white";
      fontbg.value = "text-yellow-300";
    } else {
      bg.value = "bg-gradient-to-tr from-black-100 bg-gray-0";
      fontbg.value = "text-gray-500";
    }
    //经纬度赋值
    homelng.value = value[2][0];
    homelat.value = value[2][1];
    gps.value = value[3];
    dayWearth();
    sevenWearth();
    weatherMess();
  }
};
//天气适宜
const weatherMessage = reactive({ list: [] });
//当天天气指数
const weatherMess = async () => {
  if (homelng.value && homelat.value) {
    //获取当前定位城市天气
    let result = await axios.get(
      `https://devapi.qweather.com/v7/indices/1d?type=1,2&location=${homelng.value},${homelat.value}&key=${weatherKey}`
    );
    weatherMessage.list = result.data.daily;
  }
};
//和风天气开放api的key
const weatherKey = "633dcd9d393c4ff2931831e6d13c8f0a";
//24小时天气
const dayWearthList = reactive({ list: [] });
//获取24小时的天气
const dayWearth = async () => {
  if (homelng.value && homelat.value) {
    //获取当前定位城市天气
    let result = await axios.get(
      `https://devapi.qweather.com/v7/weather/24h?location=${homelng.value},${homelat.value}&key=${weatherKey}`
    );
    dayWearthList.list = result.data.hourly;
    dayWearthList.list.forEach((item) => {
      if (item.text == "晴") {
        item.bg = "text-yellow-500";
        item.bg2 = "bg-gradient-to-tr from-blue-100 bg-white";
      } else {
        item.bg = "text-gray-500";
        item.bg2 = "bg-gradient-to-tr from-black-100 bg-gray-0";
      }
    });
  }
};
//7天天气数组
const sevenWearthList = reactive({ list: [] });
//定义周几
let weekDay = reactive({
  list: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
});
let weekDay2 = reactive({
  list: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
});
//7天最高温度
let maxwearth = reactive([]);
//7天最低温度
let minwearth = reactive([]);
let newdata = reactive([]);
var myChart;
//获取7天天气情况
const sevenWearth = async () => {
  if (homelng.value && homelat.value) {
    //获取当前定位城市天气
    let result = await axios.get(
      `https://devapi.qweather.com/v7/weather/7d?location=${homelng.value},${homelat.value}&key=${weatherKey}`
    );
    sevenWearthList.list = result.data.daily;
    sevenWearthList.list.forEach((item) => {
      if (item.textDay == "晴") {
        item.bg = "text-yellow-500";
        item.bg2 = "bg-gradient-to-r from-blue-100 bg-white";
      } else {
        item.bg = "text-gray-500";
        item.bg2 = "bg-gradient-to-r from-black-100 bg-gray-0";
      }
      maxwearth.push(item.tempMax);
      minwearth.push(item.tempMin);
      newdata.push(
        weekDay2.list[new Date(Date.parse(`${item.fxDate}`)).getDay()]
      );
    });
    if (myChart != null && myChart != "" && myChart != undefined) {
      myChart.dispose();
    }
    myChart = echarts.init(document.getElementById("main"));
    // 绘制图表
    myChart.setOption({
      tooltip: {
        trigger: "axis",
      },
      legend: {},
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: newdata,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "最高温度/°C",
          type: "line",
          data: maxwearth,
          markPoint: {
            data: [
              { type: "max", name: "Max" },
              { type: "min", name: "Min" },
            ],
          },
          markLine: {
            data: [{ type: "average", name: "Avg" }],
          },
        },
        {
          name: "最低温度/°C",
          type: "line",
          data: minwearth,
          markPoint: {
            data: [
              { type: "max", name: "Max" },
              { type: "min", name: "Min" },
            ],
          },
          markLine: {
            data: [{ type: "average", name: "Avg" }],
          },
        },
      ],
    });
    maxwearth = reactive([]);
    minwearth = reactive([]);
    newdata = reactive([]);
  }
};
</script>
<style>
/* chrome 和 safari */
.element::-webkit-scrollbar {
  width: 0 !important;
}
/* ie10+ */
.element {
  -ms-overflow-style: none;
}
/* firefox */
.element {
  overflow: -moz-scrollbars-none;
}
</style>
