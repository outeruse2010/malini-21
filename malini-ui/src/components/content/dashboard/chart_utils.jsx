import React, {useState, useEffect, useMemo} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Grid from '@material-ui/core/Grid';

export const CustomLineChart = ({data, yfield1, ylabel1, yfield2, ylabel2, xfield}) => {
    return (
        <ResponsiveContainer >
                <LineChart data={data}  margin={{top: 15, right: 5, left: 5, bottom: 5 }}  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={xfield}/>
                    <YAxis yAxisId="right"  label={label(ylabel1, 'insideLeft')}  />
                    <YAxis yAxisId="left" orientation="right"  label={label(ylabel2, 'insideRight')}/>
                    <Tooltip />
                    <Line yAxisId="right" type="monotone"  dataKey={yfield1} stroke="#8884d8" activeDot={{ r: 6 }}  />
                    <Line yAxisId="left" type="monotone" dataKey={yfield2} stroke="#82ca9d"  />
                </LineChart>
        </ResponsiveContainer>
    );
};

const label = (name, position, angle = -90) => {
    return {value: name, angle, position};
};

export const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    grid_row: {
        height: '40vh',
    },
  }));


