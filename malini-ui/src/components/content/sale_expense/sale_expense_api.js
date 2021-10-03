import {atom} from 'recoil';
import {post_request} from '../utils/api_utils';

/****************expense type  ***********/
export const expense_type_atom = atom({key: "expense_type_atom", default: []});
export const act_expense_type_atom = atom({key: "act_expense_type_atom", default: {} });

export const fetch_expense_types = async (input = {}) => {
    const req = post_request('fetch_expense_types', input);
    const res = await fetch(req);
    const data = res.json();    
    return data;
};

export const new_expense_type = async (input) => {
    const api = input['expense_type_id'] ? 'update_expense_type' : 'new_expense_type';
    const req = post_request(api, input);
    const res = await fetch(req);
    const data = res.json();   
    return data;
}

export const delete_expense_type = async (input) => {
    const api = 'remove_expense_type';
    const req = post_request(api, input);
    const res = await fetch(req);
    const data = res.json();   
    return data;
}

/****************Daily sale expense detail ***********/

export const sale_expense_atom = atom({key: "sale_expense_atom", default: []});
export const act_sale_expense_atom = atom({key: "act_sale_expense_atom", default: {} });

export const fetch_daily_sale_expenses = async (input = {}) => {
    const req = post_request('fetch_daily_sale_expenses', input);
    const res = await fetch(req);
    const data = res.json();
    return data;
};

export const add_update_daily_sale_expense = async (input) => {
    const api =  'new_daily_sale_expense';
    const req = post_request(api, input);
    const res = await fetch(req);
    const data = res.json();   
    return data;
}

export const delete_daily_sale_expense = async (input) => {
    const api = 'remove_daily_sale_expense';
    const req = post_request(api, input);
    const res = await fetch(req);
    const data = res.json();   
    return data;
}


/****************Daily sale  detail ***********/

export const sale_atom = atom({key: "sale_atom", default: []});
export const act_sale_atom = atom({key: "act_sale_atom", default: {} });

export const fetch_daily_sales = async (input = {}) => {
    const req = post_request('fetch_daily_sales', input);
    const res = await fetch(req);
    const data = res.json();    
    return data;
};

export const add_update_daily_sale = async (input) => {
    const api = input['sale_id'] ? 'update_daily_sales' : 'new_daily_sale';
    const req = post_request(api, input);
    const res = await fetch(req);
    const data = res.json();   
    return data;
}

export const delete_daily_sale = async (input) => {
    const api = 'remove_daily_sale';
    const req = post_request(api, input);
    const res = await fetch(req);
    const data = res.json();   
    return data;
}


/****************Daily  expense detail ***********/

export const expense_atom = atom({key: "expense_atom", default: []});
export const act_expense_atom = atom({key: "act_expense_atom", default: {} });

export const fetch_daily_expenses = async (input = {}) => {
    const req = post_request('fetch_daily_expenses', input);
    const res = await fetch(req);
    const data = res.json();    
    return data;
};

export const add_update_daily_expense = async (input) => {
    const api = input['expense_id'] ? 'update_daily_expense' : 'add_daily_expenses';
    const req = post_request(api, input);
    const res = await fetch(req);
    const data = res.json();   
    return data;
}

export const delete_daily_expense = async (input) => {
    const api = 'remove_daily_expense';
    const req = post_request(api, input);
    const res = await fetch(req);
    const data = res.json();   
    return data;
}
