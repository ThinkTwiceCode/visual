<template>
  <div class="page page-index">
    <div class="header">
      <h1 class="title">中国（无港澳台）2003 ~ 2021年人口普查数据变化</h1>
    </div>

    <div class="left">
      <RectangleWrap>
        <DynamicallySortedBar class="full" :update-interval="updateInterval" :year="now.year" :census="now.census" />
      </RectangleWrap>

      <RectangleWrap>
        <SinglePie class="full" :year="now.year" :census="now.census" />
      </RectangleWrap>
    </div>

    <ChinaMap class="main box" :year="now.year" :census="now.census" @on-selected="onSelectProvince" />

    <div class="right">
      <RectangleWrap>
        <BarAndLine class="full" :province="selectedProvince" />
      </RectangleWrap>

      <RectangleWrap>
        <StaircaseWaterfall class="full" :province="selectedProvince" />
      </RectangleWrap>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChinaMap from '@/components/china-map.vue';
import RectangleWrap from '@/components/rectangle-wrap.vue';
import DynamicallySortedBar from '@/components/dynamically-sorted-bar.vue';
import SinglePie from '@/components/single-pie.vue';
import BarAndLine from '@/components/bar-and-line.vue';
import StaircaseWaterfall from '@/components/staircase-waterfall.vue';

import { ref, shallowReactive } from "vue";

import { Census } from "@/consts/census";

const { endYear, startYear, provinceData } = Census;
const totalYear = startYear - endYear;
const provinceList = Object.keys(provinceData);

function loadYearCensus(year: number) {
  const res: Record<string, number> = {};
  provinceList.forEach((key) => {
    const arr = provinceData[key];
    if (Array.isArray(arr)) {
      const index = startYear - year;
      res[key] = arr[index];
    }
  });
  return res;
}

let count = 0;
const updateInterval = 1000;
const now = shallowReactive({
  year: endYear,
  census: loadYearCensus(endYear),
});

function update() {
  if (count > 0 && count % totalYear === 0) {
    now.year = endYear;
  } else {
    now.year++;
  }
  count++;

  now.census = loadYearCensus(now.year);
}

setInterval(update, updateInterval);

const selectedProvince = ref();
function onSelectProvince(province: string) {
  selectedProvince.value = province;
}
</script>
<script lang="ts">
export default { name: "PageIndex" };
</script>

<style lang="less" scoped>
@page-padding: 10px;
@header-height: 50px;
@box-border: 1px solid coral;

.full {
  width: 100%;
  height: 100%;
}

.box {
  position: relative;

  &::before,
  &::after {
    content: "";
    position: absolute;
    display: inline-block;
    width: 20px;
    height: 10px;
  }

  &::before {
    top: 0;
    left: 0;
    border-top: @box-border;
    border-left: @box-border;
  }

  &::after {
    bottom: 0;
    right: 0;
    border-bottom: @box-border;
    border-right: @box-border;
  }
}

.page-index {
  position: relative;
  padding: 10px;
  padding-top: @header-height + @page-padding;
  display: flex;
  height: 100vh;
  // background-image: radial-gradient(ellipse farthest-corner at center center, #1b44e4 0%, #2746ac 100%);

  .header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: @header-height;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .left,
  .right {
    flex: 3;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .main {
    flex: 4;
  }
}
</style>
