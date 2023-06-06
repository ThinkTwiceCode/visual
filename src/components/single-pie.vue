<template>
  <div ref="chartEl" class="single-pie"></div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

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
  const arr = ['< 2000万', '2000万 ~ 4000万', '4000万 ~ 6000万', '6000万 ~ 8000万', '8000万 ~ 10000万', '>= 10000万'];
  const res = arr.map((v, i) => {
    return {
      name: v,
      value: 0,
      provinceList: [],
    }
  });
  provinceList.forEach((key) => {
    let val = Math.floor(props.census[key] / 2000);
    if (val > 5) val = 5;
    res[val].value++;
    // @ts-ignore
    res[val].provinceList.push(key);
  });
  return res;
}
const options = {
  title: {
    text: `${props.year}年，全国各省级行政区人口数量状况`,
    left: 'center',
  },
  tooltip: {},
  series: [
    {
      type: 'pie',
      data: loadData(),
      radius: '60%',
      roseType: 'radius',
      itemStyle: {
        borderRadius: 5,
      },
      tooltip: {
        position: 'right',
        formatter: (params: any) => {
          const { name, value, provinceList } = params.data;
          return `<div style="max-width: 300px; overflow: hidden; word-break: break-all; word-wrap: break-word; white-space: normal;">
            <b>${name}: ${(value * 100 / 31).toFixed(2)}%</b><br />
            共${value}省: ${provinceList.join('、')}
            </div>`;
        },
      },
    }
  ],
  grid: {
    top: 40,
    left: 10,
    bottom: 10,
    right: 10,
    containLabel: true,
  },
};
// @ts-ignore
const myChart = useECharts(chartEl, undefined, undefined, options);

function update() {
  options.title.text = `${props.year}年，全国各省级行政区人口数量状况`;
  options.series[0].data = loadData();
  // @ts-ignore
  myChart.setOption(options);
}

watch(() => props.year, update);
</script>
<script lang="ts">
export default { name: 'SinglePie' };
</script>
