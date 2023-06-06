<template>
  <div ref="chartEl" class="bar-and-line"></div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import { useECharts } from '@/uses/echarts';

import { Census } from '@/consts/census';

type PropsType = {
  province?: string,
};
const props = withDefaults(defineProps<PropsType>(), {
  province: '广东',
});

const chartEl = ref();

const recentYears = 10;
const startYear = Census.startYear - recentYears + 1;
function laodSeries() {
  const provinceCensus = Census.provinceData[props.province];
  const data = provinceCensus.slice(0, recentYears).reverse();
  return [
    // { type: 'bar', data },
    { type: 'line', data, smooth: true },
  ];
}

const options = {
  // tooltip: {},
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  title: {
    text: `${startYear} ~ ${Census.startYear}年，${props.province}人口变化`,
    left: 'center',
  },
  xAxis: {
    type: 'category',
    data: new Array(recentYears).fill(0).map((v, i) => {
      return startYear + i;
    }),
    axisLabel: {
      rotate: -45,
    },
  },
  yAxis: {
    type: 'value',
    min: 'dataMin',
    max: 'dataMax',
    axisLabel: {
      formatter: '{value} 万',
    },
  },
  grid: {
    top: 40,
    left: 10,
    bottom: 10,
    right: 10,
    containLabel: true,
  },
  series: laodSeries(),
};
// @ts-ignore
const myChart = useECharts(chartEl, undefined, undefined, options);

function update() {
  if (!(props.province in Census.provinceData)) {
    return;
  }
  options.title.text = `${startYear} ~ ${Census.startYear}年，${props.province}人口变化`;
  options.series = laodSeries();
  // @ts-ignore
  myChart.setOption(options);
}

watch(() => props.province, update);
</script>
<script lang="ts">
export default { name: 'BarAndLine' };
</script>
