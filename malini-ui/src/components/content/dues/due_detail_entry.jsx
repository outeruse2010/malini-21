import React,{useState, useEffect} from 'react'

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import {TextField, Button}  from '@material-ui/core';
import moment from 'moment';
import {login_atom} from '../login/login_api';
import {useRecoilValue, useRecoilState} from 'recoil';

import ModalHeader from '../utils/ModalHeader';
import SnakbarComp from '../utils/SnakbarComp';
import { message_atom } from '../utils/SnakbarComp';
import {cus_due_atom, act_cus_due_atom, fetch_customer_dues, add_update_cus_due} from './cus_due_api';
import { customer_atom, fetch_customers } from '../customer/customer_api';

const DueDetailEntry = ({selected_customer, selected_mkt_due_row, edit_marketing, toggleEdit_marketingModal}) => {
    const classes = useStyles();

    const login_data = useRecoilValue(login_atom);
    const user_name = login_data.user_name;

    const [cus_due_id, setCus_due_id] = useState(null);
    const [mkt_amount, setMkt_amount] = useState('');
    const [credit_amt, setCredit_amt] = useState('');
    const [mkt_pay_date, setMkt_pay_date] = useState(null);
    const [comments, setComments] = useState('');

    const [due_list, setDue_list] = useRecoilState(cus_due_atom);
    const [act_cus_due_atom_res, setAct_cus_due_atom_res] = useRecoilState(act_cus_due_atom);
    const [act_message, setAct_message] = useRecoilState(message_atom);
    const [customer_list, setCustomer_list] = useRecoilState(customer_atom);
    
    useEffect(()=>{
        onReset();
        if(selected_mkt_due_row){
            setCus_due_id(selected_mkt_due_row['cus_due_id']);
            setMkt_amount(selected_mkt_due_row['mkt_amount']);
            setCredit_amt(selected_mkt_due_row['credit_amt']);
            let dt = selected_mkt_due_row['mkt_pay_date'];
            if(dt){
                let val = moment(dt).format('YYYY-MM-DD');
                setMkt_pay_date(val);
            }
            setComments(selected_mkt_due_row['comments']);
        }
        
    }, [edit_marketing]);

    const action = selected_mkt_due_row ? 'Update' : 'Add New';

    const onSubmit = (e) => {
        e.preventDefault();
        let cus_id = selected_customer['cus_id'];
        
        const due_json = {cus_id,  'mkt_amount': mkt_amount || 0, 'credit_amt':credit_amt || 0,'mkt_pay_date':mkt_pay_date, 'comments':comments};
        if(selected_mkt_due_row){
            due_json['cus_due_id']= selected_mkt_due_row['cus_due_id'];
            due_json['updated_by']= user_name;
        }else{
            due_json['created_by']= user_name;
        }
        const res = add_update_cus_due(due_json);
        res.then(data => {
            setAct_cus_due_atom_res(data);
            if(data.status === 'success'){
                toggleEdit_marketingModal(false);
                const cus_due_res = fetch_customer_dues({cus_id});
                cus_due_res.then(cus_dues => setDue_list(cus_dues));
                const customer_res = fetch_customers();
                customer_res.then(customers => setCustomer_list(customers));
            }            
            setAct_message(data);
        });
        };

    const onReset = () => {
        setCus_due_id(null);
        setMkt_amount('');
        setCredit_amt('');
        setComments('');
        setMkt_pay_date(null);
    };

    
    return ( 
        <Modal open={edit_marketing} onClose={toggleEdit_marketingModal} 
                    size='small' className={classes.modal} BackdropComponent={Backdrop}>
        <Fade in={edit_marketing}>
            <div className={classes.paper}>
                <ModalHeader header={action + ' Marketing'} toggleModal={toggleEdit_marketingModal}/>

                <form onSubmit={onSubmit} onReset={onReset} noValidate autoComplete="off"> 
                    <TextField type='number' value={mkt_amount} onChange={e=>setMkt_amount(e.target.value)} label="Marketing (Rs.)" fullWidth variant="outlined" className={classes.field} size="small"/>
                    <TextField type='number' value={credit_amt} onChange={e=>setCredit_amt(e.target.value)} label="Payment (Rs.)" fullWidth variant="outlined" className={classes.field} size="small"/>
                    <TextField type="date"  value={mkt_pay_date} onChange={(e) => setMkt_pay_date(e.target.value)} 
                           label="Marketing/Payment Date (dd/mm/yyyy)" variant="outlined" className={classes.field} fullWidth  InputLabelProps={{ shrink: true, }} size="small"/>
                    <TextField value={comments} onChange={e=>setComments(e.target.value)} label="Comments" fullWidth variant="outlined" className={classes.field} multiline rows={2} size="small"/>
                    <Button type="submit" variant="contained" color="primary" size="small">{action}</Button>
                    {(action === 'Add New') && <Button type="reset" variant="contained" size="small" className={classes.btn}>Reset</Button>}
                    {(action === 'Update') && <Button onClick={toggleEdit_marketingModal} variant="contained" size="small" className={classes.btn}>Cancel</Button>}
                </form>
                <SnakbarComp />
            </div>
        </Fade>
    </Modal>
    )
};

export default DueDetailEntry;


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
      padding: theme.spacing(2, 4, 3),
    },
    field:{
        marginBottom: theme.spacing(2)
    },
    btn: {marginLeft: theme.spacing(1)},
    area_btn: {margin: theme.spacing(1)},
    
  }));
