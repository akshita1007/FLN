import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import "./Question.css";
import Header from "../Header/Header";
import { Container, Grid2 } from "@mui/material";
import { Colors } from "../../utils/Theme/Colors";
import { Grid } from "antd";

const Question = () => {
  const [step, setStep] = useState("step1");
  const [subjectCode, setSubjectCode] = useState("1");
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        let url;
        if (step === "step1") {
          url = "http://localhost:4000/api/v1/question/step1";
        } else if (step === "step2") {
          url = `http://localhost:4000/api/v1/question/step2?subjectCode=${subjectCode}`;
        } else if (step === "step3" && subjectCode === "1") {
          url = "http://localhost:4000/api/v1/question/step3/filter-hindi-data";
        } else if (step === "step3" && subjectCode === "2") {
          url = "http://localhost:4000/api/v1/question/step3/filter-math-data";
        } else {
          url = "http://localhost:4000/api/v1/question/step4/filter-hindi-data";
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        console.log(`Fetched ${step} (subject ${subjectCode}) data:`, json);

        // Normalize the response data
        let normalizedData;
        if (Array.isArray(json.data)) {
          normalizedData = json.data;
        } else {
          normalizedData = [json.data];
        }

        setData(normalizedData);
        setFormData(normalizedData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setData(null);
        setFormData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [step, subjectCode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <p className="text-xl text-gray-600">
          Loading {step} {step === "step2" ? `(Subject ${subjectCode})` : ""} data...
        </p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <p className="text-xl text-gray-600">
          No data found for {step} {step === "step2" ? `(Subject ${subjectCode})` : ""}.
        </p>
      </div>
    );
  }

  const handleOptionChange = (parentIndex, questionId, optionId) => {
    setFormData((prevData) => {
      const updatedData = [...prevData];
      const parent = updatedData[parentIndex];
      const updatedQuestions = parent.questions.map((q) => {
        if (q.id === questionId) {
          const updatedOptions = q.option.map((opt) => ({
            ...opt,
            isChecked: opt.id === optionId,
          }));
          return { ...q, option: updatedOptions, answer: optionId };
        }
        return q;
      });
      updatedData[parentIndex] = { ...parent, questions: updatedQuestions };
      return updatedData;
    });
  };

  const handleMultiOptionChange = (parentIndex, questionId, optionId) => {
    setFormData((prevData) => {
      const updatedData = [...prevData];
      const parent = updatedData[parentIndex];
      const updatedQuestions = parent.questions.map((q) => {
        if (q.id === questionId) {
          const updatedOptions = q.option.map((opt) =>
            opt.id === optionId ? { ...opt, isChecked: !opt.isChecked } : opt
          );
          return {
            ...q,
            option: updatedOptions,
            answer: updatedOptions.filter((o) => o.isChecked).map((o) => o.id),
          };
        }
        return q;
      });
      updatedData[parentIndex] = { ...parent, questions: updatedQuestions };
      return updatedData;
    });
  };

  const handleInputChange = (parentIndex, questionId, value) => {
    setFormData((prevData) => {
      const updatedData = [...prevData];
      const parent = updatedData[parentIndex];
      const updatedQuestions = parent.questions.map((q) => {
        if (q.id === questionId) {
          return { ...q, answer: value };
        }
        return q;
      });
      updatedData[parentIndex] = { ...parent, questions: updatedQuestions };
      return updatedData;
    });
  };

  return (
    <Container
      maxWidth="auto"
      className="analysis-page"
      sx={{ bgcolor: Colors.bg.bg1, overflowX: "hidden", padding: { xs: 0 } }}
    >
      <Header title={"Questionnaire"} />
      <div className="container">
        <header className="header">
          <h2 sx={{}}>{data[0]?.title || "Questionnaire"}</h2>
          {/* <select
            value={step}
            onChange={(e) => setStep(e.target.value)}
            className="dropdown"
            style={{ marginTop: "10px", marginRight: "10px" }}
          >
            <option value="step1">कक्षा के बारे में जानकारी</option>
            <option value="step2">भाषा शिक्षण के खंड</option>
            <option value="step3">भाषा शिक्षण के खंड {">"} मौखिक भाषा विकास एवं सम्बंधित लेखन</option>
            <option value="step4">भाषा शिक्षण के खंड {">"} मौखिक भाषा विकास एवं सम्बंधित लेखन</option>
          </select> */}
          <div className="custom-select-wrapper">
  <select
    value={step}
    onChange={(e) => setStep(e.target.value)}
    className="dropdown"
  >
    <option value="step1">कक्षा के बारे में जानकारी</option>
    <option value="step2">भाषा शिक्षण के खंड</option>
    <option value="step3">भाषा शिक्षण के खंड {">"} मौखिक भाषा विकास एवं सम्बंधित लेखन</option>
    <option value="step4">भाषा शिक्षण के खंड {">"} मौखिक भाषा विकास एवं सम्बंधित लेखन</option>
  </select>
</div>


          {(step === "step2" || step === "step3") && (
            <select
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              className="dropdown"
              style={{ marginTop: "10px" }}
            >
              <option value="1">Hindi</option>
              <option value="2">Maths</option>
            </select>
          )}
        </header>

        <main className="main-content">
          <section className="form-section">
            <h2>प्रश्नों का अवलोकन</h2>
            {formData?.map((parent, parentIndex) => (
              <div key={parent.title} className="parent-section-container">
                {formData.length > 1 && (
                  <h3 className="parent-title">{parent.title}</h3>
                )}
                {parent?.questions?.map((question) => (
                  <div className="card" key={question.id}>
                    <h4 className="question-title">{question.questionText}</h4>
                    {question.subtitle && (
                      <p className="subtitle">{question.subtitle}</p>
                    )}

                    <div className="options-container">
                      {question.type === "multiselect" &&
                        question?.option?.map((opt) => (
                          <label key={opt.id} className="option-label">
                            <input
                              type="checkbox"
                              checked={opt.isChecked}
                              onChange={() =>
                                handleMultiOptionChange(parentIndex, question.id, opt.id)
                              }
                            />
                            {opt.text}
                          </label>
                        ))}

                      {question.type === "option" &&
                        question?.option?.map((opt) => (
                          <label key={opt.id} className="option-label">
                            <input
                              type="radio"
                              name={`${parentIndex}-${question.id}`}
                              checked={false}
                              readOnly
                              onChange={() =>
                                handleOptionChange(parentIndex, question.id, opt.id)
                              }
                            />
                            {opt.text}
                          </label>
                        ))}

                      {question.type === "dropdown" && (
                        <select
                          className="dropdown"
                          value={question.answer || ""}
                          onChange={(e) =>
                            handleInputChange(parentIndex, question.id, e.target.value)
                          }
                        >
                          <option value="">Select</option>
                          {question?.option?.map((opt) => (
                            <option key={opt.id} value={opt.text}>
                              {opt.text}
                            </option>
                          ))}
                        </select>
                      )}

                      {question.type === "input" && (
                        <input
                          type={question.typeOfInput || "text"}
                          className="input-field"
                          placeholder="Enter answer"
                          value={question.answer || ""}
                          onChange={(e) =>
                            handleInputChange(parentIndex, question.id, e.target.value)
                          }
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </section>

          {/* {step === "step2" && (
            <aside className="graph-section">
              <div className="graph-card">
                <ReactECharts
                  option={{
                    title: {
                      text: "Student Attendance Report",
                      left: "center",
                      textStyle: { color: "#3f51b5" },
                    },
                    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
                    xAxis: { type: "category", data: ["Enrolled", "Present", "Absent"] },
                    yAxis: { type: "value" },
                    series: [
                      {
                        name: "Student Count",
                        type: "bar",
                        data: [
                          { value: 0, itemStyle: { color: "#4bc0c0" } }, // Replace with actual values
                          { value: 0, itemStyle: { color: "#36a2eb" } }, // Replace with actual values
                          { value: 0, itemStyle: { color: "#ff6384" } }, // Replace with actual values
                        ],
                        barWidth: "60%",
                        label: { show: true, position: "top", color: "#333" },
                      },
                    ],
                  }}
                  style={{ height: "350px" }}
                />
              </div>
            </aside>
          )} */}
        </main>
      </div>
    </Container>
  );
};

export default Question;