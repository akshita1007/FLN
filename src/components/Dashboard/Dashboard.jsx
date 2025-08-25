import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Typography,
  Grid,
} from "@mui/material";
import { styled, keyframes } from "@mui/system";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Header from "../Header/Header";
import Toast from "../../utils/Toast/Toast";
import Loader from "../../utils/Loader/Loader";
import NoData from "../../utils/NoData/NoData";
import DropDown from "./DropDown";
import ChartOne from "../AllCharts/ChartOne";
import ChartTwo from "../AllCharts/ChartTwo";
import ChartThree from "../AllCharts/ChartThree";

// Import icons
import surveyicon from "../../Assets/icons/survey.png";
import totalCACicon from "../../Assets/icons/totalCAC.png";
import totalSchoolicon from "../../Assets/icons/totalSchool.png";
import visitedSchoolicon from "../../Assets/icons/visitedSchool.png";
import { blue } from "@mui/material/colors";

// Formal color palette
const formalPalette = {
  primary: "#2C3E50",
  secondary: "#3498DB",
  background: "#F0F2F5",
  cardBackground: "#FFFFFF",
  textPrimary: "#212121",
  textSecondary: "#757575",
  textPrimaryLight: "#ffffffff",
  textSecondaryLight: "#ffffffff",
  border: "#E0E0E0",
};

// Keyframe animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Styled Components
const StyledContainer = styled(Container)({
  backgroundColor: formalPalette.background,
  minHeight: "100vh",
  // padding: "20px",
  animation: `${fadeIn} 0.8s ease-out`,
});

const StyledCard = styled(Card)({
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  // boxShadow: "none",    
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.21)",
    boxShadow: "none",    // ✅ No shadow
    transition: "transform 0.3s ease-in-out",
  },
  animation: `${fadeIn} 0.8s ease-out`,
  height: "100%",
  display: "flex",
  marginTop: "10px",
  marginBottom: "10px",
  flexDirection: "column",
});

const CustomCard = styled(Card)(({ color }) => ({
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
  },
  display: "flex",
  alignItems: "center",
  padding: "10px",
  gap: "20px",
  background: color,//"#FFFFFF",
  height: "100%",
}));

const IconWrapper = styled(Box)(({ theme, color }) => ({
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: color || formalPalette.primary,
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  "& img": {
    filter: "invert(100%)",
    width: "30px",
    height: "30px",
  },
}));

const StyledTypography = styled(Typography)({
  fontWeight: 600,
  fontSize: "1.8rem",
  color: formalPalette.textPrimaryLight,
});

const TitleTypography = styled(Typography)({
  fontWeight: 400,
  fontSize: "0.9rem",
  color: formalPalette.textSecondaryLight,
  textTransform: "uppercase",
  letterSpacing: "1px",
});

const Dashboard = () => {
  const { token } = useAuth();
  const [cardCount, setCardCount] = useState({});
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
          }
        );
        if (response.data.success) {
          setCardCount(response.data.data ? response.data.data : {});
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
          setCountData(response.data?.data ? response.data?.data : []);
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
  }, [filter, token]);

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

  const cardWidgets = [
    {
      title: "Total Schools",
      total: cardCount.totalSchool || 0,
      icon: totalSchoolicon,
      background: "linear-gradient(135deg, #74ebd5 0%, #3498DB 100%)",
      color: "linear-gradient(135deg, #36D1DC 0%, #5B86E5 100%)",
      shade: "linear-gradient(135deg, #bafaffff 0%, #89a5e0ff 100%)"  
      
    },
    {
      title: "Total CACs",
      total: cardCount.totalCaC || 0,
      icon: totalCACicon,
      color: "linear-gradient(135deg, #FAD961 0%, #F76B1C 100%)", // Green
      shade: "linear-gradient(135deg, #faefc9ff 0%, #f9c5a8ff 100%)",  
    },
    {
      title: "Total Survey",
      total: cardCount.totalSubmission || 0,
      icon: surveyicon,
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // Purple
      shade: "linear-gradient(135deg, #afbcf7ff 0%, #d8b1ffff 100%)"  
    },
    {
      title: "Total Visited School",
      total: cardCount.visitSchoolCount || 0,
      icon: visitedSchoolicon,
      color: "linear-gradient(135deg, #80e943ff 0%, #38f9d7 100%)", // Yellow
      shade: "linear-gradient(135deg, #d7f7c5ff 0%, #9effedff 100%)" 
    },
  ];

  const renderCard = (title, total, icon, color,shade) => (
    <CustomCard color={color}>
      <IconWrapper color={shade}>
        <img src={icon} alt={`${title} icon`} />
      </IconWrapper>
      <Box>
        <TitleTypography>{title}</TitleTypography>
        <StyledTypography>{total}</StyledTypography>
      </Box>
    </CustomCard>
  );

  return (
    <Grid  container>
      <Grid container spacing={4} sx={{ marginBottom: 4 }}>
        <Grid item xs={12}>
          <Header />
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ boxShadow: "none" }}>
            <CardContent>
              <DropDown filterData={onFilterUpdate} isDate={true} filter={filter} />
            </CardContent>
          </Card>
        </Grid>
        <Grid container spacing={2}  sx={{marginLeft:3,marginRight:2}}>
        {cardWidgets.map((card, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            key={index}
            sx={{ animation: `${slideInLeft} 0.5s ease-out ${index * 0.1}s` }}
            // ml={2}
          >
            {renderCard(card.title, card.total, card.icon, card.color, card.shade)}
          </Grid>
        ))}
        </Grid>
      </Grid>

      <Divider sx={{ my: 4, borderColor: formalPalette.border }} />

      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
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
                      <StyledCard>
                        <CardContent>
                          <ChartOne data={data} />
                        </CardContent>
                      </StyledCard>
                    </Grid>
                  );
                // case "किस विषय का अवलोकन किया गया?":
                //   return (
                //     <Grid item xs={12} md={6} lg={4} key={index}>
                //       <StyledCard>
                //         <CardContent>
                //           <ChartTwo data={data} />
                //         </CardContent>
                //       </StyledCard>
                //     </Grid>
                //   );
                // case "पढाई जा रही कक्षा की बैठक व्यवस्था कैसी हैं ?":
                //   return (
                //     <Grid item xs={12} md={6} lg={4} key={index}>
                //       <StyledCard>
                //         <CardContent>
                //           <ChartThree data={data} />
                //         </CardContent>
                //       </StyledCard>
                //     </Grid>
                //   );
                default:
                  return null;
              }
            })
            // <></>
          ) : (
            <Grid item xs={12}>
              <NoData />
            </Grid>
          )}
        </Grid>
      )}
    </Grid>
  );
};
export default Dashboard;