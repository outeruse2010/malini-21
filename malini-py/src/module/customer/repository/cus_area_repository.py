# ********************************
# * Project : malini-py
# * File :  cus_area_repository.py
# * Created by Malancha at 19/7/2021
# ********************************

import traceback

import pandas as pd

from src.config.db_config import db_engine
from src.config.log_config import log
from src.constants.app_const import *


def customer_areas(input={}):
    log.info('find customer_areas....')
    engine = db_engine()
    sql = f''' SELECT cast(area_id as varchar) id, cast(area_id as varchar) area_id, area_name, description, 
               created_on, created_by, updated_on, updated_by, deleted
               FROM {DB_SCHEMA}.cus_area 
               where deleted = 'N' order by created_on desc '''
    df = pd.read_sql(con=engine, sql=sql)
    log.info(f'customer_areas no of rows selected : {df.shape[0]}')
    rs_json = df.to_json(orient="records")
    return rs_json

def add_customer_area(cus_area_json):
    log.info(f'add_customer_area....{cus_area_json}')
    area_name = cus_area_json['area_name']
    msg = f'''Customer area [{area_name}] added !!! '''
    msg_json = {}
    try:
        df = pd.DataFrame([cus_area_json])
        engine = db_engine()
        df.to_sql('cus_area', con=engine, schema=DB_SCHEMA, if_exists='append', index=False)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to add customer area [{area_name}] !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json


def update_customer_area(cus_area_json):
    area_id = cus_area_json['area_id']
    area_name = cus_area_json['area_name']
    log.info(f'update_customer_area for area_id: {area_id}')
    sql = f''' UPDATE {DB_SCHEMA}.cus_area set area_name = '{area_name}', 
               description = '{cus_area_json['description']}', updated_by = '{cus_area_json['updated_by']}',
               updated_on = now() where area_id = '{area_id}' '''
    msg = f'''Customer area [{area_name}] updated !!! '''
    msg_json = {}
    try:
        engine = db_engine()
        with engine.begin() as con:
            con.execute(sql)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to updated customer area [{area_name}] !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json

def delete_customer_area(cus_area_json):
    area_id = cus_area_json['area_id']
    area_name = cus_area_json['area_name']
    log.info(f'delete_customer_area for area_id: {area_id}')
    sql = f''' UPDATE {DB_SCHEMA}.cus_area set deleted='Y', updated_by = '{cus_area_json['updated_by']}',
               updated_on = now() where area_id = '{area_id}' '''
    msg = f'''Customer area [{area_name}] deleted !!! '''
    msg_json = {}
    try:
        engine = db_engine()
        with engine.begin() as con:
            con.execute(sql)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to delete customer area [{area_name}] !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json


# cus_area_json = {"area_name": "Khatsara", "description": "Khatsara area", "created_by":"Auto"}
# add_customer_area(cus_area_json)
# cus_area_json = {"area_name": "Belia Danga", "description": "Belia Danga", "created_by":"Auto"}
# add_customer_area(cus_area_json)

# cus_area_json = {"area_name": "Khatsara", "description": "Khatsara area", "updated_by":"Auto",
#                  "area_id":"cb7fc2da-1a6b-4270-a522-49e6131d516d"}
# update_customer_area(cus_area_json)
#
# customer_areas()
