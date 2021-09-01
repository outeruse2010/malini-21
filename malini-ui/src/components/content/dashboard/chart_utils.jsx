import React, {useState, useEffect, useMemo} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import {AreaChart, Area, LineChart, Line,BarChart, Bar,PieChart, Pie, Sector, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, ResponsiveContainer } from 'recharts';
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
const chart_margin = {top:30, right: 10, left: 10, bottom: 5 };

const blue_color = "#1a237e";
const red_color = "#d32f2f";
const axis_font = {  fontSize: '0.8rem',   fontFamily: 'Times New Roman'}

export const CustomLineChart = ({ title, data, yfield1, ylabel1, yfield2, ylabel2, xfield}) => {
  const classes = useStyles();
  return (
          <Card variant="outlined">
              <Typography className={classes.title} color={blue_color}> {title} </Typography>
              <LineChart data={data}  margin={chart_margin} width={chart_width}  height={chart_height}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={xfield} style={axis_font}/>
                  <YAxis yAxisId="right"  label={label(ylabel1, 'insideLeft')}  stroke={blue_color} style={axis_font}/>
                  <YAxis yAxisId="left" orientation="right"  label={label(ylabel2, 'insideRight')} stroke={red_color} style={axis_font}/>
                  <Tooltip />
                  <Line yAxisId="right" type="monotone"  dataKey={yfield1} stroke={blue_color} activeDot={{ r: 6 }}  />
                  <Line yAxisId="left" type="monotone" dataKey={yfield2} stroke={red_color} activeDot={{ r: 6 }}  />
              </LineChart>
        </Card>
      );
};
const label = (name, position, angle = -90) => {
    return {value: name, fontSize:12,  angle, position};
};


export const CustomAreaChart = ({ title, data, yfield1, ylabel1, yfield2, ylabel2, xfield}) => {
  const classes = useStyles();
  return (
    <Card variant="outlined">
    <Typography className={classes.title} color={blue_color}> {title} </Typography>
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
            <Typography className={classes.title} color={blue_color}> {title} </Typography>
                 <BarChart data={data}  margin={chart_margin} width={chart_width}  height={chart_height}>
                          <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey={xfield} style={axis_font}/>
                              <YAxis label={label(ylabel2, 'insideLeft')} yAxisId="left" orientation="left" stroke={blue_color} style={axis_font}/>
                              <YAxis label={label(ylabel3, 'insideRight')} yAxisId="right" orientation="right" stroke={red_color}  style={axis_font}/>
                              <Tooltip />
                              <Bar dataKey={yfield2} yAxisId="left"  fill={blue_color}  background={{ fill: '#eee' }}>
                                  <LabelList dataKey={barLabel1} content={customBarLabel} />
                              </Bar>
                              <Bar dataKey={yfield3} yAxisId="right" fill={red_color}  />
                      </BarChart>
        </Card>
      );
};

export const CustomBarChart = ({title,data,  yfield2, ylabel2,  yfield3, ylabel3,  xfield}) => {
  const classes = useStyles();
  return (
    <Card variant="outlined">
            <Typography className={classes.title} color={blue_color}> {title} </Typography>
             <BarChart data={data}  margin={chart_margin}  width={chart_width}  height={chart_height}>
                      <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey={xfield} style={axis_font}/>
                          <YAxis label={label(ylabel2, 'insideLeft')} yAxisId="left" orientation="left" stroke={blue_color} style={axis_font} />
                          <YAxis label={label(ylabel3, 'insideRight')} yAxisId="right" orientation="right" stroke={red_color}  style={axis_font} />
                          <Tooltip />
                          <Bar dataKey={yfield2} yAxisId="left"  fill={blue_color}  background={{ fill: '#eee' }}/>
                          <Bar dataKey={yfield3} yAxisId="right" fill={red_color}  />
                  </BarChart>
     </Card>
      );
};

const customBarLabel = (props) => {
    const { x, y, width, height, value } = props;
    const radius = 13;  
    return (
      <g>
        <circle cx={x + width / 2} cy={y - radius} r={radius} fill="#1b5e20" />
        <text x={x + width / 2} y={y - radius} fill="#fff" textAnchor="middle" dominantBaseline="middle" fontSize={10}>
          {value}
        </text>
      </g>
    );
  };
  
  /********************* CustomActiveShapePieChart  *******************/


 export  const CustomShapePieChart = ({title,data,  yfield1, ylabel1, yfield2, ylabel2,  yfield3, ylabel3, xfield}) =>{

      const classes = useStyles();

      const [activeIndex, setActiveIndex] = useState(0);
      const onPieEnter = (_, index) => setActiveIndex(index);

       const renderActiveShape = (props) => {
            const RADIAN = Math.PI / 180;
            const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
            const sin = Math.sin(-RADIAN * midAngle);
            const cos = Math.cos(-RADIAN * midAngle);
            const sx = cx + (outerRadius + 10) * cos;
            const sy = cy + (outerRadius + 10) * sin;
            const mx = cx + (outerRadius + 30) * cos;
            const my = cy + (outerRadius + 30) * sin;
            const ex = mx + (cos >= 0 ? 1 : -1) * 22;
            const ey = my;
            const textAnchor = cos >= 0 ? 'start' : 'end';
                        
              return (
                <g>
                  <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                    {payload[xfield]}
                  </text>

                  <Sector cx={cx}  cy={cy}  innerRadius={innerRadius}  outerRadius={outerRadius}  startAngle={startAngle}  endAngle={endAngle}
                    fill={fill} />
                  <Sector cx={cx}  cy={cy}  startAngle={startAngle} endAngle={endAngle}  innerRadius={outerRadius + 6}  outerRadius={outerRadius + 10}
                    fill={fill} />

                  <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                  <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />

                  <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#1a237e" fontSize={10}>{`${ylabel1}: ${value}`}</text>
                  <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={11} textAnchor={textAnchor} fill="#b71c1c" fontSize={10}>
                    {`${ylabel2}:  ${payload[yfield2]}, ${ylabel3}:  ${payload[yfield3]}`}
                  </text>
                </g>
        );
      };

      return (
          <Card variant="outlined">
                <Typography className={classes.title} color={blue_color}> {title} </Typography>
                <PieChart width={chart_width} height={chart_height}>
                          <Pie activeIndex={activeIndex}
                              activeShape={renderActiveShape}
                              cx="50%"  cy="50%"  innerRadius={60}   outerRadius={80}   fill={blue_color}
                              data={data}  dataKey={yfield1}                              
                              onMouseEnter={onPieEnter}  />
                </PieChart>
        </Card>
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


