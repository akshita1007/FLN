import * as React from 'react';
import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from '@mui/material';
import getColorByNumber, { Colors } from '../../utils/Theme/Colors';
export default function NightangleChart(props) {

    const colors = props.colors || Colors;
    const colorValues = props.ColorSequence
        ? props.ColorSequence.map(key => getColorByNumber(key))
        : Object.values(colors);
    const colorValues2 = props.ColorSequence
        ? props.ColorSequence.map(key => getColorByNumber(key))
        : Object.values(colors);

    const chartOption = useMemo(() => ({

        title: {
            text: props.title,
            subtext: props.subtitle,
            left: "center",
        },
        label: {
            show: false
          },
          emphasis: {
            label: {
              show: true
            }
          },
        legend: {
            top: 'bottom'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
        // grid: { left: '5%', right: '5%', bottom: '0%', top: '25%', containLabel: true },
        series: [{
            name: props.label,
            type: 'pie',
            radius: [10, 100],
            center: ['50%', '50%'],
            roseType: 'area',
            data: props.chartData.map((item, index) => ({
                value: item.value || 0,
                itemStyle: {
                    color: colorValues[index % colorValues.length].light, borderRadius:8
                }
            }))
        }]
    }), [props, colorValues]);

    function GradientCircularProgress() {
        return (
            <React.Fragment>
                <svg width={0} height={0}>
                    <defs>
                        <linearGradient id="gradient_chart" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#65e7e3" />
                            <stop offset="100%" stopColor="#19a5cc" />
                        </linearGradient>
                    </defs>
                </svg>
                <CircularProgress sx={{ 'svg circle': { stroke: 'url(#gradient_chart)' } }} size={35} />
            </React.Fragment>
        );
    }
    return (
        <div>
            {props.loading ? (
                <div style={{
                    p: 1,
                    // width: "100%",
                    textAlign: 'center',
                    display: "flex",
                    height: '400px',
                    alignItems: 'center',
                    flexDirection: "column",
                    justifyContent: "center",
                    backgroundColor: "#fff",
                    color: "#000",
                }}
                >
                    <GradientCircularProgress />
                    <Typography variant='p' sx={{ fontWeight: '600', paddingTop: '10px' }}>
                        Loading... Please Wait...
                    </Typography>
                </div>
            ) : (
                <ReactECharts option={chartOption} style={{height:'350px'}}/>
            )}
        </div>
    );
}