<template>
  <div ref="chartEl" class="dynamically-sorted-bar"></div>
</template>

<script setup lang="ts">
import { ref, watch, withDefaults } from 'vue';

import { useECharts } from '@/uses/echarts';

type PropsType = {
  year?: number,
  updateInterval?: number,
  census: Record<string, number>,
};
const props = withDefaults(defineProps<PropsType>(), {
  year: 2003,
  updateInterval: 2000,
});

const chartEl = ref();

const provinceList = Object.keys(props.census)
function loadData() {
  const res: number[] = [];
  provinceList.forEach((key) => {
    res.push(props.census[key]);
  });
  return res;
}
const maxCount = 6;
const options = {
  title: {
    text: `${props.year}年，人口排名前${maxCount}的省级行政区`,
    left: 'center',
  },
  xAxis: {
    max: 'dataMax'
  },
  yAxis: {
    type: 'category',
    data: provinceList,
    inverse: true,
    animationDuration: 300,
    animationDurationUpdate: 300,
    max: maxCount - 1,
  },
  series: [
    {
      realtimeSort: true,
      name: 'X',
      type: 'bar',
      data: loadData(),
      label: {
        show: true,
        position: 'insideRight',
        valueAnimation: true
      }
    }
  ],
  grid: {
    top: 40,
    left: 10,
    bottom: 10,
    right: 10,
    containLabel: true,
  },
  animationDuration: props.updateInterval,
  animationDurationUpdate: props.updateInterval,
  animationEasing: 'linear',
  animationEasingUpdate: 'linear'
};
// @ts-ignore
const myChart = useECharts(chartEl, undefined, undefined, options);

function update() {
  options.title.text = `${props.year}年，人口排名前${maxCount}的省级行政区`;
  options.series[0].data = loadData();
  // @ts-ignore
  myChart.setOption(options);
}

watch(() => props.year, update);
</script>
<script lang="ts">
export default { name: 'DynamicallySortedBar' };
</script>
