import React, { useEffect, useMemo, useState } from 'react';
import { CardWidget } from '../../utils/Cards/CardWidget';
import { Colors } from '../../utils/Theme/Colors';
import Grid from '@mui/material/Grid';
import { Card, CardContent, Container,Typography } from '@mui/material';
import DropDown from './DropDown';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import BarChart from './BarChart';
import NightangleChart from './NightangleChart';
const Dashboard = () => {
  const {token} = useAuth();
  const [cardCount,setCardCount] = useState({})
  const [countData,setCountData] = useState()
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/v1/dashboard/counts`,{
            headers: {
              'Authorization': `Bearer ${token}`
          },
          }
        );
        if(response.data.success){
        setCardCount(response.data.data?response.data.data:{});
        }
      } catch (error) {
        console.error(error);
      }
    };
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/v1/submit/report-analysis?step=step1`,{
            headers: {
              'Authorization': `Bearer ${token}`
          },
          }
        );
        if(response.data.success){
          setCountData(response.data.data?response.data.data:{});
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCount();
    fetchData();
  }, []);
  const chartDataArray = useMemo(() => 
    countData?.map((question, index) => ({
      questionText: question.questionText,
      chartData: question.option.map((opt, optIndex) => ({
        id: optIndex + 1,
        value: opt.count,
        name: opt.text,
      })),
    })),
    [countData]
  );
  
  return (
    <Container maxWidth={'xl'} className='main-content' sx={{
      display: 'flex',
      flex: '1 1 auto',
      flexDirection: 'column',
      
    }}>
      <Typography variant="h6" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>
      
      <DropDown />
      <Grid container spacing={3} sx={{marginBottom:'15px'}}>
        <Grid item xs={12} sm={6} md={3}>
          <CardWidget
            title="Total Schools"
            // percent={2.6}
            total={cardCount.totalSchool}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-bag.svg" />}
            
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <CardWidget
            title="Total CACs"
            // percent={-0.1}
            total={cardCount.totalCaC}
            color={Colors.secondary}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <CardWidget
            title="Total Survey"
            // percent={2.8}
            total={cardCount.totalSubmission}
            color={Colors.warning}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-buy.svg" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <CardWidget
            title="Total Visted School"
            // percent={3.6}
            total={cardCount.visitSchoolCount}
            color={Colors.error}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-message.svg" />}
            
          />
        </Grid>

        </Grid>
        <Grid container spacing={3}>
        {chartDataArray&&chartDataArray.map((data,index)=>{
          return (data?.chartData).length !== 0?<Grid item xs={12} md={6} key={index}>
          {/* {console.log(chartDataArray)} */}
          <Card>
            <CardContent>
           
              <BarChart 
            title={""}
            subtitle={data?.questionText}
            width={"45%"}
            chartData={data?.chartData ?data?.chartData :[]}
            lable={"Data"}
            loading={isLoading}
            />
            </CardContent>
          </Card>
        </Grid>:<></> })}
        <Grid item xs={12} md={6}>

        </Grid>
        </Grid>
    </Container>
  );
};

export default Dashboard;
