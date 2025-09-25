import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Typography,
  Grid,
} from "@mui/material";
import { styled, keyframes } from "@mui/system";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import Header from "../Header/Header";
import Toast from "../../utils/Toast/Toast";
import Loader from "../../utils/Loader/Loader";
import NoData from "../../utils/NoData/NoData";
import DropDown from "./DropDown";
import ChartOne from "../AllCharts/ChartOne";
import ChartTwo from "../AllCharts/ChartTwo";
import ChartThree from "../AllCharts/ChartThree";

import surveyicon from "../../Assets/icons/survey.png";
import totalCACicon from "../../Assets/icons/totalCAC.png";
import totalSchoolicon from "../../Assets/icons/totalSchool.png";
import visitedSchoolicon from "../../Assets/icons/visitedSchool.png";

// 🎨 UX Color Palette
const formalPalette = {
  primary: "#2C3E50",
  accent: "#fca311", // Highlight
  background: "#F9FAFB",
  cardBackground: "#FFFFFF",
  textPrimary: "#212121",
  textSecondary: "#757575",
  border: "#E0E0E0",
};

// 🔄 Animations
const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-40px); }
  to { opacity: 1; transform: translateX(0); }
`;

// 📦 Card Styles
const CustomCard = styled(Card)(({ color }) => ({
  borderRadius: "18px",
  padding: "20px",
  display: "flex",
  alignItems: "center",
  gap: "20px",
  background: color,
  minHeight: "120px",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.08)",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 18px rgba(0, 0, 0, 0.12)",
  },
}));

const IconWrapper = styled(Box)(({ color }) => ({
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: color,
  boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
  flexShrink: 0,
  "& img": {
    width: "28px",
    height: "28px",
    filter: "invert(100%)",
  },
}));

const TitleTypography = styled(Typography)({
  fontSize: "0.85rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.6px",
  marginBottom: "4px",
  color: "#f5f5f5",
});

const StyledTypography = styled(Typography)({
  fontSize: "1.7rem",
  fontWeight: 700,
  color: "#fff",
  lineHeight: 1.2,
});

const Dashboard = () => {
  const { token } = useAuth();
  const [cardCount, setCardCount] = useState({});
  const { districtId, blockId, clusterId } = useParams();
  const [countData, setCountData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState({});

  const onFilterUpdate = (filterObj) => {
    setFilter(filterObj);
  };

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/v1/dashboard/counts`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              districtId: filter.districtId,
              blockId: filter.blockId,
              clusterId: filter.clusterId,
            },
          }
        );
        if (response.data.success) {
          setCardCount(response.data.data || {});
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/v1/submit/report-analysis`,
          {
            params: { ...filter, step: "step1" },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response?.data) {
          Toast("success", "Data loaded successfully!");
          setCountData(response.data?.data || []);
        }
      } catch (error) {
        Toast("error", "Failed to load data. Please try again.");
        console.error(error);
        setCountData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCount();
    fetchData();
  }, [filter, token, districtId, blockId, clusterId]);

  const chartDataArray = useMemo(
    () =>
      countData?.map((question, index) => ({
        questionText: question.questionText,
        chartData: question.option.map((opt, optIndex) => ({
          id: optIndex + 1,
          value: opt.count,
          name: opt.text,
        })),
      })),
    [countData]
  );

  // 📊 Card Widgets
  const cardWidgets = [
    {
      title: "Total Primary Schools",
      total: cardCount.totalSchool || 0,
      icon: totalSchoolicon,
      color: "linear-gradient(135deg, #003566 0%, #023e8a 100%)",
      shade: "linear-gradient(135deg, #fefae0 0%, #fefae0 100%)",
    },
    {
      title: "Total CACs",
      total: cardCount.totalCaC || 0,
      icon: totalCACicon,
      color: "linear-gradient(135deg, #003566 0%, #023e8a 100%)",
      shade: "linear-gradient(135deg, #fefae0 0%, #fefae0 100%)",
    },
    {
      title: "Total Surveys",
      total: cardCount.totalSubmission || 0,
      icon: surveyicon,
      color: "linear-gradient(135deg, #003566 0%, #023e8a 100%)",
      shade: "linear-gradient(135deg, #fefae0 0%, #fefae0 100%)",
    },
    {
      title: "Total Visited School",
      total: cardCount.visitSchoolCount || 0,
      icon: visitedSchoolicon,
      color: "linear-gradient(135deg, #003566 0%, #023e8a 100%)",
      shade: "linear-gradient(135deg, #fefae0 0%, #fefae0 100%)",
    },
  ];

  const renderCard = (title, total, icon, color, shade) => (
    <CustomCard color={color}>
      <IconWrapper color={shade}>
        <img src={icon} alt={`${title} icon`} />
      </IconWrapper>
      <Box>
        <TitleTypography>{title}</TitleTypography>
        <StyledTypography sx={{ color: formalPalette.accent }}>
          {total}
        </StyledTypography>
      </Box>
    </CustomCard>
  );

  return (
    <Container maxWidth="auto" className="analysis-page" sx={{ padding: { xs: 0 } }}>
      <Header title={"Dashboard"} />

      {/* 🔽 Filters */}
      <Box sx={{ p: "20px", mb: "25px" }}>
        <Card sx={{ boxShadow: "none", borderRadius: "12px", background: formalPalette.cardBackground }}>
          <CardContent>
            <DropDown filterData={onFilterUpdate} isDate={true} filter={filter} />
          </CardContent>
        </Card>
      </Box>

      {/* 📦 Stats Cards */}
      <Grid container spacing={4} sx={{ marginBottom: 4 }}>
        <Grid container spacing={2} sx={{ marginLeft: 5, marginRight: 2 }}>
          {cardWidgets.map((card, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={index}
              sx={{ animation: `${slideInLeft} 0.6s ease-out ${index * 0.12}s` }}
            >
              {renderCard(card.title, card.total, card.icon, card.color, card.shade)}
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Divider sx={{ borderColor: formalPalette.border }} />

      {/* 📊 Charts */}
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "380px",
            p: "20px",
            mb: "25px",
          }}
        >
          <Loader msg={"Fetching Data... Please Wait"} size={50} />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {chartDataArray && chartDataArray?.length > 0 ? (
            chartDataArray.map((data, index) => {
              switch (data.questionText) {
                case "किस कक्षा का अवलोकन किया गया?":
                  return (
                    <Grid item xs={12} md={6} lg={4} key={index}>
                      <Box sx={{ p: "20px", mb: "25px" }}>
                        <Card
                          sx={{
                            borderRadius: "16px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          }}
                        >
                          <CardContent>
                            <ChartOne data={data} />
                          </CardContent>
                        </Card>
                      </Box>
                    </Grid>
                  );
                default:
                  return null;
              }
            })
          ) : (
            <Grid item xs={12} sx={{ px: 4 }}>
              <NoData />
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard;
