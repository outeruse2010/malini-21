import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import ModalHeader from '../utils/ModalHeader';

import {TextField, Button}  from '@material-ui/core';

import {useRecoilState} from 'recoil';

import {expense_type_atom,act_expense_type_atom, new_expense_type, fetch_expense_types} from './sale_expense_api';

import SnakbarComp, {message_atom} from '../utils/SnakbarComp';

import {login_atom} from '../login/login_api';
import {useRecoilValue} from 'recoil';

const ExpenseTypeEntry = ({selected_expense_type, openExpenseTypeModal, toggleExpenseTypeModal}) => {
    const classes = useStyles();
    const login_data = useRecoilValue(login_atom);
    const user_name = login_data.user_name;

    const action = selected_expense_type ? 'Update' : 'Add New';

    const [exp_type, setExp_type] = useState('');
    const [expense_name, setExpense_name] = useState('');
    const [comments, setComments] = useState('');
    const [expenseNameErr, setExpenseNameErr] = useState(false);
    const [expTypeErr, setExpTypeErr] = useState(false);
    const [act_expense_type_res, setAct_expense_type_res] = useRecoilState(act_expense_type_atom);
    const [expense_type_list, setExpense_type_list] = useRecoilState(expense_type_atom);
    const [act_message, setAct_message] = useRecoilState(message_atom);

    useEffect(()=> {
        onReset(); 
        if(selected_expense_type){
            setExpense_name(selected_expense_type.expense_name);
            setComments(selected_expense_type.comments);
        }
    }, [openExpenseTypeModal]);


    
    const onReset = () => {
        setExpense_name('');
        setExp_type('');
        setComments('');
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if(!expense_name){
            setExpenseNameErr(true);
            return;
        }
        if(!exp_type){
            setExp_type(true);
            return;
        }
        
        let input = {exp_type,expense_name, comments};
        const do_update = (action === 'Update');
        if(do_update) {
            input = {exp_type,expense_name, comments, 'updated_by': user_name, 'expense_type_id': selected_expense_type['expense_type_id']};
        }else{
            input['created_by'] = user_name; 
        }

        const res = new_expense_type(input);
        res.then(data => {
            setAct_expense_type_res(data);
            if(data.status === 'success'){
                const exp_type_res = fetch_expense_types();
                exp_type_res.then(exp_types => setExpense_type_list(exp_types));
            }            
            setAct_message(data);
            toggleExpenseTypeModal();
        });
    }


    return (
        <Modal open={openExpenseTypeModal} onClose={toggleExpenseTypeModal} 
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                BackdropComponent={Backdrop}>
                <Fade in={openExpenseTypeModal}>
                    <div className={classes.paper}>
                        <ModalHeader header={action + ' Expense Type'} toggleModal={toggleExpenseTypeModal}/>

                        <form onSubmit={onSubmit} onReset={onReset} noValidate autoComplete="off">
                            <TextField value={expense_name} onChange={e=>{setExpense_name(e.target.value);setExpenseNameErr(false);}} error={expenseNameErr} label="Expense Name" fullWidth variant="outlined" required className={classes.field}  size="small"/>
                            <TextField value={exp_type} onChange={e=>{setExp_type(e.target.value);setExpTypeErr(false);}} error={expTypeErr} label="Expense Type" fullWidth variant="outlined" required className={classes.field}  size="small"/>
                            <TextField value={comments} onChange={e=>{setComments(e.target.value);}} label="Description" multiline rows={3} fullWidth variant="outlined" className={classes.field} size="small"/> 
                            <Button type="submit" variant="contained" color="primary" size="small">{action}</Button>
                            {(action === 'Add New') && <Button type="reset" variant="contained" size="small" className={classes.btn}>Reset</Button>}
                            {(action === 'Update') && <Button onClick={toggleExpenseTypeModal} variant="contained" size="small" className={classes.btn}>Cancel</Button>}
                        </form>
                        <SnakbarComp />
                    </div>
                </Fade>
            </Modal>
    );
};

export default ExpenseTypeEntry;


const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    field:{
        marginBottom: theme.spacing(2)
    },
    btn: {marginLeft: theme.spacing(1)}
  }));
