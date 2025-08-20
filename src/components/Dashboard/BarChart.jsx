import * as React from "react";
import { useMemo,useRef,useState,useEffect } from "react";
import ReactECharts from "echarts-for-react";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography } from "@mui/material";
import getColorByNumber, { Colors } from "../../utils/Theme/Colors";
export default function BarChart(props) {

  const chartContainerRef = useRef(null); 
  const [containerWidth, setContainerWidth] = useState(0);

  const colors = props.colors || Colors;
  const colorValues = props.ColorSequence
    ? props.ColorSequence.map((key) => getColorByNumber(key))
    : Object.values(colors);
  const colorValues2 = props.ColorSequence
    ? props.ColorSequence.map((key) => getColorByNumber(key))
    : Object.values(colors);

  const barChartOption = useMemo(
    () => ({
      animation: true,
      animationDuration: 1000,
      title: {
        text: props.title,
        subtext: props.subtitle,
        left: "center",
        textVerticalAlign: "top",
        top: "-4%",
        textStyle: { color: "#333", fontSize: 18 },
        subtextStyle: {
          show: true,
          textAlign: "center",
          width:`${containerWidth*1.4}`,
          lineHeight:20,
          overflow:"break",
          fontWeight:700,
        },
        show: true,
      },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      grid: {
        left: "2%",
        right: "2%",
        bottom: "0%",
        top: "20%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: props.chartData.map((item) => item.name),
          axisTick: { alignWithLabel: true },
          axisLabel: { interval: 0, rotate: 20,fontSize: 10, },
          splitLine: { show: false },
        },
      ],
      yAxis: [{ type: "value", axisLabel: { show: false } }],
      series: [
        {
          name: props.label,
          type: "bar",
          barWidth: props.width,
          showBackground: true,
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.2)",
          },
          z: 3,
          label: { position: "top", show: true },
          data: props.chartData.map((item, index) => ({
            value: item.value || 0,
            itemStyle: {
              color: colorValues[index % colorValues.length].light,
              borderRadius: [5, 5, 0, 0],
            },
          })),
        },
      ],
    }),
    [props, colorValues,containerWidth]
  );
  const updateWidth = () => {
    if (chartContainerRef.current) {
      setContainerWidth(chartContainerRef.current.offsetWidth); 
    }
  };

  useEffect(() => {
    updateWidth(); 
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  function GradientCircularProgress() {
    return (
      <React.Fragment>
        <svg width={0} height={0}>
          <defs>
            <linearGradient
              id="gradient_chart"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#65e7e3" />
              <stop offset="100%" stopColor="#19a5cc" />
            </linearGradient>
          </defs>
        </svg>
        <CircularProgress
          sx={{ "svg circle": { stroke: "url(#gradient_chart)" } }}
          size={35}
        />
      </React.Fragment>
    );
  }
  return (
    <div ref={chartContainerRef}>
      {props.loading ? (
        <div
          style={{
            p: 1,
            width: "100%",
            textAlign: "center",
            display: "flex",
            height: "400px",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "#fff",
            color: "#000",
          }}
        >
          <GradientCircularProgress />
          <Typography
            variant="p"
            sx={{ fontWeight: "600", paddingTop: "10px" }}
          >
            Loading... Please Wait...
          </Typography>
        </div>
      ) : (
        <ReactECharts option={barChartOption} style={{height:"250px"}}  />
      )}
    </div>
  );
}
