type EChartsChartType = 'bar' | 'line' | 'pie' | 'scatter'; // 待补充
type EchartsAxisType = 'category'; // 待补充
type EchartsSeriesItemStyle = Partial<{
  color: string,
  borderColor: string,
  borderWidth: string,
  borderType: string,
  barBorderRadius: string,
  opacity: number,
  shadowColor: string,
  shadowBlur: number,
  shadowOffsetX: number,
  shadowOffsetY: number,
}>;
type EChartsSeriesItem = {
  name?: string,
  type?: ChartType,
  data?: Array<number | string>,
  itemStyle?: EchartsSeriesItemStyle,
};
type EchartsAxis = {
  type?: EchartsAxisType,
  data?: Array<number | string>,
};

type EChaertsBaseOption = {
  title?: {
    text?: string,
  },
  tooltip?: object, // 为空对象时，会显示默认样式气泡
  legend?: {
    data?: string[],
  },
  xAxis: EchartsAxis,
  yAxis: EchartsAxis,
  series: EChartsSeriesItem[],
}

type EChartsDataSet = {
  source: Array<Array>,
};

type EchartsDataSetOption  = EChaertsBaseOption & { dataset: EChartsDataSet };
