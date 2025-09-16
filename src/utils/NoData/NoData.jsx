import React from "react";
import nodata from "../../Assets/nd-transformed.jpeg";
import { Grid, Card, Typography } from "@mui/material";
import { Colors } from "../../utils/Theme/Colors";
import { styled, keyframes } from "@mui/system";

const NoData = () => {
  const AnimatedImage = styled("img")(({ theme }) => ({
    width: "200px",
    borderRadius: "60px",
    background: Colors.primary.Extra,
    transition: "transform 0.3s ease-in-out",
    animation: `${bounce} 2s ease-in-out infinite`,
    "&:hover": {
      transform: "scale(1.05)",
    },
  }));

  const AnimatedTypography = styled(Typography)(({ theme }) => ({
    fontSize: "24px",
    fontWeight: "500",
    marginTop: "15px",
    animation: `${fadeIn} 2s ease-in-out`,
  }));

  const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-15px);
  }
  60% {
    transform: translateY(-7px);
  }
`;

  const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;
  return (
    <Grid
      sx={{
        width: "100%",
        margin: "40px",
        fontSize: "25px",
        fontWeight: "400",
        textAlign: "center",
      }}
    >
      <Card elevation={0} sx={{ padding: "10px" }}>
        <AnimatedTypography>No Data To Display!</AnimatedTypography>
        <AnimatedImage src={nodata} alt="no-data" style={{ margin: "20px" }} />
      </Card>
    </Grid>
  );
};

export default NoData;
