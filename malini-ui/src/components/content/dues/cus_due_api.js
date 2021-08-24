import {atom} from 'recoil';
import {call_rest_api} from '../utils/api_utils';

export const cus_due_atom = atom({key: "cus_due_atom", default: []});
export const act_cus_due_atom = atom({key: "act_cus_due_atom", default: {} });

export const fetch_customer_dues = (input = {}) => {
    const api = 'fetch_customer_dues';
    return call_rest_api(api, input);
};

export const add_update_cus_due = (input) => {
    const api = input['cus_due_id'] ? 'update_customer_due' : 'add_customer_due';
    return call_rest_api(api, input);
}

export const delete_cus_due = (input) => {
    const api = 'remove_customer_due';
    return call_rest_api(api, input);
}
