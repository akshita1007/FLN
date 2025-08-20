import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import Header from "../Header/Header";
import { useTheme } from "@mui/material/styles";
import DropDown from "../Dashboard/DropDown";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../utils/Loader/Loader";
import DateRangeValue from "../../utils/DateRange/DateRangeValue";
import { MaterialReactTable } from "material-react-table";
import { Colors } from "../../utils/Theme/Colors";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Button, Input } from "antd";
import {
  LoadingOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import "./Submission.css";
import Toast from "../../utils/Toast/Toast";
const { Search } = Input;

const Submission = () => {
  const theme = useTheme();
  const [filter, setFilter] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submissionData, setSubmissionData] = useState([]);
  const { token } = useAuth();

  const [searchValue, setSearchValue] = useState("");
  const dropdownRef = useRef();
  const cancelTokenRef = useRef(null);
  const [deferredSearchValue, setDeferredSearchValue] = useState("");

  const onFilterUpdate = (filterObj) => {
    setSearchValue("");
    setFilter(filterObj);
  };

  const onInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel("Request canceled due to new request");
      }
      cancelTokenRef.current = axios.CancelToken.source();
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/v1/submit/list`,
          {
            params: { ...filter },
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cancelToken: cancelTokenRef.current.token,
          }
        );
        if (response?.data) {
          setSubmissionData(response.data?.data ? response.data?.data : []);
        }
      } catch (error) {
        // console.error(error);
        setSubmissionData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filter, deferredSearchValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDeferredSearchValue(searchValue);
      if (Object.keys(filter)?.length > 0 && searchValue) setFilter({});
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchValue]);

  const columns = [
    {
      header: "UDISE Code",
      accessorKey: "school.udiseCode",
    },
    {
      header: "School Name",
      accessorKey: "school.schoolName",
    },
    {
      header: "District",
      accessorKey: "school.district",
    },

    {
      header: "Block",
      accessorKey: "school.block",
    },
    {
      header: "Cluster",
      accessorKey: "school.cluster",
    },
  ];

  const renderDetailPanel = ({ row }) => {
    const answers = row.original.answers;
    return (
      <Box sx={{ padding: 2, backgroundColor: theme.palette.background.paper }}>
        <Grid container spacing={2}>
          {answers.map((answer, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card
                sx={{
                  // boxShadow: 2,
                  borderRadius: 4,
                  boxShadow: "none",
                  backgroundColor: Colors.extra.e8,
                  minHeight: "150px",
                }}
              >
                <CardContent>
                  {/* <Typography variant="h6" sx={{ marginBottom: 1, fontWeight:"bold", color:"#1a2e05" }}>
                    Question {index + 1}
                  </Typography> */}
                  <Typography
                    variant="body1"
                    color="text.primary"
                    sx={{ color: Colors.bg.bg5 }}
                  >
                    <strong>Question {index + 1} : </strong>{" "}
                    {answer.questionText}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    sx={{ marginTop: 1, color: Colors.bg.bg4 }}
                  >
                    <strong>Answer : </strong> {answer.answer}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  return (
    <Container
      maxWidth="auto"
      className="analysis-page"
      sx={{
        bgcolor: theme.palette.background.default,
        overflowX: "hidden",
        padding: { xs: 0 },
      }}
    >
      <Grid item xs={12} sx={{ marginBottom: "30px" }}>
        <Header />
      </Grid>

      <Grid item xs={12} sx={{ marginBottom: "25px", padding: "0 20px" }}>
        <DropDown
          filter={filter}
          filterData={onFilterUpdate}
          isSchool={true}
          isDate={true}
          ref={dropdownRef}
          isSearchValue={true}
        />
      </Grid>

      {/* <Grid container spacing={2} sx={{ marginBottom: "25px", padding: "0 20px" }}>
         <Grid item md={4} >
           <Search   placeholder={"Enter Udise Id"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={handleSearch}
            loading={isLoading} 
            allowClear
            className="search-bar"
            />
         </Grid>x
      </Grid> */}

      <Box sx={{ margin: "20px 0", padding: "0 20px", minHeight: "100vh" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            color: Colors.bg.bg3,
          }}
        >
          <h3>School Submission Report 📝</h3>
        </Box>
        <MaterialReactTable
          columns={columns}
          data={submissionData?.filter((a) => a.school)}
          renderDetailPanel={renderDetailPanel}
          enableRowExpanding
          enableExpandAll={false}
          enableColumnActions={false}
          enablePagination={false}
          // enableFilters={false}
          enableDensityToggle={false}
          enableSorting={false}
          enableFullScreenToggle={false}
          enableHiding={false}
          enableGlobalFilter={true}
          enableColumnFilters={false}
          // onGlobalFilterChange={setSearchValue}
          // globalFilter={searchValue}
          initialState={{
            showGlobalFilter: true,
          }}
          muiSearchTextFieldProps={{
            placeholder: "Enter Udise ID",
            value: searchValue,
            onChange: onInputChange,
            // onClear: () => setSearchValue('')
            InputProps: {
              endAdornment: (
                <InputAdornment position="end">
                  {searchValue && (
                    <CloseOutlined
                      onClick={() => {
                        setSearchValue("");
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </InputAdornment>
              ),
            },
          }}
          muiTableBodyProps={{
            sx: {
              position: "relative",
              minHeight: "100px",
              "&::after": isLoading
                ? {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1,
                  }
                : undefined,
            },
          }}
          renderEmptyRowsFallback={() =>
            isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Loader size={40} />
              </Box>
            ) : null
          }
          state={{ isLoading }}
          muiExpandButtonProps={({ row, table }) => ({
            onClick: () =>
              table.setExpanded({ [row.id]: !row.getIsExpanded() }),
            sx: {
              transform: row.getIsExpanded()
                ? "rotate(180deg)"
                : "rotate(-90deg)",
              transition: "transform 0.2s",
            },
          })}
        />
      </Box>
    </Container>
  );
};

export default Submission;
