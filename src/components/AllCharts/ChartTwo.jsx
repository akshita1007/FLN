import { Card, CardContent, Grid } from '@mui/material'
import React from 'react'
import HorizontalBarChart from '../../utils/Charts/HorizontalBarChart'
import { Colors } from '../../utils/Theme/Colors'
import DoughnutChart from '../../utils/Charts/DoughnutChart'
import PieChart from '../../utils/Charts/PieChart'

const ChartTwo = ({data}) => {
  return (
    <Grid item xs={12} md={3} >
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
                          size={"smaller"}
                        />
                    
                    </CardContent>
                  </Card>
                </Grid>
  )
}

export default ChartTwo