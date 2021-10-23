import React from 'react';
import { makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const ChartDataTable = ({columns, rows}) => {
    const classes = useStyles();
    return (
        <TableContainer  component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
              {
                  columns.map((h,i)=> <TableCell key={i} >{h['name']}</TableCell>)
              }            
          </TableRow>
        </TableHead>
        <TableBody>
          {(rows.length > 0) && rows.map((row, ri) => (
            <TableRow key={ri}>
               {
                  columns.map((c,ci)=> {
                      let field = c['field'];
                      return  <TableCell key={ci} >{row[field]}</TableCell>;
                  })
              }  
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    )
}

export default ChartDataTable;

const useStyles = makeStyles({
    table: {
      width: '100%',
    },
  });
