import React,{useState} from 'react'
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import AutoCompleteComp from './AutoCompleteComp';

const _ = require('lodash');
const text_filters = ['Contains','Starts With', 'Ends With'];
const num_filters = ['=','>', '<'];
const combo_options = (arr)=>{
    let options = [];
    arr.map(a=>options.push({'label': a, 'value': a}));
    return options;
};

const DataGridToolBar = ({columns, onRowsFilter}) => {
    const [srch_by, setSearchBy] = useState(''); 
    const [colValue, setColvalue] = useState('');
    const [colName, setColName] = useState('');
    const [colType, setColType] = useState('');
    const [operator, setOperator] = useState('');

    let operatorList = combo_options(text_filters);
    
    const onColNameChange = (colNm)=> {
        setColName(colNm);
        let col_arr = _.filter(columns, col=> col.field === colNm);
        if(col_arr && col_arr.length>0){
            let colTyp = col_arr[0].type ? col_arr[0].type : 'text';
            setColType(colTyp);
            if(colTyp==='number' || colTyp==='date'){
                operatorList = combo_options(num_filters);
            }   
        }
    };

    const onOperatorChange = (o)=>setOperator(o);

    const onValueChange = (e) => {
        let v = e.target.value;
        setColvalue(v);
        if(v && v.length>=2){
            onRowsFilter(colName, colType, operator, v);
        }else{
            onRowsFilter(null, null, null, null);
        }
    }


    return (
        <Toolbar>
            <AutoCompleteComp label='columns' value_list={columns} label_field='headerName' value_field='field' value={colName} onComboValueChange={onColNameChange}/>
           {colName && <AutoCompleteComp label='operators' value_list={operatorList} label_field='label' value_field='value' value={operator} onComboValueChange={onOperatorChange} />}
            {colType && <TextField type={colType} label="value" value={colValue} onChange={onValueChange}/>}
        </Toolbar>
    )
}

export default DataGridToolBar;
