import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

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
