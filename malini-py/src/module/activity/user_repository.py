# ********************************
# * Project : malini-py
# * File :  user_repository.py
# * Created by Malancha at 02/8/2021
# ********************************

import pandas as pd
import traceback

from src.config.db_config import db_engine
from src.config.log_config import log
from src.constants.app_const import *

def user_login(login_json):
    log.info('validate user login ....')
    user_name = login_json['user_name']
    user_pass = login_json['user_pass']
    msg = ''
    res_json = {'user_name':user_name}
    sql = f'''select cast(user_id as varchar) user_id from {DB_SCHEMA}.user_list 
              where deleted='N' and user_name= '{user_name}' and user_pass ='{user_pass}' '''
    engine = db_engine()
    user_df = pd.read_sql_query(con=engine, sql=sql)
    # print(f'***user_df : {user_df}')
    status = ERROR
    if user_df.empty:
        msg = f'''Incorrect user name or password for the user name [{user_name}] !!! '''
    else:
        try:
            user_id = user_df['user_id'].values[0]
            res_json['user_id'] = user_id

            # check role before login
            role_sql = f'''select role_name from {DB_SCHEMA}.user_role_map where deleted='N' and user_id='{user_id}' '''
            role_df = pd.read_sql_query(con=engine, sql=role_sql)
            if role_df.empty:
                msg = f'''User [{user_name}] does not have valid role !!!! '''
            else:

                # save login detail and generate login code
                with engine.begin() as con:
                    con.execute(f'''delete from {DB_SCHEMA}.log_in_detail where user_id='{user_id}' ''')
                    login_detail_json = {'user_id':user_id}
                    login_detail_df = pd.DataFrame([login_detail_json])
                    login_detail_df.to_sql('log_in_detail', con=con, schema=DB_SCHEMA, if_exists='append', index=False)
                    log.info(f'''Login code generated for user: {user_name}''')
                login_sql = f'''select cast(log_in_code as varchar) log_in_code from {DB_SCHEMA}.log_in_detail where user_id='{user_id}' '''
                login_code_df = pd.read_sql_query(sql=login_sql, con=engine)
                log_in_code = login_code_df['log_in_code'].values[0]
                res_json['log_in_code'] = log_in_code
                msg = f'User name [{user_name}] Login successful !!!'
                status = SUCCESS
        except Exception as e:
            msg = f'''Exception in storing login detail for user [{user_name}] !!! '''
            log.error(f'Failed to login for the user name: {user_name}...')
            traceback.print_exc()
        log.info(msg)

    res_json["message"] = msg
    res_json['status'] = status

    log.info(f"login res_json: {res_json}")
    return res_json

def allowed_to_do(user_id, log_in_code, role_list):
    log.info(f'''User [{user_id}], check allowed_to_do''')
    engine = db_engine()
    login_sql = f'''select cast(log_in_code as varchar) log_in_code from {DB_SCHEMA}.log_in_detail 
    where user_id='{user_id}' and log_in_code='{log_in_code}' '''
    login_code_df = pd.read_sql_query(sql=login_sql, con=engine)
    status = ERROR
    msg = f'''User [{user_id}] is allowed. '''
    allowed = False
    if login_code_df.empty:
        msg = f'''User [{user_id}] is not logged in !!!! '''
    else:
        role_sql = f'''select role_name from {DB_SCHEMA}.user_role_map where deleted='N' 
            and user_id='{user_id}' and role_name in ('{ "','".join(role_list)}') '''
        role_df = pd.read_sql_query(con=engine, sql=role_sql)
        if role_df.empty:
            msg = f'''User [{user_id}] does not have valid role !!!! '''
        else:
            allowed = True
            status = SUCCESS
    res_json = {'message': msg, 'allowed': allowed, 'status': status}
    log.info(f'allowed_to_do response : {res_json}')
    return res_json

def add_new_user(user_json):
    log.info(f'add_new_user....')
    user_name = user_json['user_name']
    msg = f'''User [{user_name}] added !!! '''
    msg_json = {}
    try:
        df = pd.DataFrame([user_json])
        engine = db_engine()
        df.to_sql('user_list', con=engine, schema=DB_SCHEMA, if_exists='append', index=False)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to add user [{user_name}] !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json

def add_new_role(role_json):
    log.info(f'add_new_user....')
    role_name = role_json['role_name']
    msg = f'''Role [{role_name}] added !!! '''
    msg_json = {}
    try:
        df = pd.DataFrame([role_json])
        engine = db_engine()
        df.to_sql('malini_roles', con=engine, schema=DB_SCHEMA, if_exists='append', index=False)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to add role [{role_name}] !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json

def add_user_activity(user_activity_json):
    log.info(f'add_user_activity....')
    user_name = user_activity_json['user_name']
    activity_type = user_activity_json['activity_type']
    msg = f'''Activity [{activity_type}] added !!! '''
    msg_json = {}
    try:
        df = pd.DataFrame([user_activity_json])
        engine = db_engine()
        df.to_sql('user_activity', con=engine, schema=DB_SCHEMA, if_exists='append', index=False)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to add activity [{activity_type}] !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json

def add_user_role_map(user_role_json):
    log.info(f'add_user_role_map....')
    role_name = user_role_json['role_name']
    msg = f'''Role [{role_name}] mapped !!! '''
    msg_json = {}
    try:
        df = pd.DataFrame([user_role_json])
        engine = db_engine()
        df.to_sql('user_role_map', con=engine, schema=DB_SCHEMA, if_exists='append', index=False)
        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to map role [{role_name}] !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json

# usr = {'user_name': 'Test', 'user_pass': 'test', 'created_by':'Auto'}
# add_new_user(usr)

# u_role = {'role_name':'update', 'created_by':'Auto'}
# add_new_role(u_role)
# u_role = {'role_name':'view', 'created_by':'Auto'}
# add_new_role(u_role)

# u_role_map = {'user_id': '1be64143-bb02-4748-b3ba-ebdf7ca72bbc', 'role_name':'update', 'created_by':'Auto'}
# add_user_role_map(u_role_map)

# login_json = {'user_name': 'Test', 'user_pass': 'test'}
# user_login(login_json)

# allowed_to_do('ad99431a-7071-4052-aa3c-d7dfcbcfc28a', '72b0f0f4-112c-4c00-91cf-231160f71f54', ['update'] )
