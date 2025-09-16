import { Box, Card, CardContent, Grid } from '@mui/material'
import React from 'react'
import HorizontalBarChart from '../../utils/Charts/HorizontalBarChart'
import { Colors } from '../../utils/Theme/Colors'
import DoughnutChart from '../../utils/Charts/DoughnutChart'

const ChartOne = ({data}) => {
  console.log(data)
  return (
                  <Box
                    sx={{
                      backgroundColor:'#fff',
                      borderRadius: "8px",
                      padding: "10px",
                    }}
                    elevation={0}
                  >
                        <HorizontalBarChart
                          title={""}
                          subtitle={data?.questionText}
                          width={"45%"}
                          chartData={data?.chartData ? data?.chartData : []}
                          lable={"Data"}
                        />
                    
                  </Box>)
}

export default ChartOne