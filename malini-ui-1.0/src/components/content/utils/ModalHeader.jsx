import React from 'react';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const ModalHeader = ({header, toggleModal}) => {
    const classes = useStyles();
    return (
        <Grid container direction="row" justifyContent="space-between" alignItems="center" className={classes.modal_title}>
            <Typography variant="h6"> {header} </Typography>
            <IconButton aria-label="close" onClick={toggleModal}><CloseIcon color='primary' /></IconButton>
        </Grid>
    )
}

export default ModalHeader;

const useStyles = makeStyles((theme) => ({ 
    modal_title: {marginBottom: theme.spacing(1)}
 }));
 