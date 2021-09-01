import React, {useState, useEffect, useMemo} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {AreaChart, Area, LineChart, Line,BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, ResponsiveContainer } from 'recharts';
import { DataGrid } from '@material-ui/data-grid';

export const DasboardDataGrid = ({rows, columns, title}) =>{
  const classes = useStyles();
  return (
        <div style={{ width: '100%'}}>
           <Typography className={classes.title} color="textPrimary"> {title} </Typography>
            <DataGrid rows={rows} columns={columns} autoHeight={true} hideFooterPagination={true} disableSelectionOnClick rowsPerPageOptions={[]} rowHeight={20} headerHeight={22}/>
        </div>
  );
}


const chart_width = 350;
const chart_height = 250;
const chart_margin = {top: 15, right: 10, left: 10, bottom: 5 };

const red_color = "#b39ddb";
const blue_color = "#f48fb1";

export const CustomLineChart = ({ title, data, yfield1, ylabel1, yfield2, ylabel2, xfield}) => {
  const classes = useStyles();
  return (
          <Card variant="outlined">
              <Typography className={classes.title} color="textPrimary"> {title} </Typography>
              <LineChart data={data}  margin={chart_margin} width={chart_width}  height={chart_height}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={xfield} />
                  <YAxis yAxisId="right"  label={label(ylabel1, 'insideLeft')}  stroke={red_color}/>
                  <YAxis yAxisId="left" orientation="right"  label={label(ylabel2, 'insideRight')} stroke={blue_color}/>
                  <Tooltip />
                  <Line yAxisId="right" type="monotone"  dataKey={yfield1} stroke={red_color} activeDot={{ r: 6 }}  />
                  <Line yAxisId="left" type="monotone" dataKey={yfield2} stroke={blue_color} activeDot={{ r: 6 }}  />
              </LineChart>
        </Card>
      );
};
const label = (name, position, angle = -90) => {
    return {value: name, angle, position};
};


export const CustomAreaChart = ({ title, data, yfield1, ylabel1, yfield2, ylabel2, xfield}) => {
  const classes = useStyles();
  return (
    <Card variant="outlined">
    <Typography className={classes.title} color="textPrimary"> {title} </Typography>
    <AreaChart width={chart_width} height={chart_height} data={data}
    margin={chart_margin}>
    <defs>
      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
      </linearGradient>
      <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
      </linearGradient>
    </defs>
    <XAxis dataKey={xfield} />
    <YAxis />
    <CartesianGrid strokeDasharray="3 3" />
    <Tooltip />
    <Area type="monotone" dataKey={yfield1} stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
    <Area type="monotone" dataKey={yfield2} stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
  </AreaChart>
  </Card>
  );
}



export const CustomMixBarChart = ({title, data, barLabel1, yfield2, ylabel2,  yfield3, ylabel3,  xfield}) => {
  const classes = useStyles();
      return (
        <Card variant="outlined">
            <Typography className={classes.title} color="textPrimary"> {title} </Typography>
                 <BarChart data={data}  margin={chart_margin} width={chart_width}  height={chart_height}>
                          <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey={xfield} />
                              <YAxis label={label(ylabel2, 'insideLeft')} yAxisId="left" orientation="left" stroke={red_color} />
                              <YAxis label={label(ylabel3, 'insideRight')} yAxisId="right" orientation="right" stroke={blue_color}  />
                              <Tooltip />
                              <Bar dataKey={yfield2} yAxisId="left"  fill={red_color}  background={{ fill: '#eee' }}>
                                  <LabelList dataKey={barLabel1} content={customBarLabel} />
                              </Bar>
                              <Bar dataKey={yfield3} yAxisId="right" fill={blue_color}  />
                      </BarChart>
        </Card>
      );
};

export const CustomBarChart = ({title,data,  yfield2, ylabel2,  yfield3, ylabel3,  xfield}) => {
  const classes = useStyles();
  return (
    <Card variant="outlined">
            <Typography className={classes.title} color="textPrimary"> {title} </Typography>
             <BarChart data={data}  margin={chart_margin}  width={chart_width}  height={chart_height}>
                      <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey={xfield} />
                          <YAxis label={label(ylabel2, 'insideLeft')} yAxisId="left" orientation="left" stroke={red_color} />
                          <YAxis label={label(ylabel3, 'insideRight')} yAxisId="right" orientation="right" stroke={blue_color}  />
                          <Tooltip />
                          <Bar dataKey={yfield2} yAxisId="left"  fill={red_color}  background={{ fill: '#eee' }}/>
                          <Bar dataKey={yfield3} yAxisId="right" fill={blue_color}  />
                  </BarChart>
     </Card>
      );
};

const customBarLabel = (props) => {
    const { x, y, width, height, value } = props;
    const radius = 15;  
    return (
      <g>
        <circle cx={x + width / 2} cy={y - radius} r={radius} fill="#69f0ae" />
        <text x={x + width / 2} y={y - radius} fill="#546e7a" textAnchor="middle" dominantBaseline="middle">
          {value}
        </text>
      </g>
    );
  };
  

export const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    grid_row: {
        height: '40vh',
    },
    
    title: {
      fontSize: 14,
      textAlign: 'center'
    }
  }));


