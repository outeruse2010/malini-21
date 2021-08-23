# ********************************
# * Project : malini-py
# * File :  expense_type_repository.py
# * Created by Malancha at 19/7/2021
# ********************************

import traceback

import pandas as pd

from src.config.db_config import db_engine
from src.config.log_config import log
from src.constants.app_const import *


def expense_types(input={}):
    log.info('find expense_types....')
    engine = db_engine()
    sql = f''' SELECT cast(expense_type_id as varchar) expense_type_id,cast(expense_type_id as varchar) id, expense_name, 
               "comments", created_on, created_by, updated_on, updated_by, deleted
               FROM {DB_SCHEMA}.expense_type
               where deleted = 'N' order by created_on desc '''
    df = pd.read_sql(con=engine, sql=sql)
    log.info(f'expense_types no of rows selected : {df.shape[0]}')
    rs_json = df.to_json(orient="records")
    return rs_json

def add_expense_type(expense_type_json):
    log.info(f'add_expense_type....{expense_type_json}')
    expense_name = expense_type_json['expense_name']
    msg = f'''expense name [{expense_name}] added !!! '''
    msg_json = {}
    try:
        df = pd.DataFrame([expense_type_json])
        engine = db_engine()
        df.to_sql('expense_type', con=engine, schema=DB_SCHEMA, if_exists='append', index=False)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to add expense name [{expense_name}] !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json


def update_expense_type(expense_type_json):
    expense_type_id = expense_type_json['expense_type_id']
    expense_name = expense_type_json['expense_name']
    log.info(f'update_expense_type for expense_type_id: {expense_type_id}')
    sql = f''' UPDATE {DB_SCHEMA}.expense_type set expense_name = '{expense_name}', 
               comments = '{expense_type_json['comments']}', updated_by = '{expense_type_json['updated_by']}',
               updated_on = now() where expense_type_id = '{expense_type_id}' '''
    msg = f'''expense name [{expense_name}] updated !!! '''
    msg_json = {}
    try:
        engine = db_engine()
        with engine.begin() as con:
            con.execute(sql)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to update expense name [{expense_name}] !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json

def delete_expense_type(expense_type_json):
    expense_type_id = expense_type_json['expense_type_id']
    expense_name = expense_type_json['expense_name']
    log.info(f'delete_expense_type for expense_type_id: {expense_type_id}')
    sql = f''' UPDATE {DB_SCHEMA}.expense_type set deleted='Y', updated_by = '{expense_type_json['updated_by']}',
               updated_on = now() where expense_type_id = '{expense_type_id}' '''
    msg = f'''expense name [{expense_name}] deleted !!! '''
    msg_json = {}
    try:
        engine = db_engine()
        with engine.begin() as con:
            con.execute(sql)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to delete expense name [{expense_name}] !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json


# expense_type_json = {"expense_name": "Khatsara", "comments": "Khatsara area", "created_by":"Auto"}
# add_expense_type(expense_type_json)
# expense_type_json = {"expense_name": "Belia Danga", "comments": "Belia Danga", "created_by":"Auto"}
# add_expense_type(expense_type_json)

# expense_type_json = {"expense_name": "Khatsara", "comments": "Khatsara area", "updated_by":"Auto",
#                  "expense_type_id":"cb7fc2da-1a6b-4270-a522-49e6131d516d"}
# update_expense_type(expense_type_json)
#
# expense_types()
