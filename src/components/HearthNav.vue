<template>
  <!-- 首页视图 -->
  <div class="w-full h-full">
    <!-- 搜索框-->
    <transition name="why">
      <div
        v-if="isShow"
        class="fixed bottom-0 w-full h-full px-10 z-30 dark:bg-blue-400 bg-gradient-to-tr from-white bg-blue-100"
      >
        <div
          class="top flex items-center justify-between border-b-2 border-black dark:text-blue-500 dark:border-blue-500"
        >
          <i
            class="fa-solid fa-magnifying-glass text-xl mr-5 text-black dark:text-blue-500"
          ></i>
          <input
            v-model="searchValue"
            @input="searchCity"
            type="text"
            placeholder="搜索城市天气"
            class="flex-1 h-10 text-left text-sm focus:outline-none font-semibold text-black bg-transparent dark:text-blue-500"
          />
          <!-- 关闭传送门 -->
          <button @click="closeIsShow" class="focus:outline-none cursor-none">
            <i
              class="fa-solid fa-xmark text-xl text-black dark:text-blue-500"
            ></i>
          </button>
        </div>
        <ul v-if="searchResult" class="text-center">
          <!-- 查询结果 -->
          <p
            class="py-2 text-left text-1xl mt-5 text-black dark:text-blue-500"
            v-if="searchError"
          >
            非常抱歉发生一些以外,请稍后重试!
          </p>
          <p
            class="py-2 text-left text-1xl mt-5 text-black dark:text-blue-500"
            v-if="searchResult.length === 0"
          >
            没有与您的查询匹配的结果,请尝试其它关键词!
          </p>
          <template v-else>
            <li
              v-for="searchItem in searchResult"
              class="text-left text-sm my-5 font-semibold text-black dark:text-blue-500"
              @click="changeCityView(searchItem)"
            >
              {{ searchItem.name }}-{{ searchItem.adm1 }}
            </li>
          </template>
        </ul>
      </div>
    </transition>
    <!-- 收藏地址天气 -->
    <transition name="why1">
      <div
        v-if="isShowjion"
        class="fixed bottom-0 w-full h-full dark:bg-blue-100 bg-gradient-to-tr from-white bg-blue-100 z-30 overflow-y-auto"
      >
        <!-- 收藏天气 -->
        <main class="showWeather px-2 h-full">
          <div
            class="max mt-5 mx-auto rounded-2xl bg-opacity-60 w-full py-5 dark:bg-blue-200 bg-gradient-to-tr from-blue-100 bg-white"
            v-for="(item, index) in jionWearthlistshow"
            :key="index"
            @click.prevent="goHomeShow(item)"
          >
            <h1 class="text-xl text-center dark:text-white flex items-center">
              <span class="flex-1 pl-12">{{ jionWearthname[index] }}</span>
              <button
                @click.stop="openisShowjion2(jionWearthname[index])"
                v-show="flag3"
                class="z-20"
              >
                <i class="fa-solid fa-heart text-xl mx-4 text-red-500"></i>
              </button>
            </h1>
            <div
              class="mx-auto w-4/5 h-28 mt-2 flex items-center flex-col justify-around text-xl dark:text-white"
            >
              <i
                :class="`qi-${jionWearthlistshow[0][0].iconDay}`"
                class="text-6xl"
              ></i>
              <p>{{ jionWearthlistshow[0][0].textDay }}</p>
              <p>今天</p>
            </div>
            <ul class="px-2 w-full h-4/5 mt-5">
              <li
                v-for="(item, index) in jionWearthlistshow[index]"
                class="mx-1 h-10 rounded-2xl bg-gradient-to-tr from-blue-100 bg-white my-2 flex items-center px-10 justify-around text-center dark:text-blue-500"
              >
                <p class="text-xl flex-1">
                  {{
                    weekDay.list[
                      new Date(Date.parse(`${item.fxDate}`)).getDay()
                    ]
                  }}
                </p>
                <p class="text-2xl flex-1">
                  <i :class="`qi-${item.iconDay}`"></i>
                </p>
                <p class="text-xl flex-1">{{ item.tempMax }}&#8451;</p>
                <p class="text-xl flex-1">{{ item.tempMin }}&#8451;</p>
              </li>
            </ul>
          </div>
        </main>
      </div>
    </transition>
    <!-- 顶部导航栏 -->
    <nav
      class="flex items-center px-5 h-14 shadow-md dark:bg-blue-200 fixed bottom-0 w-full justify-between z-30 dark:text-blue-500 bg-gradient-to-tr from-blue-100 bg-white"
    >
      <i
        class="fa-solid fa-magnifying-glass text-xl mx-4 dark:text-blue-500 focus:outline-none cursor-none text-blue-300"
        @click="openIsShow"
      ></i>
      <!-- 打开百度地图 -->
      <button class="text-xl mx-4" @click="getipcity" :disabled="flag4">
        <i
          class="fa-solid fa-location-dot dark:text-blue-500 text-blue-300"
        ></i>
      </button>
      <button @click="openisShowjion" v-show="flag3" class="focus:outline-none">
        <i :class="`${showjion}`"></i>
      </button>
      <button
        v-show="jionWearthlistshow.length"
        class="dark:bg-blue-500 bg-blue-300 rounded-lg flex items-center justify-center w-5 h-5"
        @click="showshow"
      >
        <strong class="text-blue-500 dark:text-blue-300">{{
          jionWearthlistshow.length
        }}</strong>
      </button>

      <!-- 深浅色切换 -->
      <label class="switch focus:outline-none cursor-none">
        <input
          type="checkbox"
          @click="wihtertoblack"
          class="focus:outline-none cursor-none"
        />
        <span class="slider focus:outline-none cursor-none"></span>
      </label>
    </nav>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineEmits } from "vue";
//引入axios
import axios from "axios";
import { Toast, Notify } from "vant";
//和风天气开放api的key
const weatherKey = "36dc06aaa9cf484689847e62cd004548";
//挂载前需要操作的函数
onMounted(() => {
  //获取定位城市
  getipcity();
});
//开启深色模式
const darkMode = () => {
  //这个条件用于判断当前系统应用模式是否开启了“暗”模式（win10在   个性化-颜色-选择默认应用模式  中修改）
  // if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  if (localStorage.theme === "dark" || !("theme" in localStorage)) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  localStorage.theme = "light";

  localStorage.theme = "dark";

  localStorage.removeItem("theme");
};
const lightMode = () => {
  document.documentElement.classList.remove("dark");
};
const wihtertoblackflag = ref(true);
//切换深色模式
const wihtertoblack = () => {
  if (wihtertoblackflag.value) {
    darkMode();
    wihtertoblackflag.value = false;
  } else {
    lightMode();
    wihtertoblackflag.value = true;
  }
};
//定义周几
let weekDay = reactive({
  list: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
});
//搜索框控制变量
const isShow = ref(false);
//控制收藏天气显示隐藏
const isShowjion = ref(false);
let flag = true;
let flag2 = true;
//定义收藏天气数组
let jionWearth = ref([]);
//定义收藏天气名称数组
let jionWearthname = ref([]);
//显示隐藏搜索
const openIsShow = () => {
  isShow.value = true;
  isShowjion.value = false;
};
const closeIsShow = () => {
  isShow.value = false;
};
//定义收藏样式
const showjion = ref("fa-regular fa-heart text-xl mx-4");
//收藏天气数组
let jionWearthlistshow = ref([]);
//显示隐藏收藏
const openisShowjion = () => {
  showjion.value = "fa-solid fa-heart text-xl mx-4 text-red-500";
  if (flag) {
    isShowjion.value = true;
    if (flag2 && flag3.value) {
      Notify({ type: "success", message: "收藏城市成功" });
      let id = JSON.parse(window.localStorage.getItem("cityId"));
      let idname = window.localStorage.getItem("name");
      jionWearthname.value.push(idname);
      jionWearth.value.push(id);
      let loveCity = async () => {
        //显示收藏天气数组
        let jionWearthlist = ref([]);
        jionWearth.value.forEach((item, index) => {
          //获取当前定位城市天气
          jionWearthlist.value.push(
            axios.get(
              `https://devapi.qweather.com/v7/weather/3d?location=${item[0]},${item[1]}&key=${weatherKey}`
            )
          );
        });
        const weatherData = await Promise.all(jionWearthlist.value);
        // console.log(weatherData.data);
        weatherData.forEach((item, index) => {
          jionWearthlistshow.value[index] = weatherData[index].data.daily;
          jionWearthlistshow.value[index]["myCity"] =
            jionWearthname.value[index];
          jionWearthlistshow.value[index]["id"] = jionWearth.value[index];
          jionWearth.value[index]["myCity"] = jionWearthname.value[index];
        });
      };
      loveCity();
      flag2 = false;
    }
    flag = false;
  } else {
    isShowjion.value = false;
    flag = true;
  }
  isShow.value = false;
};
const showshow = () => {
  if (isShowjion.value) {
    isShowjion.value = false;
  } else {
    isShowjion.value = true;
  }
};
const openisShowjion2 = (v) => {
  Notify({ type: "success", message: "已取消收藏该城市" });
  jionWearthlistshow.value = jionWearthlistshow.value.filter((item) => {
    return item["myCity"] != v;
  });
  jionWearth.value = jionWearth.value.filter((item) => {
    return item["myCity"] != v;
  });
  jionWearthname.value = jionWearthname.value.filter((item) => {
    return item != v;
  });
  if (document.title == v) {
    showjion.value = "fa-regular fa-heart text-xl mx-4";
    flag2 = true;
    flag = true;
    isShowjion.value = false;
  }
};
//定义emit
const emit = defineEmits(["giveinitCity", "changeCityView", "goHomeShow"]);
//点击收藏请求
const goHomeShow = async (v) => {
  //获取当前定位城市天气
  let result = await axios.get(
    `https://devapi.qweather.com/v7/weather/now?location=${v.id[0]},${v.id[1]}&key=${weatherKey}`
  );
  emit("goHomeShow", [v.myCity, result, [v.id[0], v.id[1]], "gps"]);
  Notify({ type: "success", message: "已成功切换城市" });
  flag = true;
  isShowjion.value = false;
};
//输入框value
const searchValue = ref("");
//搜索结果
const searchResult = ref(null);
//搜索是否错误
const searchError = ref(false);
//惰性搜索
const searchTimer = ref(null);
//搜索城市
const searchCity = () => {
  //防抖
  clearTimeout(searchTimer.value);
  //开启定时器
  searchTimer.value = setTimeout(async () => {
    //判断是否为空
    if (searchValue.value !== "") {
      try {
        const result = await axios.get(
          `https://geoapi.qweather.com/v2/city/lookup?location=${searchValue.value}&key=${weatherKey}`
        );
        if (result.data.location) {
          searchResult.value = result.data.location;
        } else {
          searchResult.value = [];
        }
      } catch (error) {
        searchError.value = true;
      }
      return;
    }
    searchResult.value = [];
  }, 500);
};
//定位的城市变量
const initCity = ref("");
//定位城市的经度,维度
const lng = ref("");
const lat = ref("");
const flag4 = ref(false);
let flag3 = ref(false);

//预览城市
const changeCityView = async (searchItem) => {
  initCity.value = searchItem.name + "-" + searchItem.adm1;
  if (document.title == initCity.value) {
    Notify({ type: "warning", message: "换个城市搜索吧!" });
    return;
  } else {
    flag3.value = true;
    flag2 = true;
    flag4.value = false;
    lng.value = Number(searchItem.lat).toFixed(2);
    lat.value = Number(searchItem.lon).toFixed(2);
    //获取当前定位城市天气
    let result = await axios.get(
      `https://devapi.qweather.com/v7/weather/now?location=${lat.value},${lng.value}&key=${weatherKey}`
    );
    window.localStorage.setItem(
      "cityId",
      JSON.stringify([lat.value, lng.value])
    );
    showjion.value = "fa-regular fa-heart text-xl mx-4";
    //点击后将参数传给Home
    emit("changeCityView", [
      initCity.value,
      result,
      [lat.value, lng.value],
      "",
    ]);
    isShow.value = false;
    if (
      jionWearthlistshow.value.find((item) => {
        return item["myCity"] == document.title;
      })
    ) {
      flag2 = false;
      showjion.value = "fa-solid fa-heart text-xl mx-4 text-red-500";
    } else {
      flag2 = true;
      showjion.value = "fa-regular fa-heart text-xl mx-4";
    }
  }
};
//根据用户IP 返回城市级别的定位结果
BMap = window.BMap;
const location = new BMap.LocalCity();
const getipcity = () => {
  flag4.value = true;
  location.get(async (res) => {
    initCity.value = res.name;
    document.title = initCity.value;
    lng.value = res.center["lng"].toFixed(2);
    lat.value = res.center["lat"].toFixed(2);
    //获取当前定位城市天气
    let result = await axios.get(
      `https://devapi.qweather.com/v7/weather/now?location=${lng.value},${lat.value}&key=${weatherKey}`
    );
    window.localStorage.setItem(
      "cityId",
      JSON.stringify([lng.value, lat.value])
    );
    //点击后将参数传给Home
    emit("giveinitCity", [
      initCity.value,
      result,
      [lng.value, lat.value],
      "gps",
    ]);
  });
};
</script>
<style>
.why-enter-from,
.why-leave-to {
  transform: translatey(-100%);
  opacity: 0;
}

.why-enter-to,
.why-leave-from {
  transform: translatey(0);
  opacity: 1;
}

.why-enter-active,
.why-leave-active {
  transition: all 0.5s ease-in-out;
}
.why1-enter-from,
.why1-leave-to {
  transform: translatey(-100%);
  opacity: 0;
}

.why1-enter-to,
.why1-leave-from {
  transform: translatey(0);
  opacity: 1;
}

.why1-enter-active,
.why1-leave-active {
  transition: all 0.5s ease-in-out;
}
/* From uiverse.io by @satyamchaudharydev */
/* The switch - the box around the slider */
.switch {
  --width-of-switch: 3em;
  --height-of-switch: 1.5em;
  /* size of sliding icon -- sun and moon */
  --size-of-icon: 1em;
  /* it is like a inline-padding of switch */
  --slider-offset: 0.5em;
  position: relative;
  width: var(--width-of-switch);
  height: var(--height-of-switch);
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f4f4f5;
  transition: 0.4s;
  border-radius: 30px;
}

.slider:before {
  position: absolute;
  content: "";
  height: var(--size-of-icon, 1.4em);
  width: var(--size-of-icon, 1.4em);
  border-radius: 20px;
  left: var(--slider-offset, 0.3em);
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(40deg, #ff0080, #ff8c00 70%);
  transition: 0.4s;
}

input:checked + .slider {
  background-color: skyblue;
}

input:checked + .slider:before {
  left: calc(100% - (var(--size-of-icon, 1.4em) + var(--slider-offset, 0.3em)));
  background: skyblue;
  /* change the value of second inset in box-shadow to change the angle and direction of the moon  */
  box-shadow: inset -3px -2px 5px -2px #8983f7, inset -10px -4px 0 0 #a3dafb;
}
</style>
