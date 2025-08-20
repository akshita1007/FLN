import { Card, CardContent, Grid } from '@mui/material'
import React from 'react'
import HorizontalBarChart from '../../utils/Charts/HorizontalBarChart'
import { Colors } from '../../utils/Theme/Colors'
import DoughnutChart from '../../utils/Charts/DoughnutChart'

const ChartThree = ({data}) => {
  return (
    <Grid item xs={12} md={6} >
    <Card
      sx={{
        backgroundColor: Colors.primary.Extra,
        borderRadius: "8px",
        padding: "10px",
      }}
      elevation={0}
    >
      <CardContent>
          <DoughnutChart
            title={""}
            subtitle={data?.questionText}
            width={"45%"}
            chartData={data?.chartData ? data?.chartData : []}
            lable={"Data"}
            size="small"
          />
      
      </CardContent>
    </Card>
  </Grid>
  )
}

export default ChartThree