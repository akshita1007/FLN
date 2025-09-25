// import React, { useState } from "react";
// import DropDown from "../Dashboard/DropDown";
// // import "./CacListPage.css";
// import TableMaterialGet from "../../utils/Table/TableMaterialGet";
// import { Card, CardContent, Grid, Box, Container } from "@mui/material";
// import Header from "../Header/Header";

// const CacListPage = () => {
//   const [filter, setFilter] = useState({});

//   const onFilterUpdate = (filterObj) => {
//     setFilter(filterObj);
//   };

//   // ✅ Table Columns
//   const moduleColumn = () => [
//     { accessorKey: "c_name", header: "Name", filterVariant: "select" },
//     { accessorKey: "Dist", header: "District", filterVariant: "select" },
//     { accessorKey: "Block", header: "Block", filterVariant: "select" },
//     { accessorKey: "cluster_name", header: "Cluster Name", filterVariant: "select" },
//     { accessorKey: "cac_mobile", header: "Mobile" },
//     { accessorKey: "visitSchoolCount", header: "Total School Visit" },
//     {
//       accessorKey: "class_1",
//       header: "Class 1",
//       Cell: ({ row }) => row.original.visitClass?.class_1 ?? 0,
//     },
//     {
//       accessorKey: "class_2",
//       header: "Class 2",
//       Cell: ({ row }) => row.original.visitClass?.class_2 ?? 0,
//     },
//     {
//       accessorKey: "class_3",
//       header: "Class 3",
//       Cell: ({ row }) => row.original.visitClass?.class_3 ?? 0,
//     },
//     {
//       accessorKey: "class_4",
//       header: "Class 4",
//       Cell: ({ row }) => row.original.visitClass?.class_4 ?? 0,
//     },
//     {
//       accessorKey: "class_5",
//       header: "Class 5",
//       Cell: ({ row }) => row.original.visitClass?.class_5 ?? 0,
//     },
//   ];

//   return (
//     <Container maxWidth="auto" className="analysis-page" sx={{ padding: { xs: 0 } }}>
//       <Header title={"CAC LIST"} />
//       <Box sx={{ p: "20px", mb: "25px" }}>
//         <Card sx={{ boxShadow: "none" }}>
//           <CardContent>
//             <DropDown
//               filterData={onFilterUpdate}
//               isDate={true}
//               filter={filter}
//               fullWidth
//             />
//           </CardContent>
//         </Card>
//       </Box>
//     </Container>


//   );
// };

// export default CacListPage;


import React, { useState, useEffect } from "react";
import { Colors } from "../../utils/Theme/Colors";
import DropDown from "../Dashboard/DropDown";
import {
  Card,
  CardContent,
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import Header from "../Header/Header";
import axios from "axios";

const CacListPage = () => {
  const [filter, setFilter] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);


  const onFilterUpdate = (filterObj) => setFilter(filterObj);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/v1/dashboard/cac-list`,
          {
            params: { page: 1, ...filter },
            headers: {
              Authorization: `Bearer ${token}`,
            },


          }
        );
        setData(response.data.data || []);
      } catch (err) {
        console.error("Error fetching CAC list:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };


    fetchData();
  }, [filter]);

  return (
    <Container maxWidth="auto" className="analysis-page" sx={{ padding: { xs: 0 } }}>
      {/* Header */}
      <Header title={"CAC LIST"} />

      {/* DropDown */}
      <Box sx={{ p: "15px", }}>
        <Card sx={{ boxShadow: "none" }}>
          <CardContent>
            <DropDown filterData={onFilterUpdate} isDate={true} filter={filter} fullWidth />
          </CardContent>
        </Card>
      </Box>

      {/* Table */}
      <Box sx={{ p: "20px", mb: "25px" }}>
        <Card sx={{ boxShadow: "none" }}>
          <CardContent>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ background: Colors.gradient.shades }}>
                    <TableRow >
                      <TableCell sx={{ color: "#ffffff", fontWeight: 600 }}>Name</TableCell>
                      <TableCell sx={{ color: "#ffffff", fontWeight: 600 }}>District</TableCell>
                      <TableCell sx={{ color: "#ffffff", fontWeight: 600 }}>Block</TableCell>
                      <TableCell sx={{ color: "#ffffff", fontWeight: 600 }}>Cluster Name</TableCell>
                      <TableCell sx={{ color: "#ffffff", fontWeight: 600 }}>Mobile</TableCell>
                      <TableCell sx={{ color: "#ffffff", fontWeight: 600 }}>Total School Visit</TableCell>
                      <TableCell sx={{ color: "#ffffff", fontWeight: 600 }}>Class 1</TableCell>
                      <TableCell sx={{ color: "#ffffff", fontWeight: 600 }}>Class 2</TableCell>
                      <TableCell sx={{ color: "#ffffff", fontWeight: 600 }}>Class 3</TableCell>
                      <TableCell sx={{ color: "#ffffff", fontWeight: 600 }}>Class 4</TableCell>
                      <TableCell sx={{ color: "#ffffff", fontWeight: 600 }}>Class 5</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row) => (
                      <TableRow key={row._id}>
                        <TableCell>{row.c_name}</TableCell>
                        <TableCell>{row.Dist}</TableCell>
                        <TableCell>{row.Block}</TableCell>
                        <TableCell>{row.cluster_name}</TableCell>
                        <TableCell>{row.cac_mobile}</TableCell>
                        <TableCell style={{ textAlign: "center" }}>{row.visitSchoolCount}</TableCell>
                        <TableCell>{row.visitClass?.class_1 ?? 0}</TableCell>
                        <TableCell>{row.visitClass?.class_2 ?? 0}</TableCell>
                        <TableCell>{row.visitClass?.class_3 ?? 0}</TableCell>
                        <TableCell>{row.visitClass?.class_4 ?? 0}</TableCell>
                        <TableCell>{row.visitClass?.class_5 ?? 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default CacListPage;
