import {useCallback, useEffect, useMemo, useRef} from 'react';
import {css} from '@emotion/css';
import * as BABYLON from 'babylonjs';
import * as echarts from 'echarts';
import {samples} from 'culori';

const {SineEase} = BABYLON;
const Graph = ({
  title = 'SineEase',
  easeInstance = () => {
    return new SineEase();
  },
}) => {
  const graphDomRef = useRef(null);
  const chartRef = useRef(null);

  const data = useMemo(() => {
    return samples(40).map((t) => {
      return {t, x: easeInstance().ease(t)};
    });
  }, [easeInstance]);

  useEffect(() => {
    // https://echarts.apache.org/handbook/en/basics/release-note/5-3-0/?ref=banner
    // https://echarts.apache.org/examples/en/editor.html?c=line-easing&edit=1&reset=1
    const myChart = echarts.init(chartRef.current);
    chartRef.current = myChart;
    const option = {
      title: {
        text: title,
        top: 'top',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: data.map((d) => {
          return d.t;
        }),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: data.map((d) => {
            return d.x;
          }),
          type: 'line',
          smooth: true,
        },
      ],
    };

    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [data, title]);

  const handleResize = useCallback(() => {
    chartRef.current.resize();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={chartRef}
      className={css`
        position: relative;
        height: 100%;
        overflow: hidden;
      `}
    />
  );
};

export {Graph};
