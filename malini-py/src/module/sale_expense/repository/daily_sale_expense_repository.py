# ********************************
# * Project : malini-py
# * File :  daily_sale_expense_repository.py
# * Created by Malancha at 19/7/2021
# ********************************

import traceback

import pandas as pd

from src.config.db_config import db_engine
from src.config.log_config import log
from src.constants.app_const import *

def daily_sale_expenses(input={}):
    log.info('find daily_sale_expenses....')
    engine = db_engine()
    sql = f''' SELECT cast(se.sale_expense_id as varchar) sale_expense_id, cast(se.sale_expense_id as varchar) id, 
                cast(se.expense_type_id as varchar) expense_type_id, e.expense_name,
                se.cash_sale_amount, se.expense_amt, se.sale_expense_date, se."comments",
                se.created_on, se.created_by, se.updated_on, se.updated_by, se.deleted
                FROM {DB_SCHEMA}.daily_sale_expense se, {DB_SCHEMA}.expense_type e
                where se.expense_type_id = e.expense_type_id and se.deleted = 'N' order by created_on desc '''

    df = pd.read_sql(con=engine, sql=sql)
    log.info(f'daily_sale_expenses no of rows selected : {df.shape[0]}')
    rs_json = df.to_json(orient="records")
    return rs_json


def add_daily_sale_expense(exp_sale_json):
    log.info(f'add_daily_sale_expense....{exp_sale_json}')
    msg = f'''daily sale expense added !!! '''
    msg_json = {}
    try:
        df = pd.DataFrame([exp_sale_json])
        engine = db_engine()
        df.to_sql('daily_sale_expense', con=engine, schema=DB_SCHEMA, if_exists='append', index=False)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to add daily_sale_expense !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json


def update_daily_sale_expense(exp_sale_json):
    sale_expense_id = exp_sale_json['sale_expense_id']
    log.info(f'update_daily_sale_expense for sale_expense_id: {sale_expense_id}')
    sql = f''' UPDATE {DB_SCHEMA}.daily_sale_expense set expense_type_id = '{exp_sale_json['expense_type_id']}',
               cash_sale_amount = '{exp_sale_json['cash_sale_amount']}', expense_amt = '{exp_sale_json['expense_amt']}',
               sale_expense_date = '{exp_sale_json['sale_expense_date']}',
               comments = '{exp_sale_json['comments']}', updated_by = '{exp_sale_json['updated_by']}',
               updated_on = now() where sale_expense_id = '{sale_expense_id}' '''
    msg = f'''daily_sale_expense updated !!! '''
    msg_json = {}
    try:
        engine = db_engine()
        with engine.begin() as con:
            con.execute(sql)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to update daily_sale_expense !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json



def delete_daily_sale_expense(exp_sale_json):
    sale_expense_id = exp_sale_json['sale_expense_id']
    log.info(f'delete_daily_sale_expense for sale_expense_id: {sale_expense_id}')
    sql = f''' UPDATE {DB_SCHEMA}.daily_sale_expense set deleted='Y', updated_by = '{exp_sale_json['updated_by']}',
               updated_on = now() where sale_expense_id = '{sale_expense_id}' '''
    msg = f'''daily_sale_expense deleted !!! '''
    msg_json = {}
    try:
        engine = db_engine()
        with engine.begin() as con:
            con.execute(sql)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to delete daily_sale_expense !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json
