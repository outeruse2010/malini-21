# ********************************
# * Project : malini-py
# * File :  daily_expense_repository.py
# * Created by Malancha at 19/9/2021
# ********************************
import traceback

import pandas as pd

from src.config.db_config import db_engine
from src.config.log_config import log
from src.constants.app_const import *

def fetch_daily_expenses(input={}):
    log.info('find daily_expenses....')
    engine = db_engine()
    sql = f''' SELECT cast(se.expense_id as varchar) expense_id, cast(se.expense_id as varchar) id, 
                    cast(se.expense_type_id as varchar) expense_type_id, e.exp_type,e.expense_name,
                    se.expense_amt, se.expense_date, to_char(se.expense_date,'DD-Mon-YYYY') expense_date_str,
                    se."comments", se.created_on, se.created_by, se.updated_on, se.updated_by, se.deleted
                    FROM {DB_SCHEMA}.daily_expenses se, {DB_SCHEMA}.expense_type e
                    where se.expense_type_id = e.expense_type_id and se.deleted = 'N' order by se.expense_date desc '''

    df = pd.read_sql(con=engine, sql=sql)
    log.info(f'daily_expenses no of rows selected : {df.shape[0]}')
    rs_json = df.to_json(orient="records")
    return rs_json

def add_daily_expenses(exp_json):
    log.info(f'add_daily_expenses....')
    msg = f'''daily expenses added !!! '''
    msg_json = {}
    try:
        expense_arr = exp_json['expense_arr']
        exp_rows = []
        for each_exp in expense_arr:
            exp_rows.append({'expense_date': exp_json['expense_date'],
                             'comments': exp_json['comments'],
                             'created_by': exp_json['created_by'],
                             'expense_type_id': each_exp['expense_type_id'],
                             'expense_amt': each_exp['expense_amt']})

        df = pd.DataFrame(exp_rows)
        engine = db_engine()
        df.to_sql('daily_expenses', con=engine, schema=DB_SCHEMA, if_exists='append', index=False)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to add daily_expenses !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json


def update_daily_expenses(exp_json):
    expense_id = exp_json['expense_id']
    log.info(f'update_daily_expenses for expense_id: {expense_id}')
    sql = f''' UPDATE {DB_SCHEMA}.daily_expenses set expense_type_id = '{exp_json['expense_type_id']}',
               expense_amt = '{exp_json['expense_amt']}',
               expense_date = '{exp_json['expense_date']}',
               comments = '{exp_json['comments']}', updated_by = '{exp_json['updated_by']}',
               updated_on = now() where expense_id = '{expense_id}' '''
    msg = f'''daily_expenses updated !!! '''
    msg_json = {}
    try:
        engine = db_engine()
        with engine.begin() as con:
            con.execute(sql)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to update daily_expenses !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json



def delete_daily_expenses(exp_json):
    expense_date = exp_json['expense_date']
    log.info(f'delete_daily_expenses for expense_date: {expense_date}')
    sql = f''' UPDATE {DB_SCHEMA}.daily_expenses set deleted='Y', updated_by = '{exp_json['updated_by']}',
               updated_on = now() where expense_date = '{expense_date}' '''
    msg = f'''daily_expenses deleted !!! '''
    msg_json = {}
    try:
        engine = db_engine()
        with engine.begin() as con:
            con.execute(sql)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to delete daily_expenses !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json
