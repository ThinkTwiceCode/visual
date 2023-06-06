<template>
  <div ref="chinaMapEl"></div>
</template>

<script setup lang="ts">
import geoChina from "@/assets/map/china.json";
import * as echarts from "echarts";
import { onMounted, ref, watch } from "vue";

import { useECharts } from "@/uses/echarts";

type PropsType = {
  year?: number,
  census: Record<string, number>,
};
const props = withDefaults(defineProps<PropsType>(), {
  year: 2003,
  updateInterval: 2000,
});

interface EmitType {
  (e: 'on-selected', province: string): void;
}
const emit = defineEmits<EmitType>();

/** @ts-ignore */
echarts.registerMap("china", geoChina);

const chinaMapEl = ref();

function loadProvince() {
  const list: any[] = [];
  const { features } = geoChina;
  features.forEach((obj) => {
    const { name, level, centroid, center } = obj.properties;
    if (level === "province") {
      // centroid：几何中心，center：省会
      const value: any[] = [...(centroid || center)];
      if (!Array.isArray(value)) {
        return;
      }
      // @ts-ignore
      const province_census = props.census[name];
      if (province_census) {
        value.push(province_census);
        list.push({ name: name, value });
      }
    }
  });
  return list;
}

const options = {
  tooltip: {},
  title: {
    text: `${props.year}年，全国各省人口普查数据`,
    top: '20%',
    left: 'center',
  },
  geo: {
    map: "china",
    zoom: 1.23,
    selectedMode: 'single',
    label: {
      show: false,
    },
    itemStyle: {
      areaColor: "#0d0059",
      borderColor: "#389dff",
      borderWidth: 1,
      shadowBlur: 5,
      shadowOffsetY: 8,
      shadowOffsetX: 0,
      shadowColor: "#01012a",
    },
    emphasis: {
      label: {
        show: true,
      },
      itemStyle: {
        areaColor: "#184cff",
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 5,
        borderWidth: 0,
        shadowColor: "rgba(0, 0, 0, 0.5)",
      },
    },
    tooltip: {
      show: true,
      borderWidth: 0,
      formatter: (params: any) => {
        const province_census = props.census[params.name];
        if (!province_census) {
          return '<b>暂无数据</b>';
        }
        return `
          <b>${params.name}</b>
          <br />
          人口数量：${province_census}万
        `;
      },
    },
  },
  series: [
    {
      selectedMode: 'single',
      name: "数量",
      type: "effectScatter",
      coordinateSystem: "geo",
      data: loadProvince(),
      symbolSize: (val: number[]) => {
        if (!Array.isArray(val)) {
          return;
        }

        return val[2] / 500;
      },
      showEffectOn: "emphasis",
      rippleEffect: { brushType: "fill" },
      hoverAnimation: true,
      itemStyle: {
        color: "#ff8003"
      },
    },
  ],
};

const myChart = useECharts(chinaMapEl, undefined, undefined, options);

const defaultSelectedProvince = '广东';
const offWatch = watch(myChart.instance, (val) => {
  if (!val) return;
  val.on('geoselectchanged', (params: any) => {
    emit('on-selected', params.name);
  });
  val.dispatchAction({
    type: 'geoSelect',
    name: defaultSelectedProvince,
    geoIndex: 0,
  });
  offWatch();
});

onMounted(() => {
  emit('on-selected', defaultSelectedProvince);
});


function update() {
  options.title.text = `${props.year}年，全国各省人口普查数据`;
  options.series[0].data = loadProvince();
  myChart.setOption(options);
}

watch(() => props.year, update);
</script>
<script lang="ts">
export default { name: 'ChinaMap' };
</script>
