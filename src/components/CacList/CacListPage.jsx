import React, { useState } from "react";
import DropDown from "../Dashboard/DropDown";
import "./CacListPage.css";
import TableMaterialGet from "../../utils/Table/TableMaterialGet";
import { Colors } from "../../utils/Theme/Colors";
import { Container, Card, CardContent } from "@mui/material";
import Header from "../Header/Header";
import Grid from "@mui/material/Grid";

const CacListPage = () => {
  const [filter, setFilter] = useState({});

  const onFilterUpdate = (filterObj) => {
    setFilter(filterObj);
  };

  return (
    <>
      <Grid container>
          <Grid item xs={12}>
            <Header title={"CAC LIST"}/>
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "20px", padding: " 0 20px" }}>
            <Card sx={{ boxShadow: "none" }}>
              <CardContent>
                <DropDown filterData={onFilterUpdate} isDate={true} filter={filter} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "20px", padding: " 0 20px"}}>
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
          {/* <Container
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
            <DropDown filterData={onFilterUpdate} filter={filter} />
          </Grid>
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
        </Container> */}
      </Grid>
    </>
  );
};

export default CacListPage;

const moduleColumn = () => [
  { accessorKey: "c_name", header: "Name", filterVariant: "select" },
  { accessorKey: "Dist", header: "District", filterVariant: "select" },
  { accessorKey: "Block", header: "Block", filterVariant: "select" },
  {
    accessorKey: "cluster_name",
    header: "Cluste Name",
    filterVariant: "select",
  },
  { accessorKey: "cac_mobile", header: "Mobile" },
  { accessorKey: "visitSchoolCount", header: "Total School Visit" },
];
