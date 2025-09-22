import React from "react";
import nodata from "../../Assets/2e0d2f40-779c-4838-aeac-1b03ab9e39db.jpg";
import { Grid, Card, Typography, Button, Box } from "@mui/material";
import { Colors } from "../../utils/Theme/Colors";
import { styled, keyframes } from "@mui/system";

// Keyframes
const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-12px); }
  60% { transform: translateY(-6px); }
`;

const fadeIn = keyframes`
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
`;

// Styled Components
const AnimatedImage = styled("img")(({ theme }) => ({
  width: "200px",
  height: "auto",
  borderRadius: "20px",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  animation: `${bounce} 2.5s ease-in-out infinite`,
  boxShadow: "0px 6px 16px rgba(0,0,0,0.15)",
  "&:hover": {
    transform: "scale(1.06)",
    boxShadow: "0px 10px 22px rgba(0,0,0,0.2)",
  },
  [theme.breakpoints.down("sm")]: {
    width: "150px",
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: "22px",
  fontWeight: "600",
  color: Colors.text?.primary || "#333",
  marginTop: "18px",
  animation: `${fadeIn} 1s ease-in-out`,
  [theme.breakpoints.down("sm")]: {
    fontSize: "18px",
  },
}));

const SubText = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  color: Colors.text?.secondary || "#666",
  marginTop: "6px",
  animation: `${fadeIn} 1.4s ease-in-out`,
  [theme.breakpoints.down("sm")]: {
    fontSize: "13px",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: "20px",
  padding: "10px 20px",
  borderRadius: "12px",
  background: Colors.primary?.main || "#1976d2",
  textTransform: "none",
  fontWeight: "500",
  color: "#fff",
  boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
  "&:hover": {
    background: Colors.primary?.dark || "#115293",
    boxShadow: "0px 6px 16px rgba(0,0,0,0.2)",
  },
}));

const NoData = ({ onRetry }) => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        width: "100%",
        minHeight: "70vh",
        textAlign: "center",
        px: 2,
      }}
    >
      <Card
        elevation={2}
        sx={{
          px: { xs: 3, md: 5 },
          py: { xs: 4, md: 6 },
          borderRadius: "20px",
          background: Colors.background?.light || "#fff",
          boxShadow: "0px 6px 18px rgba(0,0,0,0.08)",
          maxWidth: "400px",
        }}
      >
        <AnimatedImage src={nodata} alt="no-data" />
        <Title>No Data Available</Title>
        <SubText>
          Looks like there’s nothing here yet. Try refreshing or adding new data.
        </SubText>

        {onRetry && (
          <Box>
            <StyledButton onClick={onRetry}>Reload</StyledButton>
          </Box>
        )}
      </Card>
    </Grid>
  );
};

export default NoData;
