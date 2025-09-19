import React, { useState, useEffect, useMemo, useCallback } from "react";
import ReactECharts from "echarts-for-react";
import {
  Container,
  Grid,
  Card,
  Typography,
  Box,
  Tabs,
  Tab,
  CardContent,
  Stack,
  Divider,
  Chip,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import Header from "../Header/Header";
import DropDown from "../Dashboard/DropDown";
import { Colors } from "../../utils/Theme/Colors";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import NoData from "../../utils/NoData/NoData";
import Loader from "../../utils/Loader/Loader";

const stepDataList = [
  { step_key: "step1", step_value: "Step 1" },
  { step_key: "step2", step_value: "Step 2" },
  { step_key: "step3", step_value: "Step 3" },
  { step_key: "step4", step_value: "Step 4" },
];

const subjectCodeList = [
  { subjectCode: "1", subjectCodeValue: "Hindi" },
  { subjectCode: "2", subjectCodeValue: "Maths" },
];

const getChartConfig = (chartData) => {
  const totalItems = chartData?.length || 0;

  if (totalItems >= 8) {
    return { type: "bar", width: 12 };
  }

  if (totalItems >= 5) {
    return { type: "bar", width: 8 };
  }

  return { type: "pie", width: totalItems <= 2 ? 4 : 6 };
};

const formatPercent = (value) => {
  if (!Number.isFinite(value) || value <= 0) {
    return "0%";
  }

  return value >= 10 ? `${value.toFixed(0)}%` : `${value.toFixed(1)}%`;
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
      console.error("Failed to fetch analysis data", error);
      setCountData([]);
    } finally {
      setIsLoading(false);
    }
  }, [filter, token]);

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
    if (!countData?.length) return [];

    return countData
      .map((question, index) => {
        const rawOptions = question?.option || [];
        const chartData = rawOptions.map((opt, optIndex) => ({
          id: optIndex + 1,
          value: opt?.count || 0,
          name: opt?.text || `Option ${optIndex + 1}`,
        }));

        if (!chartData.length) {
          return null;
        }

        const totalResponses = chartData.reduce((sum, item) => sum + item.value, 0);
        const chartDataWithShare = chartData.map((item) => ({
          ...item,
          share: totalResponses ? (item.value / totalResponses) * 100 : 0,
          displayLabel: `${item.name} (${item.value.toLocaleString()})`,
        }));
        const dominantOption = chartDataWithShare.reduce(
          (prev, current) => (current.value > prev.value ? current : prev),
          chartDataWithShare[0]
        );
        const config = getChartConfig(chartDataWithShare);

        return {
          index: index + 1,
          questionText: question?.questionText || `Question ${index + 1}`,
          chartData: chartDataWithShare,
          type: config.type,
          width: config.width,
          totalResponses,
          dominantOptionLabel: dominantOption?.name || "",
          dominantOptionShare: dominantOption?.share || 0,
        };
      })
      .filter(Boolean);
  }, [countData]);


  useEffect(() => {
    if (!chartDataArray.length) {
      setSelectedQuestionIndex(0);
      return;
    }

    setSelectedQuestionIndex((prev) =>
      prev >= chartDataArray.length ? 0 : prev
    );
  }, [chartDataArray]);

  const selectedQuestion = chartDataArray[selectedQuestionIndex] || null;
  const questionCount = chartDataArray.length;

  const pieColors = useMemo(() => [
    "#2563eb",
    "#38bdf8",
    "#ea580c",
    "#dc2626",
    "#22c55e",
    "#facc15",
    "#06d6a0",
    "#118ab2",
  ], []);

  const selectedQuestionPieOption = useMemo(() => {
    if (!selectedQuestion || !selectedQuestion.chartData?.length) {
      return null;
    }

    const hasResponses = selectedQuestion.chartData.some((item) => item.value > 0);
    if (!hasResponses) {
      return null;
    }

    const seriesData = selectedQuestion.chartData.map((item) => ({
      value: item.value,
      name: item.displayLabel || `${item.name} (${item.value.toLocaleString()})`,
    }));

    return {
      color: pieColors,
      tooltip: {
        trigger: "item",
        formatter: (params) => {
          const value = Number(params.value) || 0;
          const percent = typeof params.percent === "number" ? params.percent.toFixed(1) : params.percent;
          return `${params.name}<br/>${value.toLocaleString()} (${percent}%)`;
        },
      },
      legend: {
        orient: "vertical",
        right: 0,
        top: "middle",
        textStyle: { color: Colors.grey.g700, fontSize: 12 },
      },
      series: [
        {
          name: "Responses",
          type: "pie",
          radius: ["45%", "70%"],
          center: ["40%", "50%"],
          itemStyle: { borderRadius: 12, borderColor: "#fff", borderWidth: 2 },
          label: {
            show: true,
            formatter: ({ percent }) => `${percent?.toFixed ? percent.toFixed(1) : percent}%`,
            fontWeight: 600,
            color: Colors.grey.g700,
          },
          labelLine: { length: 18, length2: 12, smooth: true },
          data: seriesData,
        },
      ],
    };
  }, [pieColors, selectedQuestion]);

  const summaryCards = useMemo(
    () => [
      {
        id: "total-questions",
        label: "Total Questions",
        value: summaryMetrics.totalQuestions,
        helper: "Tracked in the current selection",
        icon: QueryStatsOutlinedIcon,
        accent: Colors.gradient.shades,
      },
      {
        id: "total-responses",
        label: "Responses Recorded",
        value: summaryMetrics.totalResponses,
        helper: `Avg. ${summaryMetrics.averageOptions} options/question`,
        icon: InsightsOutlinedIcon,
        accent: Colors.gradient.shades1,
      },
      {
        id: "top-question",
        label: "Most Engaging Question",
        value: summaryMetrics.topQuestion?.total || "-",
        helper: summaryMetrics.topQuestion?.text || "No responses yet",
        icon: LeaderboardOutlinedIcon,
        accent: Colors.gradient.shades,
      },
    ],
    [summaryMetrics]
  );

  //   [isLoading]
  // );

  const handleQuestionSelect = useCallback((index) => {
    setSelectedQuestionIndex(index);
  }, []);

  const handleQuestionDropdownChange = useCallback(
    (event) => {
      const index = Number(event.target.value);
      handleQuestionSelect(Number.isNaN(index) ? 0 : index);
    },
    [handleQuestionSelect]
  );

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
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 280,
            }}
          >
            <Loader msg="Fetching data... Please wait" size={40} />
          </Box>
        ) : chartDataArray.length > 0 && selectedQuestion ? (
          <Grid container spacing={3} alignItems="stretch">
            <Grid item xs={12} lg={6}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  backgroundColor: Colors.common.white,
                  border: `1px solid ${alpha(Colors.primary.main, 0.12)}`,
                  boxShadow: "0 20px 60px -35px rgba(15, 23, 42, 0.6)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    flexGrow: 1,
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: Colors.grey.g800 }}
                      >
                        Select Question
                      </Typography>
                      <Typography variant="body2" sx={{ color: Colors.grey.g600 }}>
                        {questionCount} available in this view
                      </Typography>
                    </Box>
                    <Chip
                      size="small"
                      label={`${summaryMetrics.totalResponses.toLocaleString()} responses`}
                      sx={{
                        fontWeight: 600,
                        color: Colors.primary.dark,
                        backgroundColor: alpha(Colors.primary.light, 0.16),
                      }}
                    />
                  </Stack>

                  <FormControl fullWidth size="small">
                    <InputLabel id="question-select-label">Question</InputLabel>
                    <Select
                      labelId="question-select-label"
                      value={selectedQuestionIndex}
                      label="Question"
                      onChange={handleQuestionDropdownChange}
                    >
                      {chartDataArray.map((data, idx) => (
                        <MenuItem key={data.index} value={idx}>
                          <Stack spacing={0.25}>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: Colors.grey.g800 }}
                            >
                              {`Question ${data.index}`}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: Colors.grey.g600, whiteSpace: "normal" }}
                            >
                              {data.questionText}
                            </Typography>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: Colors.grey.g800 }}
                  >
                    {selectedQuestion.questionText}
                  </Typography>
                  <Box
                    sx={{
                      mt: 1,
                      borderRadius: 3,
                      background: `linear-gradient(145deg, ${alpha(Colors.primary.light, 0.16)} 0%, ${alpha(Colors.info.light, 0.12)} 100%)`,
                      flexGrow: 1,
                      p: { xs: 2, md: 3 },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {selectedQuestionPieOption ? (
                      <ReactECharts
                        option={selectedQuestionPieOption}
                        style={{
                          height: selectedQuestion?.type === "bar" ? 360 : 320,
                          width: "100%",
                        }}
                      />
                    ) : (
                      <Typography variant="body2" sx={{ color: Colors.grey.g600 }}>
                        No responses available to plot.
                      </Typography>
                    )}
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{ color: Colors.grey.g600, textAlign: "center" }}
                  >
                    {`${selectedQuestion.totalResponses.toLocaleString()} responses captured for this question`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  backgroundColor: Colors.common.white,
                  border: `1px solid ${alpha(Colors.primary.main, 0.12)}`,
                  boxShadow: "0 20px 60px -35px rgba(15, 23, 42, 0.6)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    flexGrow: 1,
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Chip
                      size="small"
                      label={`Question ${selectedQuestion.index}`}
                      sx={{
                        fontWeight: 600,
                        color: Colors.primary.dark,
                        backgroundColor: alpha(Colors.primary.light, 0.18),
                      }}
                    />
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: Colors.grey.g800 }}
                    >
                      Question Details
                    </Typography>
                  </Stack>

                  <Typography sx={{ color: Colors.grey.g700 }}>
                    {selectedQuestion.questionText}
                  </Typography>

                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    sx={{ mt: 1 }}
                  >
                    {[
                      {
                        id: "responses",
                        label: "Total responses",
                        value: selectedQuestion.totalResponses.toLocaleString(),
                      },
                      {
                        id: "top-choice",
                        label: "Top choice",
                        value: selectedQuestion.dominantOptionLabel || "No responses yet",
                      },
                      {
                        id: "share",
                        label: "Top choice share",
                        value: formatPercent(selectedQuestion.dominantOptionShare),
                      },
                    ].map((stat) => (
                      <Box
                        key={stat.id}
                        sx={{
                          flex: 1,
                          borderRadius: 2.5,
                          border: `1px solid ${alpha(Colors.primary.main, 0.12)}`,
                          backgroundColor: alpha(Colors.primary.light, 0.08),
                          px: 2,
                          py: 1.5,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ color: Colors.grey.g600, textTransform: "uppercase", letterSpacing: 0.5 }}
                        >
                          {stat.label}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            color: Colors.grey.g800,
                            mt: 0.5,
                          }}
                        >
                          {stat.value}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>

                  <Divider />

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {selectedQuestion.chartData.map((option) => (
                      <Box key={option.id}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              color: Colors.grey.g700,
                              pr: 2,
                            }}
                          >
                            {option.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: Colors.primary.dark,
                            }}
                          >
                            {`${formatPercent(option.share)} (${option.value.toLocaleString()})`}
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(option.share, 100)}
                          sx={{
                            mt: 0.75,
                            height: 8,
                            borderRadius: 999,
                            backgroundColor: alpha(Colors.primary.light, 0.12),
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 999,
                              background: Colors.primary.dark,
                            },
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <NoData />
        )}
      </Box>
    </Container>
  );
};

export default AnalysisPage;



