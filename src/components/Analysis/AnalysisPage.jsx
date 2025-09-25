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
  { step_key: "step1", step_value: "कक्षा के बारे में जानकारी" },
  { step_key: "step2", step_value: "भाषा शिक्षण के खंड" },
  { step_key: "step3", step_value: "मौखिक भाषा विकास एवं सम्बंधित लेखन" },
  { step_key: "step4", step_value: "खंड-3: विद्यालय/कक्षा के सामान्य अवलोकन" },
];

const classList = [
  { classId: "1", className: "Class 1" },
  { classId: "2", className: "Class 2" },
  { classId: "3", className: "Class 3" },
];

const subjectCodeList = [
  { subjectCode: "1", subjectCodeValue: "Hindi" },
  { subjectCode: "2", subjectCodeValue: "Maths" },
];

const getChartConfig = (chartData) => {
  const totalItems = chartData?.length || 0;
  if (totalItems >= 8) return { type: "bar", width: 12 };
  if (totalItems >= 5) return { type: "bar", width: 8 };
  return { type: "pie", width: totalItems <= 2 ? 4 : 6 };
};

const formatPercent = (value) => (!Number.isFinite(value) || value <= 0 ? "0%" : value >= 10 ? `${value.toFixed(0)}%` : `${value.toFixed(1)}%`);

const AnalysisPage = () => {
  const { token } = useAuth();
  const [filter, setFilter] = useState({ step: stepDataList[0].step_key, subjectCode: subjectCodeList[0].subjectCode });
  const [isLoading, setIsLoading] = useState(false);
  const [countData, setCountData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedStep, setSelectedStep] = useState(stepDataList[0].step_key);

  const handleDataFromChild = useCallback((data) => {
    setSelectedStep(data);
    setFilter((prev) => ({
      ...prev,
      step: data,
      ...(data === "step2" || data === "step3" || data === "step4" ? { subjectCode: subjectCodeList[selectedTab].subjectCode } : { subjectCode: undefined }),
    }));
  }, [selectedTab]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = filter.step !== "step1" ? { step: filter.step, subjectCode: filter.subjectCode } : { step: filter.step };
      const response = await axios.get(`${process.env.REACT_APP_URL}/v1/submit/report-analysis/`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      setCountData(response?.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch analysis data", error);
      setCountData([]);
    } finally {
      setIsLoading(false);
    }
  }, [filter, token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleTabChange = useCallback((e, newValue) => {
    setSelectedTab(newValue);
    setFilter((prev) => ({ ...prev, subjectCode: subjectCodeList[newValue].subjectCode }));
  }, []);

  const onFilterUpdate = useCallback((newFilter) => setFilter((prev) => ({ ...prev, ...newFilter })), []);

  const summaryMetrics = useMemo(() => {
    if (!countData?.length) return { totalQuestions: 0, totalResponses: 0, averageOptions: 0, topQuestion: null };
    let totalResponses = 0, topQuestion = null, optionsCount = 0;
    countData.forEach((q, idx) => {
      const optionList = q?.option || [];
      const questionTotal = optionList.reduce((sum, opt) => sum + (opt?.count || 0), 0);
      totalResponses += questionTotal;
      optionsCount += optionList.length;
      if (!topQuestion || questionTotal > topQuestion.total) topQuestion = { text: q?.questionText || `Question ${idx + 1}`, total: questionTotal };
    });
    return { totalQuestions: countData.length, totalResponses, averageOptions: Number((optionsCount / countData.length || 0).toFixed(1)), topQuestion };
  }, [countData]);

  const chartDataArray = useMemo(() => {
    if (!countData?.length) return [];
    return countData.map((q, idx) => {
      const rawOptions = q?.option || [];
      if (!rawOptions.length) return { index: idx + 1, questionText: q?.questionText || `Question ${idx + 1}`, chartData: [], type: "none", width: 6, totalResponses: 0, dominantOptionLabel: "", dominantOptionShare: 0 };
      const chartData = rawOptions.map((opt, optIdx) => ({ id: optIdx + 1, value: opt?.count || 0, name: opt?.text || `Option ${optIdx + 1}` }));
      const totalResponses = chartData.reduce((sum, i) => sum + i.value, 0);
      const chartDataWithShare = chartData.map(i => ({ ...i, share: totalResponses ? (i.value / totalResponses) * 100 : 0, displayLabel: `${i.name} (${i.value.toLocaleString()})` }));
      const dominantOption = chartDataWithShare.reduce((prev, curr) => (curr.value > prev.value ? curr : prev), chartDataWithShare[0]);
      const config = getChartConfig(chartDataWithShare);
      return { index: idx + 1, questionText: q?.questionText || `Question ${idx + 1}`, chartData: chartDataWithShare, type: config.type, width: config.width, totalResponses, dominantOptionLabel: dominantOption?.name || "", dominantOptionShare: dominantOption?.share || 0 };
    });
  }, [countData]);

  useEffect(() => { if (!chartDataArray.length) setSelectedQuestionIndex(0); else if (selectedQuestionIndex >= chartDataArray.length) setSelectedQuestionIndex(0); }, [chartDataArray]);

  const selectedQuestion = chartDataArray[selectedQuestionIndex] || null;
  const questionCount = chartDataArray.length;

  const pieColors = useMemo(() => ["#2563eb", "#38bdf8", "#ea580c", "#dc2626", "#22c55e", "#facc15", "#06d6a0", "#118ab2"], []);

  const selectedQuestionPieOption = useMemo(() => {
    if (!selectedQuestion || !selectedQuestion.chartData?.length) return null;
    const hasResponses = selectedQuestion.chartData.some(i => i.value > 0);
    if (!hasResponses) return null;
    const seriesData = selectedQuestion.chartData.map(i => ({ value: i.value, name: i.displayLabel || `${i.name} (${i.value.toLocaleString()})` }));
    return {
      color: pieColors,
      tooltip: { trigger: "item", formatter: p => `${p.name}<br/>${Number(p.value).toLocaleString()} (${p.percent?.toFixed(1)}%)` },
      legend: { type: "scroll", orient: "vertical", right: 10, top: 20, bottom: 20 },
      series: [{ name: "Responses", type: "pie", radius: ["45%", "70%"], center: ["50%", "45%"], itemStyle: { borderRadius: 12, borderColor: "#fff", borderWidth: 2 }, label: { show: true, formatter: ({ percent }) => `${percent?.toFixed(1)}%`, fontWeight: 600, color: Colors.grey.g700 }, labelLine: { length: 18, length2: 12, smooth: true }, data: seriesData }],
    };
  }, [pieColors, selectedQuestion]);

  const summaryCards = useMemo(() => [
    { id: "total-questions", label: "Total Questions", value: summaryMetrics.totalQuestions, helper: "Tracked in the current selection", icon: QueryStatsOutlinedIcon, accent: Colors.gradient.shades2 },
    { id: "total-responses", label: "Responses Recorded", value: summaryMetrics.totalResponses, helper: `Avg. ${summaryMetrics.averageOptions} options/question`, icon: InsightsOutlinedIcon, accent: Colors.gradient.shades2 },
    { id: "top-question", label: "Most Engaging Question", value: summaryMetrics.topQuestion?.total || "-", helper: summaryMetrics.topQuestion?.text || "No responses yet", icon: LeaderboardOutlinedIcon, accent: Colors.gradient.shades2 },
  ], [summaryMetrics]);

  const handleQuestionSelect = useCallback((index) => setSelectedQuestionIndex(index), []);
  const handleQuestionDropdownChange = useCallback((e) => { const idx = Number(e.target.value); handleQuestionSelect(Number.isNaN(idx) ? 0 : idx); }, [handleQuestionSelect]);

  return (
    <Container maxWidth="auto" sx={{ padding: { xs: 0 }, transition: "all 0.3s ease", }}>
      <Header title="Analysis Dashboard" />
      <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 3, px: { xs: 2, sm: 3, md: 4 }, transition: "all 0.3s ease", }}>
        {/* <Grid container spacing={2}>
          {summaryCards.map(card => {
            const Icon = card.icon;
            const formattedValue = typeof card.value === "number" ? card.value.toLocaleString() : card.value;
            return (
              <Grid item xs={12} sm={6} md={4} key={card.id}>
                <Card sx={{ height:"100%", borderRadius:3, position:"relative", overflow:"hidden", boxShadow:"0 20px 45px -25px rgba(15,23,42,0.45)", background: card.accent }}>
                  <Box sx={{ position:"absolute", inset:0, background: card.accent, opacity:0.12 }} />
                  <CardContent sx={{ position:"relative", display:"flex", flexDirection:"column", gap:2 }}>
                    <Stack direction="row" spacing={3} alignItems="center">
                      <Box sx={{ width:48,height:48,borderRadius:"70%",background: alpha(Colors.primary.main,0.12),display:"grid",placeItems:"center",color:Colors.bg.bg3 }}><Icon /></Box>
                      <Box>
                        <Typography variant="body2" sx={{ color:Colors.grey.g50 }}>{card.label}</Typography>
                        <Typography variant="h5" sx={{ color:Colors.bg.bg3,fontWeight:700 }}>{formattedValue}</Typography>
                      </Box>
                    </Stack>
                    <Divider sx={{ borderColor: alpha(Colors.bg.bg3,0.3) }} />
                    <Typography variant="body2" sx={{ color:Colors.grey.g50 }}>{card.helper}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid> */}
        <Grid container spacing={2} sx={{ transition: "all 0.3s ease" }}>
          {summaryCards.map(card => {
            const Icon = card.icon;
            const formattedValue = typeof card.value === "number" ? card.value.toLocaleString() : card.value;
            return (
              <Grid item xs={12} sm={6} md={4} key={card.id}>
                <Card sx={{ height: "100%", borderRadius: 3, position: "relative", overflow: "hidden", boxShadow: "0 20px 45px -25px rgba(15,23,42,0.45)", background: card.accent }}>
                  <Box sx={{ position: "absolute", inset: 0, background: card.accent, opacity: 0.12 }} />
                  <CardContent sx={{ position: "relative", display: "flex", flexDirection: "column", gap: 2 }}>
                    <Stack direction="row" spacing={3} alignItems="center">
                      <Box sx={{ width: 48, height: 48, borderRadius: "70%", background: alpha(Colors.primary.main, 0.12), display: "grid", placeItems: "center", color: Colors.bg.bg3 }}><Icon /></Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: Colors.grey.g50 }}>{card.label}</Typography>
                        <Typography variant="h5" sx={{ color: Colors.bg.bg3, fontWeight: 700 }}>{formattedValue}</Typography>
                      </Box>
                    </Stack>
                    <Divider sx={{ borderColor: alpha(Colors.bg.bg3, 0.3) }} />
                    <Typography variant="body2" sx={{ color: Colors.grey.g50 }}>{card.helper}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
        <Card sx={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 24px 60px -32px rgba(15,23,42,0.45)" }}>
          <Box sx={{ background: Colors.gradient.shades, color: Colors.primary.contrastText, py: 2.5, px: { xs: 2, md: 3 } }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Refine Your Analysis</Typography>
            <Typography variant="body2" sx={{ color: alpha(Colors.primary.contrastText, 0.8) }}>Choose the step, subject, and category to update the visualisations.</Typography>
          </Box>
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <DropDown filterData={onFilterUpdate} stepDataList={stepDataList} filter={filter} selected={selectedStep} sendData={handleDataFromChild} classDataList={classList} />
            <Tabs value={selectedTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" TabIndicatorProps={{ style: { display: "none" } }} aria-label="subject tabs" sx={{ mt: 1, alignSelf: { xs: "stretch", md: "flex-start" }, "& .MuiTab-root": { textTransform: "none", fontWeight: 600, minHeight: 0, px: 2.5, py: 1.25, mr: 1.5, borderRadius: 2, color: Colors.grey.g700, backgroundColor: alpha(Colors.primary.light, 0.08), transition: "all 0.3s ease" }, "& .MuiTab-root.Mui-selected": { color: Colors.primary.contrastText, background: Colors.primary.dark, boxShadow: "0 10px 22px rgba(37,99,235,0.25)" } }}>
              {subjectCodeList.map(item => <Tab key={item.subjectCode} label={item.subjectCodeValue} />)}
            </Tabs>
          </CardContent>
        </Card>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 280 }}>
            <Loader msg="Fetching data... Please wait" size={40} />
          </Box>
        ) : chartDataArray.length > 0 && selectedQuestion ? (
          <Grid container spacing={3} alignItems="stretch" sx={{ transition: "all 0.3s ease" }}>
            <Grid item xs={12}>
              {/* Unified Question Analysis Card */}
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: "0 24px 80px -32px rgba(15,23,42,0.45)",
                  p: 3,
                  backgroundColor: "#ffffff",
                }}
              >
                {/* Top Section: Question Selector + Total Responses */}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  justifyContent="space-between"
                >
                  <FormControl fullWidth size="small">
                    <InputLabel id="question-select-label">Select Question</InputLabel>
                    <Select
                      labelId="question-select-label"
                      value={selectedQuestionIndex}
                      label="Select Question"
                      onChange={handleQuestionDropdownChange}
                    >
                      {chartDataArray.map((data, idx) => (
                        <MenuItem key={data.index} value={idx}>
                          <Stack spacing={0.25}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                              {`Question ${data.index}`}
                            </Typography>
                            <Typography variant="caption" sx={{ whiteSpace: "normal", color: "#475569" }}>
                              {data.questionText}
                            </Typography>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Chip
                    size="small"
                    label={`${summaryMetrics.totalResponses.toLocaleString()} responses`}
                    sx={{
                      fontWeight: 600,
                      color: "#1e40af",
                      backgroundColor: "rgba(59,130,246,0.12)",
                    }}
                  />
                </Stack>

                {/* Question Title */}
                <Typography
                  variant="h6"
                  sx={{ mt: 3, fontWeight: 700, color: "#0f172a" }}
                >
                  {selectedQuestion.questionText}
                </Typography>

                {/* Chart Section */}
                <Box
                  sx={{
                    mt: 3,
                    borderRadius: 3,
                    p: 2,
                    backgroundColor: "#f1f5f9",
                    minHeight: 360,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {selectedQuestionPieOption ? (
                    <ReactECharts
                      option={selectedQuestionPieOption}
                      style={{ width: "100%", height: 350 }}
                    />
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ color: "#64748b", textAlign: "center", py: 5 }}
                    >
                      No responses available to plot.
                    </Typography>
                  )}
                </Box>

                {/* Summary Metrics */}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  mt={3}
                >
                  {[
                    { label: "Total Responses Recorded", value: selectedQuestion.totalResponses },
                    { label: "Most Selected Option", value: selectedQuestion.dominantOptionLabel },
                    { label: "Percentage of Top Choice", value: `${selectedQuestion.dominantOptionShare.toFixed(1)}%` },
                  ].map((item, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        flex: 1,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "#f8fafc",
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "#64748b", fontWeight: 500 }}
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: "#1e3a8a", mt: 0.5 }}
                      >
                        {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                {/* Options Progress Bars */}
                <Box
                  sx={{
                    mt: 3,
                    maxHeight: 320,
                    overflowY: "auto",
                    px: 0.5,
                  }}
                >
                  {selectedQuestion.chartData.map((opt) => (
                    <Box key={opt.id} sx={{ mb: 2 }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, color: "#475569" }}
                        >
                          {opt.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#1e40af" }}
                        >
                          {`${formatPercent(opt.share)} (${opt.value.toLocaleString()})`}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(opt.share, 100)}
                        sx={{
                          mt: 1,
                          height: 8,
                          borderRadius: 999,
                          backgroundColor: "rgba(59,130,246,0.12)",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 999,
                            background: "rgb(59,130,246)",
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Box>
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