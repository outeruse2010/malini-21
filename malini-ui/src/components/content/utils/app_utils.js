import moment from 'moment';

export const gridDateTime = (params) =>{
    const row = params.row;
    const field = params.field;
    const format = "DD-MMM-YYYY HH:mm:ss";
    let value = row[field] ? moment(row[field]).format(format) : '';    
    return value;
};

export const gridDate = (params) =>{
    const row = params.row;
    const field = params.field;
    const format = "DD-MMM-YYYY";
    let value = row[field] ? moment(row[field]).format(format) : '';    
    return value;
};

export const text_search = (colVal, operator, value) => {
    colVal = colVal.toLowerCase();
    value = value.toLowerCase();
    switch (operator){
        case 'Starts With':
            return colVal.startsWith(value);
        case 'Ends With':
            return colVal.endsWith(value);
        case 'Contains':
            return colVal.includes(value);
        default:
            break;
    }
};

export const num_search = (colVal, operator, value) => {
    switch (operator){
        case '=':
            return (colVal === value);
        case '>':
            return (colVal > value);
        case '<':
            return (colVal < value);
        default:
            break;
    }
};
