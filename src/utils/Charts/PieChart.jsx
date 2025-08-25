import * as React from "react";
import { useMemo, useState, useRef, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography } from "@mui/material";
import getColorByNumber, { Colors } from "../Theme/Colors";

export default function PieChart(props) {
  const chartContainerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const colors = props.colors || Colors;
  const colorValues = props.ColorSequence
    ? props.ColorSequence.map((key) => getColorByNumber(key)).reverse()
    : Object.values(colors).reverse();

  const pieChartOption = useMemo(() => ({
    animation: true,
    animationDuration: 1000,
    title: {
      text: props.title,
      subtext: props.subtitle,
      left: "center",
      textVerticalAlign: "top",
      top: "-6%",
      textStyle: { color: "#333", fontSize: 18 },
      subtextStyle: {
        show: true,
        textAlign: "center",
        width: `${containerWidth * 1.4}`,
        lineHeight: 20,
        overflow: "break",
        fontSize:"10px",
        fontWeight:600
      },
      show: true,
    },
    tooltip: {
      trigger: "item",
      formatter: "{b} - {c}",
    },
    legend: {
      type: "scroll",
      orient: props.size === "small" ? "vertical" : "horizontal", 
      bottom: props.size === "small" ? null : "0", 
      top: props.size === "small" ? "30%" : null,
      left: props.size === "small" ? "0%" : "center", 
      type: "scroll",
      textStyle: { color: "#000", fontSize: 12 ,lineHeight: 20,},
      width: props.size === "small" ? "55%" : "90%",
      padding: [5, 10],
      formatter: (name) => {
        const maxLength = Math.floor(containerWidth * 0.11); 
        const parts = [];
        let currentLine = "";
        const words = name.split(" ");
        
        words.forEach((word) => {
          if ((currentLine + word).length > maxLength) {
            parts.push(currentLine); 
            currentLine = word;
          } else {
            currentLine += (currentLine ? " " : "") + word;
          }
        });
        
        if (currentLine) {
          parts.push(currentLine); 
        }
        
        return parts.join("\n"); 
      },
    },
    series: [
      {
        name: props.label,
        type: "pie",
        radius: "55%",
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          position: "inside",
          formatter: "{c}",
          color: "#fff",
          fontWeight: "bold",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: props.chartData.map((item, index) => ({
          value: item.value || 0,
          name: item.name,
          itemStyle: {
            color: colorValues[index % colorValues.length].main,
          },
        })),
        center: props.size=="small"?["80%", "60%"]: ["50%", "55%"],
      },
    ],
  }), [props, colorValues, containerWidth]);

  useEffect(() => {
    const updateWidth = () => {
      if (chartContainerRef.current) {
        setContainerWidth(chartContainerRef.current.offsetWidth); 
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updateWidth(); 
    });

    if (chartContainerRef.current) {
      resizeObserver.observe(chartContainerRef.current); 
    }

    return () => {
      if (chartContainerRef.current) {
        resizeObserver.unobserve(chartContainerRef.current); 
      }
    };
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
        <ReactECharts option={pieChartOption} style={{height:"250px"}} />
      )}
    </div>
  );
}
