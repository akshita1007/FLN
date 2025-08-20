import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography } from "@mui/material";

const Loader = ({ msg,size }) => {
  return (
    <div
      style={{
        p: 1,
        width: "100%",
        height: "300px",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        // backgroundColor: "#fff",
        color: "#000",
      }}
    >
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

      <Typography variant="p" sx={{ fontWeight: "600", paddingTop: "10px" }}>
        {msg}
      </Typography>
    </div>
  );
};
export default Loader;
