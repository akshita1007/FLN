// import React, { useState, useMemo, useEffect } from "react";
// import "./AnalysisPage.css";
// import DropDown from "../Dashboard/DropDown";
// import { Colors } from "../../utils/Theme/Colors";
// import {
//   Container,
//   Grid,
//   Card,
//   Typography,
//   Box,
//   CircularProgress,
//   Tabs,
//   Tab,
//   CardContent,
// } from "@mui/material";
// import Header from "../Header/Header";
// import BarChart from "../Dashboard/BarChart";
// import { useAuth } from "../../context/AuthContext";
// import axios from "axios";
// import clsx from "clsx";
// import { styled, keyframes } from "@mui/system";
// import Loader from "../../utils/Loader/Loader";
// import DoughnutChart from "../../utils/Charts/DoughnutChart";
// import PieChart from "../../utils/Charts/PieChart";
// import { maxSubArrays } from "../../utils/ArrangeArray";
// import HorizontalBarChart from "../../utils/Charts/HorizontalBarChart";
// import NoData from "../../utils/NoData/NoData";
// // Step data and subject code lists
// const stepDataList = [
//   { step_key: "step2", step_value: "एफएलएन शिक्षण खंड" },
//   { step_key: "step3", step_value: "एफएलएन शिक्षण प्रक्रिया" },
// ];

// const subjectCodeList = [
//   { subjectCode: "1", subjectCodeValue: "HINDI" },
//   { subjectCode: "2", subjectCodeValue: "MATHS" },
// ];

// const AnalysisPage = () => {
//   const [filter, setFilter] = useState({ step: stepDataList[0]?.step_key });
//   const [isLoading, setIsLoading] = useState(false);
//   const [countData, setCountData] = useState([]);
//   const { token } = useAuth();
//   const [selectSubjectCode, setSelectSubjectCode] = useState("1");
//   const [selectedTab, setSelectedTab] = useState(0);

//   const onFilterUpdate = (filterObj) => {
//     setFilter(filterObj);
//   };

//   const handleChangeSubject = (subCode) => {
//     setSelectSubjectCode(subCode);
//   };

//   const handleTabChange = (event, newValue) => {
//     setSelectedTab(newValue);
//     handleChangeSubject(subjectCodeList[newValue].subjectCode);
//   };

//   const fetchData = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_URL}/v1/submit/report-analysis/`,
//         {
//           params: { ...filter, subjectCode: selectSubjectCode },
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (response?.data) {
//         setCountData(response.data?.data ? response.data?.data : []);
//       }
//     } catch (error) {
//       setCountData([]);
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [filter, selectSubjectCode]);
//   const chartType = (data) => {
//     const maxNameLength = data?.chartData.reduce((max, d) => {
//       return d.name.length > max ? d.name.length : max;
//     }, 0);

//     const isLargeLegend = data.chartData.some((d) => d.name.length > 15);
//     const questionSize = data?.questionText?.length;
//     // console.log(questionSize)
//     const legendLength = data.chartData.reduce(
//       (totalLength, item) => totalLength + item.name.length,
//       0
//     );
//     const totalLength = data.chartData.length;
//     // console.log(legendLength,totalLength)
//     // if(isLargeLegend || questionSize>200) return {type:"doughnut",size:"small",width:legendLength<230?6:9};
//     if (maxNameLength > 15)
//       return {
//         type: "doughnut",
//         size: "small",
//         width:
//           maxNameLength < 100 || legendLength < 200
//             ? 6
//             : maxNameLength < 200 || legendLength < 400
//             ? 9
//             : 12,
//       };
//     // if((totalLength>3 && totalLength <=6)  && legendLength<20)   return {type:"doughnut",size:"smaller",width:6};
//     if (totalLength > 30) return { type: "bar", size: "larger", width: 12 };
//     if (totalLength > 18) return { type: "bar", size: "large", width: 9 };
//     if (totalLength > 6) return { type: "bar", size: "large", width: 6 };
//     if (totalLength >= 3 && maxNameLength > 3 && maxNameLength < 10)
//       return {
//         type: "horizontal",
//         size: "small",
//         width:
//           questionSize < 120
//             ? 3
//             : questionSize < 320
//             ? 6
//             : questionSize < 550
//             ? 9
//             : 12,
//       };
//     else
//       return {
//         type: "doughnut",
//         size: "smaller",
//         width:
//           totalLength <= 3 && questionSize < 150
//             ? 3
//             : questionSize < 350
//             ? 6
//             : questionSize < 550
//             ? 9
//             : 12,
//       };
//   };
//   let index = 0;
//   const chartDataArray = useMemo(
//     () => {
//       const unArrangedData = countData
//         ?.map((question) => ({
//           questionText: question.questionText,
//           chartData: question.option.map((opt, optIndex) => ({
//             id: optIndex + 1,
//             value: opt.count,
//             name: opt.text,
//           })),
//         }))
//         .filter((data) => data?.chartData?.length > 0)
//         .map((data) => ({ ...data, ...chartType(data) }));
//       const tempData = maxSubArrays(unArrangedData || []);
//       // console.log(tempData)
//       const arrangedData = [
//         ...tempData?.subarrays?.flat().reverse(),
//         ...tempData?.remaining,
//       ];
//       // console.log(arrangedData)
//       return arrangedData?.map((data) => ({
//         ...data,
//         ...(data?.type == "doughnut" && {
//           type: ++index % 2 == 1 ? "doughnut" : "pie",
//         }),
//       }));
//     },
//     // .sort((a,b)=>a.width-b.width).map((data)=>({...data,...((data?.type=="doughnut") && {type:++index%2==1?"doughnut":"pie"})})),
//     [countData]
//   );

//   return (
//     <Container
//       maxWidth="auto"
//       className="analysis-page"
//       sx={{ bgcolor: Colors.bg.bg1, overflowX: "hidden", padding: { xs: 0 } }}
//     >
//       <Grid item xs={12} sx={{ marginBottom: "30px" }}>
//         <Header />
//       </Grid>
//       <Grid item xs={12} sx={{ marginBottom: "25px", padding: " 0 20px" }}>
//         <DropDown
//           filterData={onFilterUpdate}
//           stepDataList={stepDataList}
//           filter={filter}
//         />
//       </Grid>
//       <Grid sx={{ width: "100%", margin: "15px 0", padding: "0 20px" }}>
//         <Tabs
//           value={selectedTab}
//           onChange={handleTabChange}
//           variant="fullWidth"
//           // indicatorColor="primary"
//           indicatorColor="primary"
//           textColor="inherit"
//         >
//           {subjectCodeList.map((item, index) => (
//             <Tab
//               key={item.subjectCode}
//               label={item.subjectCodeValue}
//               sx={{
//                 fontWeight: "bold",
//                 margin: "0.05rem",
//                 // background: Colors.gradient.shades,
//                 background: Colors.primary.dark,
//                 color: Colors.primary.Extra,
//                 boxShadow:
//                   item.subjectCode === selectSubjectCode ? "#e7e5e4" : "",
//                 transition: "background 0.3s ease, box-shadow 0.3s ease",
//                 borderRadius: "4px",
//               }}
//               onClick={() => handleChangeSubject(item.subjectCode)}
//             />
//           ))}
//         </Tabs>
//       </Grid>
//       {isLoading ? (
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <Loader msg={"Fetching Data..Please Wait"} size={40} />
//         </Box>
//       ) : (
//         <Grid
//           container
//           spacing={3}
//           sx={{ marginBottom: "25px", padding: "0 20px" }}
//         >
//           {chartDataArray && chartDataArray?.length > 0 ? (
//             chartDataArray.map((data, index) => (
//               <Grid item xs={12} md={data.width} key={index}>
//                 <Card
//                   sx={{
//                     backgroundColor: Colors.bg.bg2,
//                     borderRadius: "8px",
//                     padding: "10px",
//                   }}
//                   elevation={0}
//                 >
//                   <CardContent>
//                     {data?.type == "doughnut" && (
//                       <DoughnutChart
//                         title={""}
//                         subtitle={data?.questionText}
//                         width={"45%"}
//                         chartData={data?.chartData ? data?.chartData : []}
//                         lable={"Data"}
//                         loading={isLoading}
//                         size={data.size}
//                       />
//                     )}
//                     {data?.type == "bar" && (
//                       <BarChart
//                         title={""}
//                         subtitle={data?.questionText}
//                         width={"45%"}
//                         chartData={data?.chartData ? data?.chartData : []}
//                         lable={"Data"}
//                         loading={isLoading}
//                       />
//                     )}
//                     {data?.type == "pie" && (
//                       <PieChart
//                         title={""}
//                         subtitle={data?.questionText}
//                         width={"45%"}
//                         chartData={data?.chartData ? data?.chartData : []}
//                         lable={"Data"}
//                         loading={isLoading}
//                         size={data.size}
//                       />
//                     )}
//                     {data?.type == "horizontal" && (
//                       <HorizontalBarChart
//                         title={""}
//                         subtitle={data?.questionText}
//                         width={"45%"}
//                         chartData={data?.chartData ? data?.chartData : []}
//                         lable={"Data"}
//                         loading={isLoading}
//                       />
//                     )}
//                     {/* <NightangleChart title={""}
//             subtitle={data?.questionText}
//             width={"45%"}
//             chartData={data?.chartData ?data?.chartData :[]}
//             lable={"Data"}
//             loading={isLoading}/> */}
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))
//           ) : (
//             <NoData />
//           )}
//         </Grid>
//       )}
//     </Container>
//   );
// };

// export default AnalysisPage;
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Container,
  Grid,
  Card,
  Typography,
  Box,
  Tabs,
  Tab,
  CardContent,
  CircularProgress,
} from "@mui/material";
import Header from "../Header/Header";
import DropDown from "../Dashboard/DropDown";
import { Colors } from "../../utils/Theme/Colors";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import BarChart from "../Dashboard/BarChart";
import PieChart from "../../utils/Charts/PieChart";
import NoData from "../../utils/NoData/NoData";
import Loader from "../../utils/Loader/Loader";
import { color } from "framer-motion";

// Static data lists
const stepDataList = [
  { step_key: "step1", step_value: "Step 1" },
  { step_key: "step2", step_value: "Step 2" },
  { step_key: "step3", step_value: "Step 3" },
  { step_key: "step4", step_value: "Step 4" },
];

const subjectCodeList = [
  { subjectCode: "1", subjectCodeValue: "HINDI" },
  { subjectCode: "2", subjectCodeValue: "MATHS" },
];

// Helper function to determine chart type
const getChartConfig = (data) => {
  const totalItems = data?.chartData?.length || 0;

  // Use a bar chart for many items (more than 6) for clarity
  if (totalItems > 6) {
    return { type: "bar", width: 12 };
  }

  // Use a pie chart for fewer items
  return {
    type: "pie",
    width: totalItems < 3 ? 4 : 6,
  };
};

const AnalysisPage = () => {
  const { token } = useAuth();
  const [filter, setFilter] = useState({
    step: stepDataList[0]?.step_key,
    subjectCode: subjectCodeList[0]?.subjectCode,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [countData, setCountData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [questionList, setQuestionList] = useState([]);
  const [selectedStep, setSelectedStep] = useState(stepDataList[0]?.step_key);

  // Memoized function for fetching data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      let params = { step: filter.step };

      if (filter.step !== "step1") {
        params.subjectCode = filter.subjectCode;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_URL}/v1/submit/report-analysis/`,
        {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCountData(response?.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setCountData([]);
    } finally {
      setIsLoading(false);
    }
  }, [filter, token]);

  // Fetch data whenever filter or token changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (countData && countData.length > 0) {
      const formattedQuestions = countData.map((item, index) => ({
        questionId: item.questionText, // A unique key for each question
        questionText: item.questionText,
      }));
      setQuestionList(formattedQuestions);
      console.log("formattedQuestions", formattedQuestions);
    } else {
      setQuestionList([]);
    }
  }, [countData]);

  // Handle tab change and update filter
  const handleTabChange = useCallback(
    (event, newValue) => {
      setSelectedTab(newValue);
      setFilter((prevFilter) => ({
        ...prevFilter,
        subjectCode: subjectCodeList[newValue].subjectCode,
      }));
    },
    []
  );

  // Handle dropdown filter change
  const onFilterUpdate = useCallback((newFilter) => {
    setFilter((prevFilter) => ({ ...prevFilter, ...newFilter }));
  }, []);

  const handleDataFromChild = useCallback((data) => {
    setSelectedStep(data);
    setFilter((prevFilter) => ({
      ...prevFilter,
      step: data,
      // If the selected step is not 2 or 3, remove the subjectCode
      ...(data === "step2" || data === "step3" || data === "step4" ? { subjectCode: subjectCodeList[selectedTab].subjectCode } : { subjectCode: undefined })
    }));
  }, [selectedTab]);

  // Memoize the processed chart data to avoid re-computation
  const chartDataArray = useMemo(() => {
    if (!countData || countData.length === 0) return [];
    return countData
      .map((question) => {
        const chartData = question.option.map((opt, optIndex) => ({
          id: optIndex + 1,
          value: opt.count,
          name: opt.text,
        }));

        if (chartData.length === 0) return null;

        const config = getChartConfig({ chartData, questionText: question.questionText });

        return {
          questionText: question.questionText,
          chartData: chartData,
          type: config.type,
          width: config.width,
        };
      })
      .filter(Boolean); // Filter out any null entries
  }, [countData]);

  const renderChart = (data) => {
    const chartProps = {
      title: "",
      subtitle: data.questionText,
      chartData: data.chartData,
      colors: ['#2563eb', '#38bdf8', '#ea580c', '#dc2626', '#22c55e', '#ffd166', '#06d6a0', '#118ab2'],
      loading: isLoading,
    };

    switch (data.type) {
      case "pie":
        return <PieChart {...chartProps} />;
      case "bar":
        return <BarChart {...chartProps} />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="auto" className="analysis-page" sx={{ bgcolor: Colors.bg.bg1, padding: { xs: 0 } }}>
      <Header title={"Analysis Report"} />

      <Box>
        <Card sx={{ boxShadow: "none" }}>
          <CardContent>
            <DropDown
              filterData={onFilterUpdate}
              stepDataList={stepDataList}
              filter={filter}
              selected={selectedStep}
              sendData={handleDataFromChild}
              questionDataList={questionList}
            />
          </CardContent>
        </Card>
      </Box>
      {(selectedStep === "step2" || selectedStep === "step3" || selectedStep === "step4") && (
        <>
          <Box sx={{ width: "100%", px: "20px" }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="inherit"
              aria-label="subject tabs"
            >
              {subjectCodeList.map((item) => (
                <Tab
                  key={item.subjectCode}
                  label={item.subjectCodeValue}
                  sx={{
                    fontWeight: "bold",
                    background: Colors.primary.dark,
                    color: Colors.primary.Extra,
                    transition: "background 0.3s ease, box-shadow 0.3s ease",
                    "&.Mui-selected": {
                      background: Colors.primary.darker,
                      color: Colors.primary.contrastText,
                    },
                  }}
                />
              ))}
            </Tabs>
          </Box>
        </>
      )}

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
          <Loader msg={"Fetching Data..Please Wait"} size={40} />
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ p: "20px" }}>
          {chartDataArray.length > 0 ? (
            chartDataArray.map((data, index) => (
              <Grid item xs={12} md={data.width} key={index}>
                <Card sx={{ bgcolor: Colors.bg.bg2, borderRadius: "8px", p: "10px", height: "100%" }} elevation={0}>
                  <CardContent>{renderChart(data)}</CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <NoData />
          )}
        </Grid>
      )}
    </Container>
  );
};

export default AnalysisPage;