import {atom} from 'recoil';
import {call_rest_api} from '../utils/api_utils';

export const supplier_list_atom = atom({key: "supplier_list_atom", default: []});
export const act_supplier_list_atom = atom({key: "act_supplier_list_atom", default: {} });

export const fetch_supplier_list = (input = {}) => {
    return call_rest_api('fetch_supplier_list', input);
};

export const add_update_supplier = (input) => {
    const api = input['supplier_id'] ? 'update_existing_supplier' : 'add_new_supplier';
    return call_rest_api(api, input);
}

export const delete_supplier = (input) => {
    const api = 'remove_supplier';
    return call_rest_api(api, input);
}

