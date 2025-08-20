import * as React from "react";
import { useMemo, useRef, useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography } from "@mui/material";
import getColorByNumber, { Colors } from "../Theme/Colors";

export default function HalfDonutChart(props) {
  const chartContainerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const colors = props.colors || Colors;
  const colorValues = props.ColorSequence
    ? props.ColorSequence.map((key) => getColorByNumber(key))
    : Object.values(colors);

  const chartData = props.chartData || [];

  const halfDonutChartOption = useMemo(() => ({
    title: {
      text: props.title,
      subtext: props.subtitle,
      left: "center",
      textStyle: { color: "#333", fontSize: 18 },
      subtextStyle: {
        show: true,
        textAlign: "center",
        lineHeight: 20,
        overflow: "break",
      },
      show: true,
    },
    tooltip: {
      trigger: "item",
      formatter: function (params) {
        return `${params.name}: ${params.value} (${((params.value / params.total) * 100).toFixed(2)}%)`;
      },
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      borderColor: "#333",
      borderWidth: 1,
      textStyle: {
        color: "#fff",
      },
      padding: [10, 15],
    },
    legend: {
      type: "scroll",
      orient: "horizontal",
      bottom: "0",
      textStyle: { color: "#000", fontSize: 12 },
      width: "80%",
      padding: [5, 10],
      formatter: function (name) {
        return name.length > 30 ? `${name.slice(0, 30)}...` : name;
      },
      itemGap: 10, // Adds spacing between legend items
      itemWidth: 20, // Adjusts width of legend items
      itemHeight: 10, // Adjusts height of legend items
    },
    series: [
      {
        name: props.label,
        type: "pie",
        radius: ["40%", "70%"], // The inner and outer radius to create the half-donut effect
        center: ["50%", "50%"], // Centered in the middle of the chart
        startAngle: 180, // Start angle to make it a half-donut
        endAngle: 0, // End angle to make it a half-donut (0 is the default full circle)
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          position: "outside",
          formatter: "{b}: {c}",
          color: "#000",
          fontWeight: "bold",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold",
          },
        },
        data: chartData.map((item, index) => ({
          value: item.value || 0,
          name: item.name,
          itemStyle: {
            color: colorValues[index % colorValues.length].light,
          },
        })),
      },
    ],
  }), [props, colorValues, containerWidth, chartData]);

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
        <ReactECharts option={halfDonutChartOption} />
      )}
    </div>
  );
}
