import React,{useState} from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import Stack from '@mui/material/Stack';
import {TextField, Button, Typography}  from '@mui/material';

import Cookies from 'js-cookie';

import {login_atom,do_login} from './login_api';
import {useRecoilState} from 'recoil';
import { message_atom } from '../../content/utils/SnakbarComp';
import SnakbarComp from '../../content/utils/SnakbarComp';
import { SUCCESS } from './../utils/app_const';

const UserLogin = () => {
    const classes = useStyles();

    const [log_in_detail, setLog_in_detail] = useRecoilState(login_atom);
    const [act_message, setAct_message] = useRecoilState(message_atom);

    const [user_name, setUser_name] = useState('');
    const [user_pass, setUser_pass] = useState('');
    const [user_name_err, setUser_name_err] = useState(false);
    const [user_pass_err, setUser_pass_err] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();        
        if(!user_name){
            setUser_name_err(true);
            return;
        }
        if(!user_pass){
            setUser_pass_err(true);
            return;
        }
        const user_login_json = {'user_name': user_name, 'user_pass': user_pass};
              
        const res_login = do_login(user_login_json);
        
        Cookies.remove('log_in_code');
        Cookies.remove('user_id');
        Cookies.remove('user_name');

        res_login.then(data => {
            // console.log('***data: ',data);
            if(data.status === SUCCESS){
                setLog_in_detail(data);
                const log_in_code = data.log_in_code;
                Cookies.set('log_in_code',log_in_code);
                Cookies.set('user_id',data.user_id);
                Cookies.set('user_name',user_name);
            }   
            setAct_message({'status': data.status, 'message': data.message});  
        });
        

    };

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={9}></Grid>
                <Grid item xs={3}>
                    <Paper className={classes.paper}>
                        <Stack  component="form"  onSubmit={onSubmit}  spacing={2}  noValidate  autoComplete="off"  >
                            <Typography variant="h6" className={classes.field} >Sign In</Typography>
                            <TextField size="small" value={user_name} onChange={e=>{setUser_name(e.target.value);setUser_name_err(false);}} error={user_name_err} label="User Name" fullWidth variant="outlined" required className={classes.field}/>                           
                            <TextField size="small" value={user_pass} type='password' onChange={e=>{setUser_pass(e.target.value);setUser_pass_err(false);}} error={user_pass_err}  label="Password" fullWidth variant="outlined" required className={classes.field}/> 
                            <Button type="submit"   variant="contained" color="primary" size="small" className={classes.btn}>Login</Button>                         
                         </Stack>
                         
                        <SnakbarComp />
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

export default UserLogin;

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        margin: theme.spacing(2)
      },
      paper: {
        marginTop:theme.spacing(5),
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      },
    field:{
        marginBottom: theme.spacing(3)
    },
    btn: {marginTop: theme.spacing(2)}
  }));

