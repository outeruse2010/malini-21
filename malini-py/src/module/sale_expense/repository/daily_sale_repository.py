# ********************************
# * Project : malini-py
# * File :  daily_sale_repository.py
# * Created by Malancha at 19/9/2021
# ********************************
import traceback

import pandas as pd

from src.config.db_config import db_engine
from src.config.log_config import log
from src.constants.app_const import *

def fetch_daily_sales(input={}):
    log.info('find daily_sales....')
    engine = db_engine()
    sql = f''' SELECT cast(se.sale_id as varchar) sale_id, cast(se.sale_id as varchar) id, 
                se.cash_sale_amount, se.sale_date, to_char(se.sale_date,'DD-Mon-YYYY') sale_date_str,
                se."comments", se.created_on, se.created_by, se.updated_on, se.updated_by, se.deleted
                FROM {DB_SCHEMA}.daily_sales se
                where se.deleted = 'N' order by se.sale_date desc '''

    df = pd.read_sql(con=engine, sql=sql)
    log.info(f'daily_sales no of rows selected : {df.shape[0]}')
    rs_json = df.to_json(orient="records")
    return rs_json

def add_daily_sales(sale_json):
    log.info(f'add_daily_sales....')
    msg = f'''daily sale expense added !!! '''
    msg_json = {}
    try:
        df = pd.DataFrame([sale_json])
        engine = db_engine()
        df.to_sql('daily_sales', con=engine, schema=DB_SCHEMA, if_exists='append', index=False)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to add daily_sales !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json


def update_daily_sales(sale_json):
    sale_id = sale_json['sale_id']
    log.info(f'update_daily_sales for sale_id: {sale_id}')
    sql = f''' UPDATE {DB_SCHEMA}.daily_sales set cash_sale_amount = '{sale_json['cash_sale_amount']}', 
               sale_date = '{sale_json['sale_date']}',
               comments = '{sale_json['comments']}', updated_by = '{sale_json['updated_by']}',
               updated_on = now() where sale_id = '{sale_id}' '''
    msg = f'''daily_sales updated !!! '''
    msg_json = {}
    try:
        engine = db_engine()
        with engine.begin() as con:
            con.execute(sql)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to update daily_sales !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json



def delete_daily_sales(sale_json):
    sale_id = sale_json['sale_id']
    log.info(f'delete_daily_sales for sale_expense_id: {sale_id}')
    sql = f''' UPDATE {DB_SCHEMA}.daily_sales set deleted='Y', updated_by = '{sale_json['updated_by']}',
               updated_on = now() where sale_id = '{sale_id}' '''
    msg = f'''daily_sales deleted !!! '''
    msg_json = {}
    try:
        engine = db_engine()
        with engine.begin() as con:
            con.execute(sql)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to delete daily_sales !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json
