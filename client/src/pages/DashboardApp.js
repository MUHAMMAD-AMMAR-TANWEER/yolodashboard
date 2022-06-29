import { React, useEffect, useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { getCookie } from 'react-use-cookie';
import 'react-datepicker/dist/react-datepicker.css';

import { faker } from '@faker-js/faker';
import { useFormik, Form, FormikProvider } from 'formik';

// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Button, TextField } from '@mui/material';
import { DatePicker } from '@mui/lab';

// components
import CsvDownloader from 'react-csv-downloader';
import Page from '../components/Page';
import Iconify from '../components/Iconify';

// import react-csv from 'react-csv';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [csv, setcsvData] = useState([false, []]);
  const [Data, setData] = useState([]);
  const [add, setAdd] = useState('');
  const xsrfToken = getCookie('token');
  const decJson = JSON.parse(xsrfToken);
  const userDevice = decJson.Device;
  console.log(decJson, 'Cookie');
  useEffect(() => {
    console.log(startDate, endDate, 'HEllo World');
  }, [startDate, endDate]);
  const theme = useTheme();
  // const dateValue: Date = new Date(new Date().getFullYear(), new Date().getMonth(),14); s

  const csvdataHandler = async () => {
    let settingStartDate = startDate.split('/');
    settingStartDate = `${settingStartDate[2]}-${settingStartDate[0]}-${settingStartDate[1]}`;
    let settingEndDate = endDate.split('/');
    console.log(settingStartDate, 'adbiuahciuaghiuc ');
    settingEndDate = `${settingEndDate[2]}-${settingEndDate[0]}-${settingEndDate[1]}`;
    console.log(settingEndDate, '&&&&&&&');

    const { data } = await axios.get(
      `https://dashboard.advergeanalytics.com:5000/gtimfeed/${userDevice}/${settingStartDate}/${settingEndDate}`
    );
    console.log(data, 'faizannnnnnnnnnnnn');
    return data.message;
  };
  const imgurl = `https://adverge.nyc3.digitaloceanspaces.com/adverge/${userDevice}.jpg`;
  const urlimgfeed = `https://dashboard.advergeanalytics.com:5000/imgfeed/${userDevice}`;
  // useEffect(() => {
  //   const axiosPostt = async () => {
  //     const response = await axios.get(`${urlimgfeed}`);

  //     console.log(response.data.message.Tim, 'Ammar');
  //     setAdd(response.data.message.Tim);
  //   };
  //   axiosPostt();
  // }, []);
  // console.log(add, 'ada;kdcaiopcjiaohoiu');

  const url = `https://dashboard.advergeanalytics.com:5000/gfeed?Device=${userDevice}`;
  useEffect(() => {
    const axiosPost = async () => {
      const response = await axios.get(`${url}`);
      const res1 = await axios.get(`${urlimgfeed}`);
      setData(response.data);
      setAdd(res1.data.message.Tim);

      console.log(response.data, 'FAizan');
    };
    axiosPost();
  }, []);
  console.log(add, 'ada;kdcaiopcjiaohoiu');
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Device ID: {userDevice}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => {
                setStartDate(newValue.toLocaleDateString('en', { year: 'numeric', month: '2-digit', day: 'numeric' }));
              }}
              renderInput={(params) => <TextField style={{ margin: '1rem' }} {...params} />}
            />

            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => {
                setEndDate(newValue.toLocaleDateString('en', { year: 'numeric', month: '2-digit', day: 'numeric' }));
              }}
              renderInput={(params) => <TextField style={{ margin: '1rem' }} {...params} />}
            />

            {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
            label="Basic example"
            value={value}
            onChange={(newValue) => {
                setValue(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider> */}

            <Button
              style={{ maxWidth: '150px', maxHeight: '100px', minWidth: '50px', minHeight: '30px', margin: '2rem' }}
              variant="contained"
            >
              <CsvDownloader
                filename="Data"
                extension=".csv"
                // separator=";"
                // wrapColumnChar="'"
                // columns={columns}
                datas={csvdataHandler}
                // text="DOWNLOAD"
              >
                Download Csv
              </CsvDownloader>
            </Button>

            {/* <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/static/mock-images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            /> */}
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Daily Impressions"
              // subheader="(+43%) than last year"
              chartLabels={Data.Labels ? Data.Labels : null} // {Data.Labels?Data.Labels:null}
              chartData={[
                {
                  name: 'Cars',
                  type: 'column',
                  fill: 'solid',
                  data: Data?.Cars,
                },
                {
                  name: 'Bicycles',
                  type: 'column',
                  fill: 'solid',
                  data: Data?.Bicycles,
                },
                {
                  name: 'Buses',
                  type: 'column',
                  fill: 'solid',
                  data: Data?.Buses,
                },
                {
                  name: 'Trucks',
                  type: 'column',
                  fill: 'solid',
                  data: Data?.Trucks,
                },
                {
                  name: 'Person',
                  type: 'column',
                  fill: 'solid',
                  data: Data?.Person,
                },
                {
                  name: 'Motorcycles',
                  type: 'column',
                  fill: 'solid',
                  data: Data?.Motorcycles,
                },
              ]}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Typography variant="h6" sx={{ mb: 5 }}>
              Uploaded Date: {add}
            </Typography>
            <img src={imgurl} alt="new" />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Total Impressions"
              // subheader="(+43%) than last year"
              chartData={[
                { label: 'Cars', value: Data?.Cars?.reduce((a, b) => a + b, 0) },
                { label: 'Bicycles', value: Data?.Bicycles?.reduce((a, b) => a + b, 0) },
                { label: 'Buses', value: Data?.Buses?.reduce((a, b) => a + b, 0) },
                { label: 'Trucks', value: Data?.Trucks?.reduce((a, b) => a + b, 0) },
                { label: 'Person', value: Data?.Person?.reduce((a, b) => a + b, 0) },
                { label: 'Motorcycles', value: Data?.Motorcycles?.reduce((a, b) => a + b, 0) },
              ]}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Percentages"
              chartData={[
                { label: 'Cars', value: Data?.Cars?.reduce((a, b) => a + b, 0) },
                { label: 'Bicycles', value: Data?.Bicycles?.reduce((a, b) => a + b, 0) },
                { label: 'Buses', value: Data?.Buses?.reduce((a, b) => a + b, 0) },
                { label: 'Trucks', value: Data?.Trucks?.reduce((a, b) => a + b, 0) },
                { label: 'Person', value: Data?.Person?.reduce((a, b) => a + b, 0) },
                { label: 'Motorcycles', value: Data?.Motorcycles?.reduce((a, b) => a + b, 0) },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.chart.blue[0],
                theme.palette.chart.violet[0],
                theme.palette.chart.yellow[0],
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <AppWidgetSummary
              title="Cars"
              total={Data?.Cars?.reduce((a, b) => a + b, 0)}
              icon={'ant-design:car-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <AppWidgetSummary
              title="Bicycles"
              total={Data?.Bicycles?.reduce((a, b) => a + b, 0)}
              color="info"
              icon={'ant-design:car-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <AppWidgetSummary
              title="Buses"
              total={Data?.Buses?.reduce((a, b) => a + b, 0)}
              color="warning"
              icon={'ant-design:car-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <AppWidgetSummary
              title="Trucks"
              total={Data?.Trucks?.reduce((a, b) => a + b, 0)}
              color="info"
              icon={'ant-design:car-filled'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <AppWidgetSummary
              title="Person"
              total={Data?.Person?.reduce((a, b) => a + b, 0)}
              color="error"
              icon={'ant-design:car-filled'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <AppWidgetSummary
              title="Motorcycles"
              total={Data?.Motorcycles?.reduce((a, b) => a + b, 0)}
              color="error"
              icon={'ant-design:car-filled'}
            />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['Cars', 'Bicycles', 'Buses', 'Trucks', 'Person', 'Motorcycles']}
              chartData={[
                { name: 'Cars', data: Data?.Cars },
                { name: 'Bicycles', data: Data?.Bicycles },
                { name: 'Buses', data: Data?.Buses },
                { name: 'Trucks', data: Data?.Trucks },
                { name: 'Person', data: Data?.Person },
                { name: 'Motorcycles', data: Data?.Motorcycles },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} height={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} height={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} height={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} height={32} />,
                },
              ]}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
