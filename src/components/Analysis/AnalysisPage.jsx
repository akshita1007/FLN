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
  { step_key: "step2", step_value: "Step 2" },
  { step_key: "step3", step_value: "Step 3" },
];

const reportCategory = [
  { category_key: "1", category_value: "Data List" },
  { category_key: "2", category_value: "Questions Based Analysis" },
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
    category: reportCategory[0]?.category_key,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [countData, setCountData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/v1/submit/report-analysis/`,
        {
          params: { ...filter },
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

  const handleTabChange = useCallback((event, newValue) => {
    setSelectedTab(newValue);
    setFilter((prevFilter) => ({
      ...prevFilter,
      subjectCode: subjectCodeList[newValue].subjectCode,
    }));
  }, []);

  const onFilterUpdate = useCallback((newFilter) => {
    setFilter((prevFilter) => ({ ...prevFilter, ...newFilter }));
  }, []);

  const summaryMetrics = useMemo(() => {
    if (!countData?.length) {
      return {
        totalQuestions: 0,
        totalResponses: 0,
        averageOptions: 0,
        topQuestion: null,
      };
    }

    let totalResponses = 0;
    let topQuestion = null;
    let optionsCount = 0;

    countData.forEach((question, index) => {
      const optionList = question?.option || [];
      const questionTotal = optionList.reduce(
        (sum, opt) => sum + (opt?.count || 0),
        0
      );
      totalResponses += questionTotal;
      optionsCount += optionList.length;

      if (!topQuestion || questionTotal > topQuestion.total) {
        topQuestion = {
          text: question?.questionText || `Question ${index + 1}`,
          total: questionTotal,
        };
      }
    });

    return {
      totalQuestions: countData.length,
      totalResponses,
      averageOptions: Number((optionsCount / countData.length || 0).toFixed(1)),
      topQuestion,
    };
  }, [countData]);

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
    <Container
      maxWidth="xl"
      className="analysis-page"
      sx={{
        minHeight: "100vh",
        py: 3,
        px: { xs: 1, sm: 2, md: 4 },
        background: `linear-gradient(180deg, ${Colors.extra.e8} 0%, ${Colors.bg.bg1} 40%, ${Colors.grey.g100} 100%)`,
      }}
    >
      <Header title="Analysis Dashboard" />

      <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 3 }}>
        <Grid container spacing={2}>
          {summaryCards.map((card) => {
            const Icon = card.icon;
            const formattedValue =
              typeof card.value === "number"
                ? card.value.toLocaleString()
                : card.value;

            return (
              <Grid item xs={12} sm={6} md={4} key={card.id}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 20px 45px -25px rgba(15, 23, 42, 0.45)",
                    backgroundColor: Colors.common.white,
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background: card.accent,
                      opacity: 0.12,
                    }}
                  />
                  <CardContent
                    sx={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          background: alpha(Colors.primary.main, 0.12),
                          display: "grid",
                          placeItems: "center",
                          color: Colors.primary.dark,
                        }}
                      >
                        <Icon />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: Colors.grey.g600 }}>
                          {card.label}
                        </Typography>
                        <Typography variant="h5" sx={{ color: Colors.extra.e3, fontWeight: 700 }}>
                          {formattedValue}
                        </Typography>
                      </Box>
                    </Stack>
                    <Divider sx={{ borderColor: alpha(Colors.grey.g400, 0.4) }} />
                    <Typography variant="body2" sx={{ color: Colors.grey.g600 }}>
                      {card.helper}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Card
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 24px 60px -32px rgba(15, 23, 42, 0.45)",
          }}
        >
          <Box
            sx={{
              background: Colors.gradient.shades,
              color: Colors.primary.contrastText,
              py: 2.5,
              px: { xs: 2, md: 3 },
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Refine Your Analysis
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: alpha(Colors.primary.contrastText, 0.8) }}
            >
              Choose the step, subject, and category to update the visualisations.
            </Typography>
          </Box>

          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <DropDown
              filterData={onFilterUpdate}
              stepDataList={stepDataList}
              reportCategory={reportCategory}
              filter={filter}
            />

            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              TabIndicatorProps={{ style: { display: "none" } }}
              aria-label="subject tabs"
              sx={{
                mt: 1,
                alignSelf: { xs: "stretch", md: "flex-start" },
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  minHeight: 0,
                  px: 2.5,
                  py: 1.25,
                  mr: 1.5,
                  borderRadius: 2,
                  color: Colors.grey.g700,
                  backgroundColor: alpha(Colors.primary.light, 0.08),
                  transition: "all 0.3s ease",
                },
                "& .MuiTab-root.Mui-selected": {
                  color: Colors.primary.contrastText,
                  background: Colors.primary.dark,
                  boxShadow: "0 10px 22px rgba(37, 99, 235, 0.25)",
                },
              }}
            >
              {subjectCodeList.map((item) => (
                <Tab key={item.subjectCode} label={item.subjectCodeValue} />
              ))}
            </Tabs>
          </CardContent>
        </Card>

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



