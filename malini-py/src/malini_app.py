# ********************************
# * Project : malini-py
# * File :  malini_app.py
# * Created by Malancha at 28/7/2021
# ********************************

from flask import Flask, request, make_response
from flask_cors import CORS
from flask_graphql import GraphQLView

from src.utils.app_utils import trim_json

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def test():
    return 'Malini application has started !!!'

from src.module.activity.user_repository import *

@app.route('/login', methods=['POST'])
def login():
    input = request.get_json()
    res = user_login(input)
    return res


@app.route("/fetch_users",  methods=['POST'])
def fetch_user_list():
    input = request.get_json()
    res = perform_request(input, 'fetch_users',VIEW_ROLE, fetch_users)
    return res

@app.route("/fetch_roles",  methods=['POST'])
def fetch_role_list():
    input = request.get_json()
    res = perform_request(input, 'fetch_roles',VIEW_ROLE, fetch_roles)
    return res

@app.route('/add_user', methods=['POST'])
def new_user_add():
    input = request.get_json()
    res = perform_request(input, 'add_user', ACTION_ROLE, add_new_user)
    return res

@app.route('/update_user', methods=['POST'])
def update_existing_user():
    input = request.get_json()
    res = perform_request(input, 'update_user', ACTION_ROLE, update_user)
    return res

@app.route('/assign_role', methods=['POST'])
def assign_role():
    user_role_json = request.get_json()
    res_json = add_user_role_map(user_role_json)
    return res_json

# =============== cus_area detail Api localhost:5000/graphql_cus_area_list    =====================
# query to run on graphiql
# query cus_area_query{ cusAreas { area_id, area_name, description, created_on, created_by, updated_on, updated_by, deleted}}
from src.module.customer.service.cus_area_service import cus_area_schema
app.add_url_rule('/graphql_cus_area_list', view_func= GraphQLView.as_view('grapghql', schema= cus_area_schema(), graphiql=True))

from src.module.customer.repository.cus_area_repository import *

@app.route("/fetch_customer_areas",  methods=['POST'])
def fetch_customer_areas():
    input = request.get_json()
    res = perform_request(input, 'fetch_customer_areas',VIEW_ROLE, customer_areas)
    return res


@app.route("/add_customer_area", methods=['POST'])
def new_cus_area():
    input = request.get_json()
    res = perform_request(input, 'add_customer_area',ACTION_ROLE, add_customer_area)
    return res


@app.route("/update_customer_area", methods=['POST'])
def update_cus_area():
    input = request.get_json()
    res = perform_request(input, 'update_customer_area',ACTION_ROLE, update_customer_area)
    return res


@app.route("/remove_customer_area", methods=['POST'])
def remove_cus_area():
    input = request.get_json()
    res = perform_request(input, 'remove_customer_area',ACTION_ROLE, delete_customer_area)
    return res


# =============== customer detail Api localhost:5000/graphql_customer_list    =====================
# query to run on graphiql
#query customer_query{ customers {cus_id, cus_sr, first_name, mid_name, last_name, address, area_id, email, phone, comments, created_on, created_by, updated_on, updated_by, deleted}}
from src.module.customer.service.cus_area_service import cus_area_schema
# app.add_url_rule('/graphql_customer_list', view_func= GraphQLView.as_view('grapghql', schema= cus_area_schema(), graphiql=True))

from src.module.customer.repository.customer_repository import *

@app.route("/fetch_customers",  methods=['POST'])
def fetch_customers():
    input = request.get_json()
    res = perform_request(input, 'fetch_customers',VIEW_ROLE, fetch_customer_dues)
    return res

@app.route("/customer_dashboard_data",  methods=['POST'])
def fetch_customer_dashboard_data():
    input = request.get_json()
    res = perform_request(input, 'customer_dashboard_data',VIEW_ROLE, customer_dashboard_data)
    return res

@app.route("/add_customer",  methods=['POST'])
def new_customer():
    input = request.get_json()
    res = perform_request(input, 'add_customer',ACTION_ROLE, add_customer)
    return res

@app.route("/update_customer",  methods=['POST'])
def update_customer_info():
    input = request.get_json()
    res = perform_request(input, 'update_customer',ACTION_ROLE, update_customer)
    return res


@app.route("/remove_customer", methods=['POST'])
def remove_customer():
    input = request.get_json()
    res = perform_request(input, 'remove_customer',ACTION_ROLE, delete_customer)
    return res


# =============== customer due detail     =====================

from src.module.due_detail.repository.cus_due_repository import *

@app.route("/fetch_customer_dues",  methods=['POST'])
def find_customer_dues():
    input = request.get_json()
    res = perform_request(input, 'fetch_customer_dues',VIEW_ROLE, fetch_due_detail_by_cus_id)
    return res

@app.route("/add_customer_due",  methods=['POST'])
def add_customer_due():
    input = request.get_json()
    res = perform_request(input, 'add_customer_due',ACTION_ROLE, add_due_amount)
    return res


@app.route("/update_customer_due",  methods=['POST'])
def update_customer_due():
    input = request.get_json()
    res = perform_request(input, 'update_customer_due',ACTION_ROLE, update_due_amount)
    return res


@app.route("/remove_customer_due", methods=['POST'])
def remove_customer_due():
    input = request.get_json()
    res = perform_request(input, 'remove_customer_due',ACTION_ROLE, delete_due_amount)
    return res


# =============== expense type detail     =====================

from src.module.sale_expense.repository.expense_type_repository import *

@app.route("/fetch_expense_types",  methods=['POST'])
def fetch_expense_types():
    input = request.get_json()
    res = perform_request(input, 'fetch_expense_types',VIEW_ROLE, expense_types)
    return res

@app.route("/new_expense_type",  methods=['POST'])
def add_new_expense_type():
    input = request.get_json()
    res = perform_request(input, 'new_expense_type',ACTION_ROLE, add_expense_type)
    return res


@app.route("/update_expense_type",  methods=['POST'])
def update_existing_expense_type():
    input = request.get_json()
    res = perform_request(input, 'update_expense_type',ACTION_ROLE, update_expense_type)
    return res


@app.route("/remove_expense_type", methods=['POST'])
def remove_expense_type():
    input = request.get_json()
    res = perform_request(input, 'remove_expense_type',ACTION_ROLE, delete_expense_type)
    return res


# =============== sale expense detail     =====================

from src.module.sale_expense.repository.daily_sale_expense_repository import *

@app.route("/fetch_daily_sale_expenses",  methods=['POST'])
def fetch_daily_sale_expenses():
    input = request.get_json()
    res = perform_request(input, 'fetch_daily_sale_expenses',VIEW_ROLE, daily_sale_expenses)
    return res

@app.route("/sale_expense_dashboard_data",  methods=['POST'])
def fetch_sale_expense_dashboard_data():
    input = request.get_json()
    res = perform_request(input, 'sale_expense_dashboard_data',VIEW_ROLE, sale_expense_dashboard_data)
    return res

@app.route("/new_daily_sale_expense",  methods=['POST'])
def add_new_daily_sale_expense():
    input = request.get_json()
    res = perform_request(input, 'new_daily_sale_expense',ACTION_ROLE, add_daily_sale_expense)
    return res



# =============== daily sale detail     =====================

from src.module.sale_expense.repository.daily_sale_repository import *

@app.route("/fetch_daily_sales",  methods=['POST'])
def find_daily_sales():
    input = request.get_json()
    res = perform_request(input, 'fetch_daily_sales',VIEW_ROLE, fetch_daily_sales)
    return res

@app.route("/new_daily_sale",  methods=['POST'])
def add_new_daily_sale():
    input = request.get_json()
    res = perform_request(input, 'add_daily_sales',ACTION_ROLE, add_daily_sales)
    return res


@app.route("/update_daily_sales",  methods=['POST'])
def update_existing_daily_sale():
    input = request.get_json()
    res = perform_request(input, 'update_daily_sales',ACTION_ROLE, update_daily_sales)
    return res


@app.route("/remove_daily_sale", methods=['POST'])
def remove_daily_sale():
    input = request.get_json()
    res = perform_request(input, 'remove_daily_sale',ACTION_ROLE, delete_daily_sales)
    return res


# =============== daily expense detail     =====================

from src.module.sale_expense.repository.daily_expense_repository import *

@app.route("/fetch_daily_expenses",  methods=['POST'])
def find_daily_expenses():
    input = request.get_json()
    res = perform_request(input, 'fetch_daily_expenses',VIEW_ROLE, fetch_daily_expenses)
    return res

@app.route("/add_daily_expenses",  methods=['POST'])
def add_new_daily_expense():
    input = request.get_json()
    res = perform_request(input, 'add_daily_expenses',ACTION_ROLE, add_daily_expenses)
    return res


@app.route("/update_daily_expense",  methods=['POST'])
def update_existing_daily_expense():
    input = request.get_json()
    res = perform_request(input, 'update_daily_expense',ACTION_ROLE, update_daily_expenses)
    return res


@app.route("/remove_daily_expense", methods=['POST'])
def remove_daily_expense():
    input = request.get_json()
    res = perform_request(input, 'remove_daily_expense',ACTION_ROLE, delete_daily_expenses)
    return res


# ***********************user activity *********************

def check_authentication(input, roles):
    access_json = allowed_to_do(input['user_id'], input['log_in_code'], roles)
    if not access_json['allowed']:
        raise PermissionError(access_json['message'])

import socket
import platform

def perform_request(input, api_name, roles, callback_fun, comments=''):
    user_id = input["user_id"]
    user_name = input["user_name"]
    if not user_id:
        # log.info(f'User not logged in !!! Input: {input}')
        return {'status': ERROR, 'message': 'User not logged in !!!'}
    res = {}
    status = SUCCESS
    try:
        check_authentication(input, roles)
        trim_json(input, ['user_id', 'log_in_code', 'user_name'])
        res = callback_fun(input)
    except Exception as e:
        status = ERROR
        res['status'] = ERROR
        res['message'] = str(e)
        traceback.print_exc()
    if not api_name.startswith('fetch'):
        actv_json = {"user_id": user_id, "user_name": user_name,
                     "activity_type": api_name, "activity_status": status,
                     "host_name": socket.gethostname(),
                     "os_name": platform.system() + ' ' + platform.release(), "comments": comments}
        add_user_activity(actv_json)
    return res

if __name__ == '__main__':
    app.run(debug=True)
