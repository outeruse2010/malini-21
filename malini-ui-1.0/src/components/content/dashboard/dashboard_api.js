import {atom} from 'recoil';
import {call_rest_api} from '../utils/api_utils';

// export const cus_dashboard_atom = atom({key: "cus_dashboard_atom", default: []});
// export const act_cus_dashboard_atom = atom({key: "act_cus_dashboard_atom", default: {} });

export const fetch_customer_dashboard_data = (input = {}) => {
    return call_rest_api('customer_dashboard_data', input);
};

export const fetch_sale_expense_dashboard_data = (input = {}) => {
    return call_rest_api('sale_expense_dashboard_data', input);
};
