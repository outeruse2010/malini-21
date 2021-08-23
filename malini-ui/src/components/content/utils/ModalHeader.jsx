import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

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
 