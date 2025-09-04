
import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import "./Question.css";
import Header from "../Header/Header";
import { Container } from "@mui/material";
import { Colors } from "../../utils/Theme/Colors";

const Question = () => {
  const [step, setStep] = useState("step1"); // Step dropdown
  const [subjectCode, setSubjectCode] = useState("1"); // Subject dropdown
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch API whenever step or subjectCode changes
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        let url =
          step === "step1"
            ? "http://localhost:4000/api/v1/question/step1"
            : `http://localhost:4000/api/v1/question/step2?subjectCode=${subjectCode}`;

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
        setData(json.data);
        setFormData(json.data);
      } catch (err) {
        console.error("Error fetching data:", err);
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

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <p className="text-xl text-gray-600">
          No data found for {step} {step === "step2" ? `(Subject ${subjectCode})` : ""}.
        </p>
      </div>
    );
  }

  // ✅ Handlers
  const handleOptionChange = (questionId, optionId) => {
    setFormData((prevData) => {
      const updatedQuestions = prevData.questions.map((q) => {
        if (q.id === questionId) {
          const updatedOptions = q.option.map((opt) => ({
            ...opt,
            isChecked: opt.id === optionId,
          }));
          return { ...q, option: updatedOptions, answer: optionId };
        }
        return q;
      });
      return { ...prevData, questions: updatedQuestions };
    });
  };

  const handleMultiOptionChange = (questionId, optionId) => {
    setFormData((prevData) => {
      const updatedQuestions = prevData.questions.map((q) => {
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
      return { ...prevData, questions: updatedQuestions };
    });
  };

  const handleInputChange = (questionId, value) => {
    setFormData((prevData) => {
      const updatedQuestions = prevData.questions.map((q) => {
        if (q.id === questionId) {
          return { ...q, answer: value };
        }
        return q;
      });
      return { ...prevData, questions: updatedQuestions };
    });
  };

  // ✅ Attendance Graph (Step 2 has D/E)
  const enrolled =
    parseInt(formData?.questions.find((q) => q.id === "D")?.answer) || 0;
  const present =
    parseInt(formData?.questions.find((q) => q.id === "E")?.answer) || 0;
  const absent = Math.max(enrolled - present, 0);

  const eChartsOptions = {
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
          { value: enrolled, itemStyle: { color: "#4bc0c0" } },
          { value: present, itemStyle: { color: "#36a2eb" } },
          { value: absent, itemStyle: { color: "#ff6384" } },
        ],
        barWidth: "60%",
        label: { show: true, position: "top", color: "#333" },
      },
    ],
  };

  return (
    <Container
      maxWidth="auto"
      className="analysis-page"
      sx={{ bgcolor: Colors.bg.bg1, overflowX: "hidden", padding: { xs: 0 } }}
    >
      <Header />
      <div className="container">
        <header className="header">
          <h1>{formData.title}</h1>

          {/* ✅ Step selector dropdown */}
          <select
            value={step}
            onChange={(e) => setStep(e.target.value)}
            className="dropdown"
            style={{ marginTop: "10px", marginRight: "10px" }}
          >
            <option value="step1">Step 1</option>
            <option value="step2">Step 2</option>
          </select>

          {/* ✅ Subject selector (only for step2) */}
          {step === "step2" && (
            <select
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              className="dropdown"
              style={{ marginTop: "10px" }}
            >
              <option value="1">Subject Code 1</option>
              <option value="2">Subject Code 2</option>
            </select>
          )}
        </header>

        <main className="main-content">
          <section className="form-section">
            <h2>प्रश्नों का अवलोकन</h2>

            {formData.questions.map((question) => (
              <div className="card" key={question.id}>
                <h3 className="question-title">{question.questionText}</h3>
                {question.subtitle && (
                  <p className="subtitle">{question.subtitle}</p>
                )}

                <div className="options-container">
                  {question.type === "multiselect" &&
                    question.option.map((opt) => (
                      <label key={opt.id} className="option-label">
                        <input
                          type="checkbox"
                          checked={opt.isChecked}
                          onChange={() =>
                            handleMultiOptionChange(question.id, opt.id)
                          }
                        />
                        {opt.text}
                      </label>
                    ))}

                  {question.type === "option" &&
                    question.option.map((opt) => (
                      <label key={opt.id} className="option-label">
                        <input
                          type="radio"
                          name={question.id}
                          checked={opt.isChecked}
                          onChange={() =>
                            handleOptionChange(question.id, opt.id)
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
                        handleInputChange(question.id, e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      {question.option.map((opt) => (
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
                        handleInputChange(question.id, e.target.value)
                      }
                    />
                  )}
                </div>
              </div>
            ))}
          </section>

          {/* ✅ Attendance Graph (only if step2) */}
          {step === "step2" && (
            <aside className="graph-section">
              <div className="graph-card">
                <ReactECharts
                  option={eChartsOptions}
                  style={{ height: "350px" }}
                />
              </div>
            </aside>
          )}
        </main>
      </div>
    </Container>
  );
};

export default Question;
