<template>
  <div ref="chartEl" class="staircase-waterfall"></div>
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

const positiveColor = '#86C166';
const negativeColor = '#CB1B45';
const barBorderRadius = 3;

function laodSeries() {
  const provinceCensus = Census.provinceData[props.province];
  const data = provinceCensus.slice(0, recentYears + 1).reverse();
  const base: number[] = [];
  const positive: number[] = [];
  const negative: number[] = [];
  data.reduce((pre, cur) => {
    const diff = cur - pre;
    const flag = diff > 0;
    base.push(flag ? pre : pre + diff);
    positive.push(flag ? diff : 0);
    negative.push(flag ? 0 : -diff);
    return cur;
  });

  return [
    {
      name: 'base',
      type: 'bar',
      stack: 'all',
      itemStyle: {
        normal: {
          barBorderColor: 'rgba(0,0,0,0)',
          color: 'rgba(0,0,0,0)'
        },
        emphasis: {
          barBorderColor: 'rgba(0,0,0,0)',
          color: 'rgba(0,0,0,0)'
        }
      },
      data: base,
    },
    {
      name: 'positive',
      type: 'bar',
      stack: 'all',
      data: positive,
      itemStyle: {
        color: positiveColor,
        borderRadius: barBorderRadius,
      },
    },
    {
      name: 'negative',
      type: 'bar',
      stack: 'all',
      data: negative,
      itemStyle: {
        color: negativeColor,
        borderRadius: barBorderRadius,
      },
    }
  ];
}

const options = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: (params: any) => {
      const [base, positive, negative] = params;
      const diff = positive.value - negative.value;
      const total = base.value + diff;
      const htmlList = [
        `<b>${base.name}年</b>`,
        `当年总人口 : <b>${total}万</b>`,
      ];
      if (diff === 0) {
        htmlList.push('和去年人口总数相同');
      } else {
        htmlList.push(`较去年人口总数变化 : <b style="color: ${diff > 0 ? positiveColor : negativeColor};">${diff}万</b>`)
      }
      return htmlList.join('<br />');
    },
  },
  title: {
    text: `${startYear} ~ ${Census.startYear}年，${props.province}人口增减`,
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
  options.title.text = `${startYear} ~ ${Census.startYear}年，${props.province}人口增减`;
  options.series = laodSeries();
  // @ts-ignore
  myChart.setOption(options);
}

watch(() => props.province, update);
</script>
<script lang="ts">
export default { name: 'StaircaseWaterfall' };
</script>

