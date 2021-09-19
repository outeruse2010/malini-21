import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import ModalHeader from '../utils/ModalHeader';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import {TextField, Button}  from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import {useRecoilState, useRecoilValue} from 'recoil';

import {expense_type_atom,fetch_expense_types, expense_atom, act_expense_atom, fetch_daily_expenses, add_update_daily_expense} from './sale_expense_api';

import SnakbarComp, {message_atom} from '../utils/SnakbarComp';

import {login_atom} from '../login/login_api';

import AutoCompleteComp from '../utils/AutoCompleteComp';
import ExpenseTypeEntry from './expense_type_entry';

import moment from 'moment';


const DailyExpenseEntry = ({selected_expense, openExpenseModal, toggleExpenseModal}) => {
    const classes = useStyles();
    const login_data = useRecoilValue(login_atom);
    const user_name = login_data.user_name;
    const action = selected_expense ? 'Update' : 'Add New';

    const [expense_amt, setExpense_amt] = useState('');
    const [expense_name, setExpense_name] = useState('');
    const [expense_type_id, setExpense_type_id] = useState('');
    const today = moment().format('YYYY-MM-DD');
    const [expense_date, setExpense_date] = useState(today);
    const [comments, setComments] = useState('');

    const [expAmtErr, setExpAmtErr] = useState(false);
    const [expBtnColor, setExpBtnColor] = useState("primary");

    const [expense_arr, setExpense_arr] = useState([]);

    const [expenseDateErr, setExpenseDateErr] = useState(false);

    const [expense_res, setAct_expense_res] = useRecoilState(act_expense_atom);
    const [expense_list, setExpense_list] = useRecoilState(expense_atom);
    const [expense_type_list, setExpense_type_list] = useRecoilState(expense_type_atom);
    const [act_message, setAct_message] = useRecoilState(message_atom);

    const [openExpenseTypeModal, setOpenExpenseTypeModal] = useState(false);

    let expense_types = useRecoilValue(expense_type_atom);

    useEffect(()=>{
        if(expense_types.length == 0){
            const exp_type_res = fetch_expense_types();
            exp_type_res.then(exps => setExpense_type_list(exps));
        }}, []);

    
    useEffect(()=> {
        onReset(); 
        if(selected_expense){
            setExpense_amt(selected_expense.expense_amt);
            setExpense_type_id(selected_expense.expense_type_id);
            let dt = selected_expense['expense_date'];
            if(dt){
                let val = moment(dt).format('YYYY-MM-DD');
                setExpense_date(val);
            }
            setExpense_name(selected_expense.expense_name);
            setComments(selected_expense.comments);
            setExpense_arr([]);
            setExpBtnColor("primary");
            setExpAmtErr(false);
        }
    }, [openExpenseModal]);

    const onReset = () => {
        setExpense_amt('');
        setExpense_name('');
        setExpense_type_id('');
        setExpense_date(today);
        setComments('');
        setExpense_arr([]);
        setExpBtnColor("primary");
        setExpAmtErr(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if(!expense_date){
            setExpenseDateErr(true);
            return;
        }
        
        let input = {'expense_date':expense_date, 'comments':comments};
        const do_update = (action === 'Update');
        if(do_update) {
            input['expense_type_id'] =  expense_type_id;
            input['expense_amt'] =  expense_amt || 0;
            input['updated_by'] = user_name; input['expense_id']= selected_expense['expense_id'];
        }else{
            input['expense_arr'] = expense_arr;
            input['created_by'] = user_name; 
        }

        if(!do_update && expense_amt){
            setExpBtnColor("secondary");
            return;
        }

        if((expense_type_id && !expense_amt)  || (!do_update &&  expense_arr.length === 0) ){
            setExpAmtErr(true);
            return;
        }

        const res = add_update_daily_expense(input);
        res.then(data => {
            setAct_expense_res(data);
            if(data.status === 'success'){
                const exp_res = fetch_daily_expenses();
                exp_res.then(se => setExpense_list(se));
            }            
            setAct_message(data);
            toggleExpenseModal();
        });
    }

    const onExpenseTypeChange = (Selected_exp_type_id) => setExpense_type_id(Selected_exp_type_id);
    const toggleExpenseTypeModal = () => setOpenExpenseTypeModal(!openExpenseTypeModal);

    const delete_exp_row = (exp_row) =>{
        let exprow_arr = expense_arr.filter(e => (( exp_row['expense_type_id']  !==  e['expense_type_id'])  && ( exp_row['expense_amt']  !==  e['expense_amt']) ) );
        //console.log('exprow_arr: ', exprow_arr.length);
        setExpense_arr(exprow_arr);
    };

    const addExpenseRow = () => {
        let ex_arr = expense_arr;
        let er = {'expense_type_id': expense_type_id, 'expense_amt':expense_amt};
        ex_arr.push(er);
        setExpense_arr(ex_arr);
        setExpense_amt('');
        setExpense_type_id('');
        setExpBtnColor("primary");
    };

    
const expense_table = (expense_arr) => {

    const expense_nm = (exp_id) => {
        let exprow = expense_types.filter(r => (exp_id === r['expense_type_id']) );
        return exprow[0]['expense_name'];
    }

    const total_exp = (expense_arr) => {
        let total = 0;
        expense_arr.map(e => {total = total + Number( e['expense_amt'] ) ; });
        return total;
    }

    return (
        <Table size="small" className={classes.exp_table}>
            <TableHead>
                <TableRow>
                    <TableCell align='left' className={classes.exp_total}>Expense Type</TableCell>
                    <TableCell align="left" colSpan={2} className={classes.exp_total}>Amount</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {expense_arr.map((row, i) => (
                        <TableRow key={i} >
                            <TableCell align='left' className={classes.exp_cell}>{expense_nm(row['expense_type_id'])}</TableCell>
                            <TableCell align="left"  className={classes.exp_cell}>{row['expense_amt']}</TableCell>
                            <TableCell className={classes.exp_cell}>
                                    <IconButton color="secondary" aria-label="delete" onClick={e=>delete_exp_row(row)} size='small'>
                                        <DeleteIcon size='small'/>
                                    </IconButton>
                            </TableCell>
                        </TableRow> )
                )}
                <TableRow key='total_row' >
                            <TableCell className={classes.exp_total} align='right'>Total : </TableCell>
                            <TableCell className={classes.exp_total}  align="left" colSpan={2}>{total_exp(expense_arr)}</TableCell>
                        </TableRow>
            </TableBody>
      </Table>
    );
};

    return (
        <Modal open={openExpenseModal} onClose={toggleExpenseModal} 
                size='small'
                className={classes.modal}
                BackdropComponent={Backdrop}>
                <Fade in={openExpenseModal}>
                    <div className={classes.paper}>
                        <ModalHeader header={action + ' Sale/Expense'} toggleModal={toggleExpenseModal}/>

                        <form onSubmit={onSubmit} onReset={onReset} noValidate autoComplete="off">
                            <TextField type="date" value={expense_date} onChange={(e) => setExpense_date(e.target.value)} 
                                    required error={expenseDateErr} label="Sale/Expense Date (dd/mm/yyyy)" variant="outlined" className={classes.field} fullWidth  InputLabelProps={{ shrink: true, }} size="small"/>   
                           
                            <Grid container spacing={1}>
                                <Grid item xs={10}>
                                    <AutoCompleteComp label='Expense Name' value_list={expense_types} label_field={'expense_name'} value_field={'expense_type_id'} value={expense_type_id} onComboValueChange = {onExpenseTypeChange}/>
                                </Grid>
                                <Grid item xs={2}>
                                    <Button onClick={toggleExpenseTypeModal} color="primary" size='small' className={classes.exp_btn} startIcon={<AddIcon />}>Add New Expense</Button>
                                </Grid>
                            </Grid>
                           
                            <Grid container spacing={1}>
                                <Grid item xs={(action === 'Add New') ? 10 : 12}>
                                    <TextField type='number' disabled={!expense_type_id} value={expense_amt} onChange={e=>{setExpense_amt(e.target.value); setExpAmtErr('');}} label="Expend  Amount" error={(expAmtErr)} fullWidth variant="outlined" className={classes.field} size="small"/>
                                </Grid>
                                {(action === 'Add New') && <Grid item xs={2}>
                                    <Button disabled={!expense_amt} onClick={addExpenseRow} color={expBtnColor} size='small' className={classes.exp_btn} startIcon={<AddIcon />} startIcon={<AddIcon/>}>Expense</Button>
                                </Grid>}
                            </Grid>

                            {(action === 'Add New')  && expense_arr.length>0 &&  expense_table(expense_arr)}

                            <TextField value={comments} onChange={e=>setComments(e.target.value)} label="Comments" fullWidth variant="outlined" className={classes.field} multiline rows={2} size="small"/>
                            
                            <Button type="submit"   variant="contained" color="primary" size="small">{action}</Button>
                            {(action === 'Add New') && <Button type="reset" variant="contained" size="small" className={classes.btn}>Reset</Button>}
                            {(action === 'Update') && <Button onClick={toggleExpenseModal} variant="contained" size="small" className={classes.btn}>Cancel</Button>}
                        </form>
                        <ExpenseTypeEntry openExpenseTypeModal={openExpenseTypeModal} toggleExpenseTypeModal={toggleExpenseTypeModal} />
                        <SnakbarComp />
                    </div>
                </Fade>
            </Modal>
    );
};

export default DailyExpenseEntry;



const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow:'scroll',
      marginTop: 10,
      marginBottom: 5
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3)
    },
    field:{
        marginBottom: theme.spacing(2)
    },
    btn: {marginLeft: theme.spacing(1)},
    exp_btn: {marginBottom: theme.spacing(1)},

    exp_table: {marginBottom: theme.spacing(2) },
    exp_cell: {paddingTop: '0px' , paddingBottom: '0px'},
    exp_total: {color: '#b0bec5', fontWeight:'bold' },
    
  }));


