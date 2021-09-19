import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import ModalHeader from '../utils/ModalHeader';

import {TextField, Button}  from '@material-ui/core';

import {useRecoilState, useRecoilValue} from 'recoil';

import { sale_atom, act_sale_atom, fetch_daily_sales, add_update_daily_sale} from './sale_expense_api';

import SnakbarComp, {message_atom} from '../utils/SnakbarComp';

import {login_atom} from '../login/login_api';

import moment from 'moment';


const DailySaleEntry = ({selected_sale, openSaleModal, toggleSaleModal}) => {
    const classes = useStyles();
    const login_data = useRecoilValue(login_atom);
    const user_name = login_data.user_name;

    const action = selected_sale ? 'Update' : 'Add New';

    const [cash_sale_amount, setCash_sale_amount] = useState('');
    const today = moment().format('YYYY-MM-DD');
    const [sale_date, setSale_date] = useState(today);
    const [comments, setComments] = useState('');

    const [saleDateErr, setSaleDateErr] = useState(false);

    const [sale_res, setAct_sale_res] = useRecoilState(act_sale_atom);
    const [sale_list, setSale_list] = useRecoilState(sale_atom);
    const [act_message, setAct_message] = useRecoilState(message_atom);
    
    useEffect(()=> {
        onReset(); 
        if(selected_sale){
            setCash_sale_amount(selected_sale.cash_sale_amount);
            let dt = selected_sale['sale_date'];
            if(dt){
                let val = moment(dt).format('YYYY-MM-DD');
                setSale_date(val);
            }
            setComments(selected_sale.comments);
        }
    }, [openSaleModal]);

    const onReset = () => {
        setCash_sale_amount('');
        setSale_date(today);
        setComments('');
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if(!sale_date){
            setSaleDateErr(true);
            return;
        }
        
        let input = {'cash_sale_amount': cash_sale_amount || 0,'sale_date':sale_date, 'comments':comments};
        const do_update = (action === 'Update');
        if(do_update) {
            input['updated_by'] = user_name; input['sale_id']= selected_sale['sale_id'];
        }else{
            input['created_by'] = user_name; 
        }

        const res = add_update_daily_sale(input);
        res.then(data => {
            setAct_sale_res(data);
            if(data.status === 'success'){
                const sale_res = fetch_daily_sales();
                sale_res.then(se => setSale_list(se));
            }            
            setAct_message(data);
            toggleSaleModal();
        });
    }

    return (
        <Modal open={openSaleModal} onClose={toggleSaleModal} 
                size='small'
                className={classes.modal}
                BackdropComponent={Backdrop}>
                <Fade in={openSaleModal}>
                    <div className={classes.paper}>
                        <ModalHeader header={action + ' Sale '} toggleModal={toggleSaleModal}/>

                        <form onSubmit={onSubmit} onReset={onReset} noValidate autoComplete="off">
                            <TextField type="date" value={sale_date} onChange={(e) => setSale_date(e.target.value)} 
                                    required error={saleDateErr} label="Sale Date (dd/mm/yyyy)" variant="outlined" className={classes.field} fullWidth  InputLabelProps={{ shrink: true, }} size="small"/>   
                            <TextField type='number' value={cash_sale_amount} onChange={e=>setCash_sale_amount(e.target.value)} label="Cash Sale" fullWidth variant="outlined"  className={classes.field} size="small"/>
                            
                            <TextField value={comments} onChange={e=>setComments(e.target.value)} label="Comments" fullWidth variant="outlined" className={classes.field} multiline rows={2} size="small"/>
                            
                            <Button type="submit" variant="contained" color="primary" size="small">{action}</Button>
                            {(action === 'Add New') && <Button type="reset" variant="contained" size="small" className={classes.btn}>Reset</Button>}
                            {(action === 'Update') && <Button onClick={toggleSaleModal} variant="contained" size="small" className={classes.btn}>Cancel</Button>}
                        </form>
                       
                        <SnakbarComp />
                    </div>
                </Fade>
            </Modal>
    );
};

export default DailySaleEntry;



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


