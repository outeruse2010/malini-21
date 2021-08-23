import React,{useState} from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import {TextField, Button, Typography}  from '@material-ui/core';

import Cookies from 'js-cookie';

import {login_atom,do_login} from './login_api';
import {useRecoilState} from 'recoil';
import { message_atom } from '../../content/utils/SnakbarComp';
import SnakbarComp from '../../content/utils/SnakbarComp';

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
        const user_login_json = {user_name, user_pass};
        const res_login = do_login(user_login_json);

        res_login.then(data => {
            setLog_in_detail(data);
            const log_in_code = data.log_in_code;
            // const log_in_code = Cookies.get('log_in_code');
            // console.log('***log_in_code: ',log_in_code);
            Cookies.set('log_in_code',log_in_code);
            Cookies.set('user_id',data.user_id);
            Cookies.set('user_name',user_name);
            setAct_message({'status': data.status, 'message': data.message});        
        });

    };

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={9}></Grid>
                <Grid item xs={3}>
                    <Paper className={classes.paper}>
                        <Typography variant="h6" className={classes.field} >Sign In</Typography>                    
                                    
                        <form onSubmit={onSubmit} noValidate autoComplete="off">
                            <TextField size="small" value={user_name} onChange={e=>{setUser_name(e.target.value);setUser_name_err(false);}} error={user_name_err} label="User Name" fullWidth variant="outlined" required className={classes.field}/>
                            <TextField size="small" value={user_pass} type='password' onChange={e=>{setUser_pass(e.target.value);setUser_pass_err(false);}} error={user_pass_err}  label="Password" fullWidth variant="outlined" required className={classes.field}/> 
                            <Button type="submit" variant="contained" color="primary" size="small">Login</Button>
                        </form>

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
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      },
    field:{
        marginBottom: theme.spacing(2)
    },
    btn: {marginLeft: theme.spacing(1)}
  }));

