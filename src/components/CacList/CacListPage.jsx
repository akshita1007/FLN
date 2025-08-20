import React, { useState } from "react";
import DropDown from "../Dashboard/DropDown";
import "./CacListPage.css";
import TableMaterialGet from "../../utils/Table/TableMaterialGet";
import { Colors } from "../../utils/Theme/Colors";
import { Container, Card } from "@mui/material";
import Header from "../Header/Header";
import Grid from "@mui/material/Grid";

const CacListPage = () => {
  const [filter, setFilter] = useState({});

  const onFilterUpdate = (filterObj) => {
    setFilter(filterObj);
  };

  return (
    <>
      <Container
        maxWidth={"auto"}
        className="list-page"
        sx={{
          bgcolor: Colors.bg.bg1,
          overflowX: "hidden",
          padding: { xs: 0 },
        }}
      >
        <Grid item xs={12} sx={{ marginBottom: "25px" }}>
          <Header />
        </Grid>
        <Grid item xs={12} sx={{ marginBottom: "25px", padding: " 0 20px" }}>
          <DropDown filterData={onFilterUpdate}  filter={filter}/>
        </Grid>

        {/* <Grid container sx={{ marginTop: "35px" }}> */}
        {/* <Grid
            item
            sx={{
              width: "100%",
              overflowX: "auto",
            }}
          > */}
        <Card
          sx={{
            backgroundColor: Colors.bg.bg2,
            borderRadius: "8px",
            padding: "20px",
          }}
          // elevation={0}
        >
          <TableMaterialGet
            URL={`${process.env.REACT_APP_URL}/v1/dashboard/cac-list`}
            table_name={"CAC LIST"}
            apiBody={"data"}
            body={filter}
            apiCount={"totalCount"}
            column_tab={moduleColumn()}
          />
        </Card>
        {/* </Grid> */}
        {/* </Grid> */}
      </Container>
    </>
  );
};

export default CacListPage;

const moduleColumn = () => [
  { accessorKey: "name", header: "Name", filterVariant: "select" },
  { accessorKey: "districtName", header: "District", filterVariant: "select" },
  { accessorKey: "blockName", header: "Block", filterVariant: "select" },
  {
    accessorKey: "clusterName",
    header: "Cluste Name",
    filterVariant: "select",
  },
  { accessorKey: "phoneNo", header: "Mobile" },
  { accessorKey: "visitSchoolCount", header: "Total School Visit" },
];
