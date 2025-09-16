// import React, { useState } from "react";
// import DropDown from "../Dashboard/DropDown";
// import "./CacListPage.css";
// import TableMaterialGet from "../../utils/Table/TableMaterialGet";
// import { Colors } from "../../utils/Theme/Colors";
// import { Container, Card, CardContent } from "@mui/material";
// import Header from "../Header/Header";
// import Grid from "@mui/material/Grid";

// const CacListPage = () => {
//   const [filter, setFilter] = useState({});

//   const onFilterUpdate = (filterObj) => {
//     setFilter(filterObj);
//   };

//   return (
//     <>
//       <Grid container>
//           <Grid item xs={12}>
//             <Header title={"CAC LIST"}/>
//           </Grid>
//           <Grid item xs={12} sx={{ marginTop: "20px", padding: " 0 20px" }}>
//             <Card sx={{ boxShadow: "none" }}>
//               <CardContent>
//                 <DropDown filterData={onFilterUpdate} isDate={true} filter={filter} />
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} sx={{ marginTop: "20px", padding: " 0 20px"}}>
//             <Card sx={{ boxShadow: "none" }}>
//               <CardContent>
//                 <TableMaterialGet
//                   URL={`${process.env.REACT_APP_URL}/v1/dashboard/cac-list`}
//                   table_name={"CAC LIST"}
//                   apiBody={"data"}
//                   body={filter}
//                   apiCount={"totalCount"}
//                   column_tab={moduleColumn()}
//                 />
//               </CardContent>
//             </Card>
//           </Grid>
//           {/* <Container
//           maxWidth={"auto"}
//           className="list-page"
//           sx={{
//             bgcolor: Colors.bg.bg1,
//             overflowX: "hidden",
//             padding: { xs: 0 },
//           }}
//         >
//           <Grid item xs={12} sx={{ marginBottom: "25px" }}>
//             <Header />
//           </Grid>
//           <Grid item xs={12} sx={{ marginBottom: "25px", padding: " 0 20px" }}>
//             <DropDown filterData={onFilterUpdate} filter={filter} />
//           </Grid>
//           <Card
//             sx={{
//               backgroundColor: Colors.bg.bg2,
//               borderRadius: "8px",
//               padding: "20px",
//             }}
//           // elevation={0}
//           >
//             <TableMaterialGet
//               URL={`${process.env.REACT_APP_URL}/v1/dashboard/cac-list`}
//               table_name={"CAC LIST"}
//               apiBody={"data"}
//               body={filter}
//               apiCount={"totalCount"}
//               column_tab={moduleColumn()}
//             />
//           </Card>
//         </Container> */}
//       </Grid>
//     </>
//   );
// };

// export default CacListPage;

// const moduleColumn = () => [
//   { accessorKey: "c_name", header: "Name", filterVariant: "select" },
//   { accessorKey: "Dist", header: "District", filterVariant: "select" },
//   { accessorKey: "Block", header: "Block", filterVariant: "select" },
//   {
//     accessorKey: "cluster_name",
//     header: "Cluste Name",
//     filterVariant: "select",
//   },
//   { accessorKey: "cac_mobile", header: "Mobile" },
//   { accessorKey: "visitSchoolCount", header: "Total School Visit" },
// ];



// import React, { useState } from "react";
// import DropDown from "../Dashboard/DropDown";
// import "./CacListPage.css";
// import TableMaterialGet from "../../utils/Table/TableMaterialGet";
// import { Colors } from "../../utils/Theme/Colors";
// import { Container, Card, CardContent, Typography, Collapse, Box } from "@mui/material";
// import Header from "../Header/Header";
// import Grid from "@mui/material/Grid";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import IconButton from "@mui/material/IconButton";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// // New component for the expandable row content
// const CacVisitDetails = ({ visitClass }) => {
//   return (
//     <Collapse in={true} timeout="auto" unmountOnExit>
//       <Box sx={{ margin: 1 }}>
//         <Typography variant="h6" gutterBottom component="div">
//           Class-wise Visits
//         </Typography>
//         <Table size="small" aria-label="class-visits">
//           <TableHead>
//             <TableRow>
//               <TableCell>Class</TableCell>
//               <TableCell align="right">Visits</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {Object.entries(visitClass).map(([className, count]) => (
//               <TableRow key={className}>
//                 <TableCell component="th" scope="row">
//                   {className.replace('_', ' ').toUpperCase()}
//                 </TableCell>
//                 <TableCell align="right">{count}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </Box>
//     </Collapse>
//   );
// };

// const CacListPage = () => {
//   const [filter, setFilter] = useState({});

//   const onFilterUpdate = (filterObj) => {
//     setFilter(filterObj);
//   };

//   const moduleColumn = () => [
//     {
//       accessorKey: "c_name",
//       header: "Name",
//       filterVariant: "select",
//     },
//     { accessorKey: "Dist", header: "District", filterVariant: "select" },
//     { accessorKey: "Block", header: "Block", filterVariant: "select" },
//     {
//       accessorKey: "cluster_name",
//       header: "Cluster Name",
//       filterVariant: "select",
//     },
//     { accessorKey: "cac_mobile", header: "Mobile" },
//     {
//       accessorKey: "visitSchoolCount",
//       header: "Total School Visit",
//       Cell: ({ row }) => {
//         const [open, setOpen] = useState(false);
//         const { visitSchoolCount, visitClass } = row.original;
        
//         return (
//           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
//             <Typography variant="body2" sx={{ marginRight: 2 }}>
//               {visitSchoolCount}
//             </Typography>
//             <IconButton
//               aria-label="expand row"
//               size="small"
//               onClick={() => setOpen(!open)}
//             >
//               {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//             </IconButton>
//           </div>
//         );
//       },
//     },
//   ];

//   const renderDetailPanel = ({ row }) => {
//     return <CacVisitDetails visitClass={row.original.visitClass} />;
//   };

//   return (
//     <>
//       <Grid container>
//         <Grid item xs={12}>
//           <Header title={"CAC LIST"} />
//         </Grid>
//         <Grid item xs={12} sx={{ marginTop: "20px", padding: " 0 20px" }}>
//           <Card sx={{ boxShadow: "none" }}>
//             <CardContent>
//               <DropDown filterData={onFilterUpdate} isDate={true} filter={filter} />
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sx={{ marginTop: "20px", padding: " 0 20px" }}>
//           <Card sx={{ boxShadow: "none" }}>
//             <CardContent>
//               <TableMaterialGet
//                 URL={`${process.env.REACT_APP_URL}/v1/dashboard/cac-list`}
//                 table_name={"CAC LIST"}
//                 apiBody={"data"}
//                 body={filter}
//                 apiCount={"totalCount"}
//                 column_tab={moduleColumn()}
//                 renderDetailPanel={renderDetailPanel}
//               />
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </>
//   );
// };

// export default CacListPage;

import React, { useState } from "react";
import DropDown from "../Dashboard/DropDown";
import "./CacListPage.css";
import TableMaterialGet from "../../utils/Table/TableMaterialGet";
import { Colors } from "../../utils/Theme/Colors";
import { Container, Card, CardContent, Grid } from "@mui/material";
import Header from "../Header/Header";

// ✅ Main Page Component
const CacListPage = () => {
  const [filter, setFilter] = useState({});

  const onFilterUpdate = (filterObj) => {
    setFilter(filterObj);
  };

  // ✅ Table Columns
  const moduleColumn = () => [
    {
      accessorKey: "c_name",
      header: "Name",
      filterVariant: "select",
    },
    { accessorKey: "Dist", header: "District", filterVariant: "select" },
    { accessorKey: "Block", header: "Block", filterVariant: "select" },
    {
      accessorKey: "cluster_name",
      header: "Cluster Name",
      filterVariant: "select",
    },
    { accessorKey: "cac_mobile", header: "Mobile" },
    {
      accessorKey: "visitSchoolCount",
      header: "Total School Visit",
    },
    {
      accessorKey: "class_1",
      header: "Class 1",
      Cell: ({ row }) => row.original.visitClass?.class_1 ?? 0,
    },
    {
      accessorKey: "class_2",
      header: "Class 2",
      Cell: ({ row }) => row.original.visitClass?.class_2 ?? 0,
    },
    {
      accessorKey: "class_3",
      header: "Class 3",
      Cell: ({ row }) => row.original.visitClass?.class_3 ?? 0,
    },
    {
      accessorKey: "class_4",
      header: "Class 4",
      Cell: ({ row }) => row.original.visitClass?.class_4 ?? 0,
    },
    {
      accessorKey: "class_5",
      header: "Class 5",
      Cell: ({ row }) => row.original.visitClass?.class_5 ?? 0,
    },
  ];

  return (
    <>
      <Grid container sx={{ marginLeft: "60px" }}>
  <Grid item xs={12}>
    <Header title={"CAC LIST"} />
  </Grid>

  {/* Filter */}
  <Grid item xs={12} sx={{ marginTop: "20px"}}>
    <Card sx={{ boxShadow: "none" }}>
      <CardContent>
        <DropDown filterData={onFilterUpdate} isDate={true} filter={filter} />
      </CardContent>
    </Card>
  </Grid>

  {/* Table */} 
  <Grid item xs={12} sx={{ marginTop: "20px"}}>
    <Card sx={{ boxShadow: "none" }}>
      <CardContent>
        <TableMaterialGet
          URL={`${process.env.REACT_APP_URL}/v1/dashboard/cac-list`}
          table_name={"CAC LIST"}
          apiBody={"data"}
          body={filter}
          apiCount={"totalCount"}
          column_tab={moduleColumn()}
        />
      </CardContent>
    </Card>
  </Grid>
</Grid>
    </>
  );
};

export default CacListPage;

