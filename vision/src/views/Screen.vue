<template>
  <div id="screen" :style="backgroundColor">
    <div class="screen_title" :style="fontSizeColor">电商系统监控</div>
    <div class="spin" @click="spinClick"></div>
    <div class="screen_content">
      <div
        class="screen_trend"
        :class="[fullScreenStatus.trend ? 'fullsreen' : '']"
      >
        <trend-page ref="trend" />
        <span
          class="expand"
          @click="clickExpand('trend')"
          :class="clickColor"
        ></span>
      </div>
      <div
        class="screen_seller"
        :class="[fullScreenStatus.seller ? 'fullsreen' : '']"
      >
        <seller-page ref="seller" />
        <span
          class="expand"
          @click="clickExpand('seller')"
          :class="clickColor"
        ></span>
      </div>
      <div
        class="screen_map"
        :class="[fullScreenStatus.map ? 'fullsreen' : '']"
      >
        <map-page ref="map" />
        <span
          class="expand"
          @click="clickExpand('map')"
          :class="clickColor"
        ></span>
      </div>
      <div
        class="screen_rank"
        :class="[fullScreenStatus.rank ? 'fullsreen' : '']"
      >
        <rank-page ref="rank" />
        <span
          class="expand"
          @click="clickExpand('rank')"
          :class="clickColor"
        ></span>
      </div>
      <div
        class="screen_hot"
        :class="[fullScreenStatus.hot ? 'fullsreen' : '']"
      >
        <hot-page ref="hot" />
        <span
          class="expand"
          @click="clickExpand('hot')"
          :class="clickColor"
        ></span>
      </div>
      <div
        class="screen_stock"
        :class="[fullScreenStatus.stock ? 'fullsreen' : '']"
      >
        <stock-page ref="stock" />
        <span
          class="expand"
          @click="clickExpand('stock')"
          :class="clickColor"
        ></span>
      </div>
    </div>
    <div class="screen_footer" :style="fontSizeColor">版权所有</div>
  </div>
</template>

<script>
import HotPage from "@/views/hot/HotPage.vue";
import MapPage from "@/views/map/MapPage.vue";
import RankPage from "@/views/rank/RankPage.vue";
import SellerPage from "@/views/seller/SellerPage.vue";
import StockPage from "@/views/stock/StockPage.vue";
import TrendPage from "@/views/trend/TrendPage.vue";
import { mapState } from "vuex";
import { getThemeValue } from "@/utils/theme_utils.js";
export default {
  name: "Screen",
  components: {
    TrendPage,
    SellerPage,
    MapPage,
    HotPage,
    StockPage,
    RankPage,
  },
  data() {
    return {
      fullScreenStatus: {
        trend: false,
        hot: false,
        map: false,
        rank: false,
        seller: false,
        stock: false,
      },
      // 存放从服务器请求的全屏信息
      target: false,
    };
  },
  created() {
    // 注册回调函数
    this.$socket.registerCallBack("fullScreen", this.recvData);
    this.$socket.registerCallBack("themeChange", this.recvThemeChange);
  },
  destroyed() {
    // 销毁回调函数
    this.$socket.unRegisterCallBack("fullScreen");
    this.$socket.unRegisterCallBack("themeChange");
  },
  computed: {
    ...mapState(["theme"]),
    fontSizeColor() {
      return {
        color: getThemeValue(this.theme).titleColor,
      };
    },
    backgroundColor() {
      return {
        backgroundColor: getThemeValue(this.theme).backgroundColor,
      };
    },
    clickColor() {
      // 判断是否全屏
      if (this.target === false) {
        return this.theme === "chalk" ? "" : "expand2";
      } else {
        return this.theme === "chalk" ? "narrow1" : "narrow2";
      }
    },
  },
  methods: {
    clickExpand(ipstr) {
      // this.fullScreenStatus[ipstr] = !this.fullScreenStatus[ipstr];
      // this.$nextTick(() => {
      //   this.$refs[ipstr].screenAdapter();
      // });
      const targetValue = !this.fullScreenStatus[ipstr];
      // 向服务器发送
      this.$socket.send({
        action: "fullScreen",
        socketType: "fullScreen",
        chartName: ipstr,
        value: targetValue,
      });
    },
    // 处理数据
    recvData(data) {
      // 取得点击的图表
      const chartName = data.chartName;
      // 取得放大或缩小
      const targetValue = data.value;
      this.target = targetValue;
      this.fullScreenStatus[chartName] = targetValue;
      this.$nextTick(() => {
        this.$refs[chartName].screenAdapter();
      });
    },
    spinClick() {
      // this.$store.commit("changeTheme");
      // 向服务器发送
      this.$socket.send({
        action: "themeChange",
        socketType: "themeChange",
        chartName: "",
        value: "",
      });
    },
    recvThemeChange() {
      this.$store.commit("changeTheme");
    },
  },
};
</script>

<style scoped>
#screen {
  width: 100%;
  height: 100%;
  background: #111;
}
.screen_title,
.screen_footer {
  width: 100%;
  height: 9%;
  padding-top: 2vh;
  text-align: center;
  color: #fff;
  box-sizing: border-box;
}
.screen_title {
  font-size: 5vh;
  font-weight: 700;
}
.screen_footer {
  font-size: 1vh;
}
.screen_content {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: space-between;
  align-content: space-around;
  width: 100%;
  height: 82%;
}
.screen_content > div {
  position: relative;
}
.screen_trend {
  flex: 0 1 60.24%;
  width: 27%;
}
.screen_seller {
  flex: 0 1 35.76%;
  width: 27%;
}
.screen_map {
  flex: 0 1 64.46%;
  width: 40.625%;
}
.screen_rank {
  flex: 0 1 31.54%;
  width: 40.625%;
}
.screen_hot {
  flex: 0 1 53%;
  width: 27%;
}
.screen_stock {
  flex: 0 1 43%;
  width: 27%;
}
.expand {
  display: block;
  position: absolute;
  height: 20px;
  width: 20px;
  top: 10px;
  right: 10px;
  background-image: url("~@/assets/img/expand1.png");
  background-size: 20px 20px;
  z-index: 11;
}
.fullsreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100 !important;
}
.fullsreen span {
  top: 20px;
  right: 20px;
  height: 40px;
  width: 40px;
  background-size: 40px 40px;
}
.spin {
  position: fixed;
  top: 2vh;
  right: 2vh;
  width: 5vh;
  height: 5vh;
  background: url("../assets/img/换肤.svg");
  background-size: 5vh 5vh;
}
.expand2 {
  background-image: url("~@/assets/img/expand2.png");
}
.narrow1 {
  background-image: url("~@/assets/img/narrow1.png");
}
.narrow2 {
  background-image: url("~@/assets/img/narrow2.png");
}
</style>