import * as React from "react";
import { useState, useEffect,useImperativeHandle } from "react";
import {
  Select,
  InputLabel,
  MenuItem,
  Grid,
  FormControl,
  Button,
  Autocomplete,
  TextField,
} from "@mui/material";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import DropdownComp from "../../utils/dropdown/DropdownComp";
import { Colors } from "../../utils/Theme/Colors";
import Restart from "../../Assets/icons/rotate.png";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import "./Dropdown.css";

const { RangePicker } = DatePicker;

const DropDown= React.forwardRef(({
  filterData,
  stepDataList,
  isSchool = false,
  isDate = false,
  filter
},ref) =>{
  const [selectDistrict, setSelectDistrict] = useState("");
  const [selectBlock, setSelectBlock] = useState("");
  const [selectBlockList, setSelectBlockList] = useState([]);
  const [selectDistrictList, setSelectDistrictList] = useState([]);
  const [selectCluster, setSelectCluster] = useState("");
  const [selectSubject, setSelectSubject] = useState("1");
  const [selectClusterList, setSelectClusterList] = useState([]);
  const [disableDropdown, setDisableDropdown] = useState(false);
  const { token } = useAuth();
  const [selectStep, setSelectStep] = useState(
    stepDataList ? stepDataList[0]?.step_key : ""
  );
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [selectSchool, setSelectSchool] = useState("");
  const [selectSchoolList, setSelectSchoolList] = useState([]);
  const [selectedDates, setSelectedDates] = useState(null);
  const handleDateChange = (dates, dateStrings) => {
    console.log(dates,dateStrings)
    const updatedFilter = {
      ...filter,
      startDate: dates[0].format("YYYY-MM-DD"),
      endDate: dates[1].format("YYYY-MM-DD"),
    };
    if (filterData) filterData(updatedFilter);
   

  };
   
  const handleChangeDistrict = (dist) => {
    const filterObj = {};
    if (stepDataList ) filterObj.step = filter.step;
    filterObj.districtId = dist;
    // setSelectDistrict(dist);
    // setSelectBlock("");
    // setSelectCluster("");
    setSelectClusterList([]);
    setSelectBlockList([]);
    // setSelectSchool("");
    setSelectSchoolList([]);
    // setSelectedDates(null);
    if (filterData) filterData(filterObj);
  };


  useEffect(() => {
    const getBlock = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/master/getAllBlock`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              districtId: filter.districtId,
            },
          }
        );
        setSelectBlockList(response.data.data ? response.data.data : []);
      } catch (error) {
        console.error(error);
      }
    };
    if (filter?.districtId) {
      getBlock();
    }
  }, [filter?.districtId]);

  const handleChangeBlock = async (block) => {
    const filterObj = {};
    // if (selectDistrict) filterObj.districtId = selectDistrict;
    // if (selectBlock) filterObj.blockId = selectBlock;
    // if (selectCluster) filterObj.clusterId = selectCluster;
    // if (stepDataList && selectStep) filterObj.step = selectStep;
    // if (isSchool && selectSchool) filterObj.schoolName = selectSchool;
    if (stepDataList ) filterObj.step = filter.step;
    filterObj.districtId = filter.districtId;
    filterObj.blockId = block;
    // setSelectBlock(block);
    // setSelectCluster("");
    setSelectClusterList([]);
    // setSelectSchool("");
    setSelectSchoolList([]);
    // setSelectedDates(null);
    // console.log("dflhjksahgkdhasjdashhghjgg",filter)
    if (filterData) filterData(filterObj);
  };
  function resetFunction() {
    // setSelectDistrict("");
    // setSelectBlock("");
    // setSelectCluster("");
    // setSelectSchool("");
    // setSelectedDates(null);
    // if (stepDataList) setSelectStep(stepDataList[0]?.step_key);
    setSelectBlockList([]);
    setSelectClusterList([]);
    setSelectSchoolList([]);
    const filterObject={};
    if(stepDataList) filterObject.step=stepDataList[0]?.step_key 
    filterData(filterObject)
  }

  useImperativeHandle(ref, () => ({
    resetFilter: resetFunction,
  }));

  useEffect(() => {
    const getCluster = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/master/getAllCluster`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              blockId: filter.blockId,
            },
          }
        );
        setSelectClusterList(response?.data?.data ? response?.data?.data : []);
      } catch (error) {
        console.error(error);
      }
    };
    if (filter?.blockId) {
      getCluster();
    }
  }, [filter?.blockId]);

  useEffect(() => {
    const getSchool = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/v1/dashboard/school-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              clusterId: filter.clusterId,
            },
          }
        );
        console.log(response?.data?.data);
        setSelectSchoolList(response?.data?.data ? response?.data?.data : []);
      } catch (error) {
        console.error(error);
      }
    };
    if (filter?.clusterId) {
      getSchool();
    }
  }, [filter?.clusterId]);

  const handleChangeCluster = (cluster) => {
    // setSelectCluster(cluster);
    // setSelectSchool("");
    setSelectSchoolList([]);
    // setSelectedDates(null);
    const filterObj = {};
    if (stepDataList ) filterObj.step = filter.step;
    filterObj.districtId = filter.districtId;
    filterObj.blockId = filter.blockId;
    filterObj.clusterId=cluster;
    if (filterData) filterData(filterObj);
  };

  const handleSchoolChange = (event, newValue) => {
    // console.log(newValue)
    const filterObj = {};
    if (stepDataList ) filterObj.step = filter.step;
    filterObj.districtId = filter.districtId;
    filterObj.blockId = filter.blockId;
    filterObj.clusterId=filter.clusterId;
    filterObj.schoolName = newValue;
    if (filterData) filterData(filterObj);
    // setSelectSchool(newValue);
    // setSelectedDates(null);
  };

  const handleStepChange = (step) => {
    console.log("hghjkhjkhjhjhjkh",step)
    const filterObj = {};
    if (stepDataList ) filterObj.step = step;
    if (filterData) filterData(filterObj);
    
    // filterObj.districtId = dist;
    // setSelectStep(step);
    // setSelectDistrict("");
    // setSelectBlock("");
    // setSelectCluster("");
    setSelectClusterList([]);
    setSelectBlockList([]);
    // setSelectSchool("");
    setSelectSchoolList([]);
    // setSelectedDates(null);
  };
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/master/getAllDistrict`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSelectDistrictList(response.data.data ? response.data.data : []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDistricts();
  }, []);

  // useEffect(() => {
  //   if (isInitialRender) {
  //     setIsInitialRender(false);
  //     return;
  //   }
  //   const filterObj = {};
  //   if (selectDistrict) filterObj.districtId = selectDistrict;
  //   if (selectBlock) filterObj.blockId = selectBlock;
  //   if (selectCluster) filterObj.clusterId = selectCluster;
  //   if (stepDataList && selectStep) filterObj.step = selectStep;
  //   if (isSchool && selectSchool) filterObj.schoolName = selectSchool;
  //   if (isDate && selectedDates) {
  //     filterObj.startDate = selectedDates[0].format("DD-MM-YYYY");
  //     filterObj.endDate = selectedDates[1].format("DD-MM-YYYY");
  //   }
  //   if (filterData) filterData(filterObj);
  // }, [
  //   selectBlock,
  //   selectCluster,
  //   selectDistrict,
  //   selectStep,
  //   selectSchool,
  //   selectedDates,
  // ]);
  
  


  return (
    <>
      <Grid container spacing={1}>
        {stepDataList && (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={
              (stepDataList && isSchool) ||
              (isSchool && isDate) ||
              (isDate && stepDataList)
                ? 2
                : 2.5
            }
          >
            <DropdownComp
              value={filter?.step}
              multiMenu={stepDataList}
              id={"step-drop"}
              getSelected={(step) => handleStepChange(step)}
              label={"Select Step"}
              id_variable="step_key"
              name_variable="step_value"
              menu_first="none"
            />
          </Grid>
        )}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={
            (stepDataList && isSchool) ||
            (isSchool && isDate) ||
            (isDate && stepDataList)
              ? 2
              : 2.5
          }
        >
          <DropdownComp
            value={filter?.districtId || ""}
            multiMenu={selectDistrictList}
            id={"dist-drop"}
            getSelected={(dist) => handleChangeDistrict(dist)}
            label={"Select District"}
            id_variable="udise_district_code"
            name_variable="district_name"
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={
            (stepDataList && isSchool) ||
            (isSchool && isDate) ||
            (isDate && stepDataList)
              ? 2
              : 2.5
          }
        >
          <DropdownComp
            value={filter?.blockId  || ""}
            multiMenu={filter?.districtId ? selectBlockList:[]}
            id={"block-drop"}
            getSelected={(block) => handleChangeBlock(block)}
            label={"Select Block"}
            id_variable="udise_block_code"
            name_variable="block_name"
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={
            (stepDataList && isSchool) ||
            (isSchool && isDate) ||
            (isDate && stepDataList)
              ? 2
              : 2.5
          }
        >
          <DropdownComp
            value={filter?.clusterId}
            multiMenu={ filter?.blockId ? selectClusterList  : []}
            id={"cluster-drop"}
            getSelected={(cluster) => handleChangeCluster(cluster)}
            label={"Select Cluster"}
            id_variable="udise_cluster_code"
            name_variable="cluster_name"
          />
        </Grid>
        {isSchool && (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={
              (stepDataList && isSchool) ||
              (isSchool && isDate) ||
              (isDate && stepDataList)
                ? 2
                : 2.5
            }
          >
            <Autocomplete
              options={filter?.clusterId ? selectSchoolList.map((school) => school?.school_name):[]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  label="Search By School"
                  variant="outlined"
                  InputLabelProps={{
                    style: { fontSize: "14px" },
                  }}
                  inputProps={{
                    ...params.inputProps,
                    style: { fontSize: "14px" },
                  }}
                />
              )}
              value={filter?.schoolName}
              onChange={handleSchoolChange}
            />
          </Grid>
        )}

        {isDate && (
          <Grid item xs={12} sm={6} md={4} lg={2.5}>
            <RangePicker
              value={filter?.startDate && filter?.endDate
                ? [
                    dayjs(filter.startDate, "YYYY-MM-DD"),
                    dayjs(filter.endDate, "YYYY-MM-DD"),
                  ]
                : null}
              onChange={handleDateChange}
              disabledDate={(current) =>
                current && current > dayjs().endOf("day")
              }
              className="custom-range-picker"
            />
          </Grid>
        )}

        <Grid item xs={12} sm={6} md={4} lg={1} sx={{ ml: "auto" }}>
          <FormControl size="small" sx={{ display: "flex" }}>
            <Button
              variant="outlined"
              // color="secondary"
              size="medium"
              // startIcon={<SettingsBackupRestoreIcon />}
              startIcon={
                <img
                  src={Restart}
                  alt="reset-icon"
                  style={{ width: "20px", height: "20px" }}
                />
              }
              onClick={resetFunction}
              sx={{
                alignSelf: "flex-end",
                color: Colors.bg.bg3,
                borderRadius: "6px",
                borderColor: Colors.bg.bg3,
                fontWeight: "bold",
                fontSize:"14px",
                // background: Colors.gradient.shades,
                // "&:hover": {
                //   background: Colors.onHover.shades,
                //  },
              }}
            >
              Reset
            </Button>
          </FormControl>
        </Grid>
      </Grid>
    </>
  );
}
);

export default DropDown;