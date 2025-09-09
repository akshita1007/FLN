import React, { useEffect, useState } from "react";
import { Container, Grid, CircularProgress, Card, CardContent, Box } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Header from "../Header/Header";
import DropDown from "../Dashboard/DropDown";
import { Colors } from "../../utils/Theme/Colors";
import { Typography } from "antd";
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import "./SchoolVisit.css";
import { ShimmerCard } from "react-shimmer-effects";
import Loader from "../../utils/Loader/Loader";

const SchoolVisit = () => {
  const { token } = useAuth();
  const [filter, setFilter] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [mostVisited,setMostVisited]=useState({});
  const [commonVisit, setCommonVisit] = useState([]);

  const onFilterUpdate = (filterObj) => {
    setFilter(filterObj);
  };

  useEffect(() => {
         const fetchMostVisitedSchool=async()=>{
        setIsLoading(true);
        try {

            const response = await axios.get(
                `${process.env.REACT_APP_URL}/v1/dashboard/most-visited-schools`,
                {
                  params: { ...filter},
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              if (response?.data) {
                console.log(response.data?.data);
                
                setMostVisited(response.data?.data ? response.data?.data : {});
              }
            
        } catch (error) {
            setMostVisited({})
        }
        finally{
         setIsLoading(false);
        }
    }

    const fetchCommonVisitedSchool = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/v1/dashboard/common-visited-schools`,
          {
            params: { ...filter },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response?.data) {
          console.log(response.data?.data);
          setCommonVisit(response.data?.data || []);
        }
      } catch (error) {
        console.error("Error fetching common visited schools:", error);
        setCommonVisit([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMostVisitedSchool();
    fetchCommonVisitedSchool();
  }, [filter]);

  const columns = [
  
    { accessorKey: "udiseCode", header: "UDISE Code" },
    { accessorKey: "schoolName", header: "School Name" },
    { accessorKey: "district", header: "District" },
    { accessorKey: "cluster", header: "Cluster" },
    { accessorKey: "block", header: "Block" },
    { accessorKey: "visitCount", header: "Visit Count" },
  ];

  return (
    <Container
      maxWidth="auto"
      className="analysis-page"
      sx={{ bgcolor: Colors.bg.bg1, overflowX: "hidden", padding: { xs: 0 } }}
    >
      {/* Header */}
        <Header title={"Visit List"} />

      {/* Dropdown Filter */}
      {/* <Grid item xs={12} sx={{ marginBottom: "25px", padding: "0 20px" }}>
        <DropDown filterData={onFilterUpdate} filter={filter} />
      </Grid> */}

      <Box sx={{ p: "20px", mb: "25px" }}>
        <Card sx={{ boxShadow: "none" }}>
          <CardContent>
            <DropDown filterData={onFilterUpdate} filter={filter} />
          </CardContent>
        </Card>
      </Box>

      <Grid container spacing={2} sx={{ marginBottom: "25px", padding: "0 20px" }}>
      {/* District Level Card */}
      <Grid item xs={12} sm={4}>
        <Card className="" sx={{
             borderRadius:"0.8rem",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white", 
          position: "relative",
          backgroundImage: "linear-gradient(to right,rgb(233, 242, 255) 0%,rgb(187, 242, 245) 100%)"
        }}>
          <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)",
                animation: "shimmer 2s infinite",
                zIndex: 0,
              }}
            ></div>
            <style>
              {`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}
            </style>
          <ShimmerCard width="100%" height="100%" shimmerColor="#ffffff" />
          <CardContent sx={{ position: "relative", zIndex: 1 }}>
           <Typography variant="h5" style={{ fontWeight: "550", marginBottom: "5px", fontSize: "1rem" }}>
              District Insights
            </Typography>
            {mostVisited?.districtLevel && (
              <>
                <Typography variant="h6" style={{color:"#03C03C"}}>
                  <ArrowUpward sx={{ 
                    verticalAlign: "middle", 
                    marginRight: "5px", 
                    fontSize: "1.2rem", 
                    transform: "rotate(45deg)", 
                    color: "lime"
                  }} />
                  Most Visited: {mostVisited.districtLevel.mostVisited[0]?.name} ({mostVisited.districtLevel.mostVisited[0]?.count})
                </Typography>
                <Typography variant="body1" style={{ color: "#FF033E" }}>
                  <ArrowDownward style={{ 
                    verticalAlign: "middle", 
                    marginRight: "5px", 
                    fontSize: "1.2rem", 
                    transform: "rotate(-45deg)", 
                    color: "red"
                  }} />
                  Least Visited: {mostVisited.districtLevel.leastVisited[0]?.name} ({mostVisited.districtLevel.leastVisited[0]?.count})
                </Typography>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Block Level Card */}
      <Grid item xs={12} sm={4}>
        <Card className="" sx={{
          backgroundImage: "linear-gradient(to right,rgb(233, 242, 255) 0%,rgb(187, 242, 245) 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white", 
          borderRadius:"0.8rem",
          position: "relative",
        }}>
           <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)",
                animation: "shimmer 2s infinite",
                zIndex: 0,
              }}
            ></div>
            <style>
              {`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}
            </style>
          <ShimmerCard width="100%" height="100%" shimmerColor="#ffffff" /> {/* Add shimmer effect */}
          <CardContent style={{ position: "relative", zIndex: 1,borderRadius:"2rem" }}>
          <Typography variant="h5" style={{ fontWeight: "550", marginBottom: "5px", fontSize: "1rem"}}>
              Block Insights
            </Typography>
            {mostVisited?.blockLevel && (
              <>
                <Typography variant="h6" style={{color:"#03C03C"}}>
                  <ArrowUpward sx={{ 
                    verticalAlign: "middle", 
                    marginRight: "5px", 
                    fontSize: "1.2rem", 
                    transform: "rotate(45deg)", 
                    color: "lime"
                  }} />
                  Most Visited: {mostVisited.blockLevel.mostVisited[0]?.name} ({mostVisited.blockLevel.mostVisited[0]?.count})
                </Typography>
                <Typography variant="body1" style={{ color: "#FF033E" }}>
                  <ArrowDownward sx={{ 
                    verticalAlign: "middle", 
                    marginRight: "5px", 
                    fontSize: "1.2rem", 
                    transform: "rotate(-45deg)", 
                    color: "red"
                  }} />
                  Least Visited: {mostVisited.blockLevel.leastVisited[0]?.name} ({mostVisited.blockLevel.leastVisited[0]?.count})
                </Typography>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>
      {/* Cluster Level Card */}
      <Grid item xs={12} sm={4}>
        <Card className="" sx={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white", 
          position: "relative",
          borderRadius:"0.8rem",
           backgroundImage: "linear-gradient(to right,rgb(233, 242, 255) 0%,rgb(187, 242, 245) 100%)",
        }}>
           <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)",
                animation: "shimmer 2s infinite",
                zIndex: 0,
              }}
            ></div>
            <style>
              {`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}
            </style>
          <ShimmerCard width="100%" height="100%" shimmerColor="#ffffff" /> {/* Add shimmer effect */}
          <CardContent sx={{ position: "relative", zIndex: 1 }}>
            <Typography variant="h5" style={{ fontWeight: "550", marginBottom: "5px", fontSize: "1rem" }}>
              Cluster Insights
            </Typography>
            {mostVisited?.clusterLevel && (
              <>
                 <Typography variant="h6" style={{color:"#03C03C"}}>
                  <ArrowUpward sx={{ 
                    verticalAlign: "middle", 
                    marginRight: "5px", 
                    fontSize: "1.2rem", 
                    transform: "rotate(45deg)", 
                    color: "lime"
                  }} />
                  Most Visited: {mostVisited.clusterLevel.mostVisited[0]?.name} ({mostVisited.clusterLevel.mostVisited[0]?.count})
                </Typography>
                <Typography variant="body1" style={{ color: "#FF033E" }}>
                  <ArrowDownward sx={{ 
                    verticalAlign: "middle", 
                    marginRight: "5px", 
                    fontSize: "1.2rem", 
                    transform: "rotate(-45deg)", 
                    color: "red"
                  }} />
                  Least Visited: {mostVisited.clusterLevel.leastVisited[0]?.name} ({mostVisited.clusterLevel.leastVisited[0]?.count})
                </Typography>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
   {/* Data Table */}
      <Grid item xs={12} sx={{ padding: "0 20px" }}>
        {isLoading ? (
          <Grid >
            <Loader msg={"Fetching Data..Please Wait"} size={40} />
          </Grid>
        ) : (
          <MaterialReactTable
            columns={columns}
            data={commonVisit}
            enableColumnOrdering
            enableGlobalFilter
            muiTableProps={{ sx: { boxShadow: 2 } }}
          />
        )}
      </Grid>
    </Container>
  );
};

export default SchoolVisit;
