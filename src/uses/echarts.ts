import * as echarts from 'echarts';
import type { ECharts, EChartsCoreOption, SetOptionOpts } from 'echarts';
import { shallowRef, isRef, onMounted, onBeforeUnmount, nextTick } from 'vue';
import type { Ref } from "vue";
import { useEventListener, useDebounceFn } from '@vueuse/core';

export { echarts };

const InstanceSet = new Set<ECharts>();

export function useECharts(el: Ref<HTMLElement | undefined> | HTMLElement, theme?: string, initOpts?: object, dataOption?: EChartsCoreOption) {
  /**
   * NOTE - 切勿使用ref 或 reactive！！！
   * https://echarts.apache.org/zh/faq.html#others
   */
  const instance = shallowRef<ECharts>();

  const lastData: any = {
    theme,
    initOpts,
    dataOption,
    notMergeOrOpts: undefined,
    lazyUpdate: undefined,
  }

  let echartsInstance: ECharts;

  function dispose() {
    InstanceSet.delete(echartsInstance);
    echartsInstance.dispose();
  }

  function initChart() {
    const realEl: HTMLElement = (isRef(el) ? el.value : el) as HTMLElement;
    echartsInstance = echarts.init(realEl, lastData.theme, lastData.initOpts);
    instance.value = echartsInstance;
    InstanceSet.add(echartsInstance);
  }

  function setOption(option: EChartsCoreOption, notMerge?: boolean, lazyUpdate?: boolean): void;
  function setOption(option: EChartsCoreOption, opts: SetOptionOpts): void;
  function setOption(option: EChartsCoreOption, notMergeOrOpts?: boolean | SetOptionOpts | undefined, lazyUpdate?: boolean) {
    lastData.dataOption = JSON.parse(JSON.stringify(option));
    lastData.dataOption = option;
    lastData.notMergeOrOpts = notMergeOrOpts;
    lastData.lazyUpdate = lazyUpdate;
    if (!echartsInstance) {
      return;
    }

    if (typeof notMergeOrOpts === 'boolean') {
      echartsInstance.setOption(option, notMergeOrOpts, lazyUpdate);
    } else {
      echartsInstance.setOption(option, notMergeOrOpts);
    }
  }

  function resetOption(option: EChartsCoreOption, notMergeOrOpts?: boolean, lazyUpdate?: boolean) {
    dispose();
    initChart();
    setOption(option, notMergeOrOpts, lazyUpdate);
  }

  function updateDataOption(option: EChartsCoreOption) {
    lastData.dataOption = JSON.parse(JSON.stringify(option));
    lastData.dataOption = option;
    if (!echartsInstance) {
      return;
    }
    echartsInstance?.setOption(option);
  }

  function updateTheme(theme: string) {
    lastData.theme = theme;
    if (!echartsInstance) {
      return;
    }
    dispose();
    initChart();
    setOption(lastData.dataOption as EChartsCoreOption, lastData.notMergeOrOpts, lastData.lazyUpdate);
  }
  
  onMounted(() => {
    initChart();
    if (lastData.dataOption) {
      echartsInstance.setOption(lastData.dataOption, lastData.notMergeOrOpts, lastData.lazyUpdate);
    }
  });

  onBeforeUnmount(() => {
    dispose();
    /** @ts-ignore */
    echartsInstance = null;
  });

  return {
    instance,
    setOption,
    resetOption,
    updateDataOption,
    updateTheme,
  };
}

// 部分图表不知为何在窗口缩小时，立即调用resize会变得比实际小
async function resizeChart() {
  InstanceSet.forEach((instance) => {
    instance.resize();
  });
  await nextTick();
  InstanceSet.forEach((instance) => {
    instance.resize();
  });
}

const handleResize = useDebounceFn(resizeChart, 20);

useEventListener('resize', handleResize);
