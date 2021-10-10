# ********************************
# * Project : malini-py
# * File :  daily_sale_expense_repository.py
# * Created by Malancha at 19/7/2021
# ********************************

import traceback
from datetime import datetime
import pandas as pd
import numpy as np

from src.config.db_config import db_engine
from src.config.log_config import log
from src.constants.app_const import *


dt = datetime.strptime('2021-09-10', "%Y-%m-%d")
print(f'***Month: {dt.month}')

def daily_sale_expenses(input={}):
    log.info('find daily_sale_expenses....')
    from_date = input['from_date']
    to_date = input['to_date']
    date_range_type = input['dateRangeType']

    engine = db_engine()
    # , to_char(sale_date,'DD-Mon-YYYY') sale_exp_date_str

    sale_sql = sale_date_range_query(date_range_type, from_date, to_date)
    # print(f'***sale_sql: {sale_sql}')
    sale_df = pd.read_sql(con=engine, sql=sale_sql)
    log.info(f'No of Sale rows: {sale_df.shape[0]}')
    total_sale = sale_df['total_cash_sale'].sum()

    # to_char(e.expense_date,'DD-Mon-YYYY') sale_exp_date_str,
    exp_sql = expense_date_range_query(date_range_type, from_date, to_date)
    # print(f'***exp_sql: {exp_sql}')
    exp_df = pd.read_sql(con=engine, sql=exp_sql)
    log.info(f'No of expense rows: {exp_df.shape[0]}')
    total_exp = exp_df['total_expense'].sum()

    total_profit = total_sale - total_exp
    total = {'total_sale': total_sale, 'total_expense': total_exp, 'total_profit': total_profit }
    log.info(f'''daily_sale_expenses :: [{from_date} to {to_date}] - total_sale: {total_sale}, total_expense: {total_exp}, total_profit: {total_profit} !!! ''')

    df = get_sale_exp_df(sale_df, exp_df, 'sale_exp_date')
    df['profit'] = df['total_cash_sale'] - df['total_expense']

    sale_expense_rows = df.to_dict(orient="records")

    rs_json = {'sale_expense_rows': sale_expense_rows, 'total': total}
    return rs_json

def sale_date_range_query(date_range_type, from_date, to_date):
    sale_sql = f''' SELECT sale_date  sale_exp_date, sum(cash_sale_amount) total_cash_sale 
                    FROM {DB_SCHEMA}.daily_sales  
                    where deleted = 'N' and sale_date >= '{from_date}' and sale_date <= '{to_date}' 
                    group by sale_date order by sale_date '''
    if date_range_type == 'Monthly':
        from_month = datetime.strptime(from_date, "%Y-%m-%d").month
        to_month = datetime.strptime(to_date, "%Y-%m-%d").month
        sale_sql = f''' SELECT extract(month from sale_date) sale_exp_date, sum(cash_sale_amount) total_cash_sale 
                            FROM {DB_SCHEMA}.daily_sales  
                            where deleted = 'N' and extract(month from sale_date) >= '{from_month}' 
                            and extract(month from sale_date) <= '{to_month}' 
                            group by extract(month from sale_date) order by extract(month from sale_date) '''
    elif date_range_type == 'Yearly':
        from_year = datetime.strptime(from_date, "%Y-%m-%d").year
        to_year = datetime.strptime(to_date, "%Y-%m-%d").year
        sale_sql = f''' SELECT extract(year from sale_date) sale_exp_date, sum(cash_sale_amount) total_cash_sale 
                                    FROM {DB_SCHEMA}.daily_sales  
                                    where deleted = 'N' and extract(year from sale_date) >= '{from_year}' 
                                    and extract(year from sale_date) <= '{to_year}' 
                                    group by extract(year from sale_date) order by extract(year from sale_date) '''
    return sale_sql



def expense_date_range_query(date_range_type, from_date, to_date):
    expense_sql = f''' SELECT expense_date  sale_exp_date, sum(expense_amt) total_expense 
                    FROM {DB_SCHEMA}.daily_expenses  
                    where deleted = 'N' and expense_date >= '{from_date}' and expense_date <= '{to_date}' 
                    group by expense_date order by expense_date '''
    if date_range_type == 'Monthly':
        from_month = datetime.strptime(from_date, "%Y-%m-%d").month
        to_month = datetime.strptime(to_date, "%Y-%m-%d").month
        expense_sql = f''' SELECT extract(month from expense_date) sale_exp_date, sum(expense_amt) total_expense 
                            FROM {DB_SCHEMA}.daily_expenses  
                            where deleted = 'N' and extract(month from expense_date) >= '{from_month}' 
                            and extract(month from expense_date) <= '{to_month}' 
                            group by extract(month from expense_date) order by extract(month from expense_date) '''
    elif date_range_type == 'Yearly':
        from_year = datetime.strptime(from_date, "%Y-%m-%d").year
        to_year = datetime.strptime(to_date, "%Y-%m-%d").year
        expense_sql = f''' SELECT extract(year from expense_date) sale_exp_date, sum(expense_amt) total_expense 
                                    FROM {DB_SCHEMA}.daily_expenses  
                                    where deleted = 'N' and extract(year from expense_date) >= '{from_year}' 
                                    and extract(year from expense_date) <= '{to_year}' 
                                    group by extract(year from expense_date) order by extract(year from expense_date) '''
    return expense_sql



def sale_expense_dashboard_data(input={}):
    log.info('find sale_expense_dashboard_data....')

    engine = db_engine()

    last_15_days_sale_sql = f''' SELECT to_char(sale_date,'DD-Mon-YYYY') sale_exp_date_str, sum(cash_sale_amount) total_cash_sale 
                    FROM {DB_SCHEMA}.daily_sales  
                    where deleted = 'N' and sale_date >= (sale_date -15)
                    group by sale_date order by sale_date '''
    last_15_days_sale_df = pd.read_sql(con=engine, sql=last_15_days_sale_sql)

    last_15_days_exp_sql = f'''select to_char(expense_date,'DD-Mon-YYYY') sale_exp_date_str, sum(expense_amt) total_expense
                    FROM {DB_SCHEMA}.daily_expenses 
                    where deleted = 'N' and expense_date >= (expense_date -15)
                    group by expense_date order by expense_date '''
    last_15_days_exp_df = pd.read_sql(con=engine, sql=last_15_days_exp_sql)
    last_15_days_df = get_sale_exp_df(last_15_days_sale_df,last_15_days_exp_df, 'sale_exp_date_str')
    # print('****last_15_days_exp_df:::', last_15_days_exp_df)
    daily = last_15_days_df.to_dict(orient="records")

    weekly_sale_sql = f''' SELECT extract(week from sale_date) week_no, sum(cash_sale_amount) total_cash_sale 
                        FROM {DB_SCHEMA}.daily_sales  
                        where deleted = 'N' and sale_date >= (sale_date -31)
                        group by extract(week from sale_date) order by extract(week from sale_date) '''
    weekly_sale_df = pd.read_sql(con=engine, sql=weekly_sale_sql)
    weekly_exp_sql = f''' SELECT extract(week from expense_date) week_no, sum(expense_amt) total_expense 
                            FROM {DB_SCHEMA}.daily_expenses  
                            where deleted = 'N' and expense_date >= (expense_date -31)
                            group by extract(week from expense_date) order by extract(week from expense_date) '''
    weekly_exp_df = pd.read_sql(con=engine, sql=weekly_exp_sql)
    merge_by_col = 'week_no'
    weekly_df = get_sale_exp_df(weekly_sale_df, weekly_exp_df, merge_by_col)
    weekly_df[merge_by_col] = weekly_df[merge_by_col].astype(int)
    # print('****weekly_df:::',weekly_df)
    weekly = weekly_df.to_dict(orient="records")

    monthly_sale_sql = f''' SELECT extract(month from sale_date) month_no, sum(cash_sale_amount) total_cash_sale 
                            FROM {DB_SCHEMA}.daily_sales  
                            where deleted = 'N' and sale_date >= (sale_date -190)
                            group by extract(month from sale_date) order by extract(month from sale_date) '''
    monthly_sale_df = pd.read_sql(con=engine, sql=monthly_sale_sql)
    monthly_exp_sql = f''' SELECT extract(month from expense_date) month_no, sum(expense_amt) total_expense 
                                FROM {DB_SCHEMA}.daily_expenses  
                                where deleted = 'N' and expense_date >= (expense_date -190)
                                group by extract(month from expense_date) order by extract(month from expense_date) '''
    monthly_exp_df = pd.read_sql(con=engine, sql=monthly_exp_sql)
    merge_by_col = 'month_no'
    monthly_df = get_sale_exp_df(monthly_sale_df, monthly_exp_df, merge_by_col)
    monthly_df[merge_by_col] = monthly_df[merge_by_col].astype(int)
    # print('****monthly_df:::', monthly_df)
    monthly = monthly_df.to_dict(orient="records")

    rs_json = {'daily': daily, 'weekly':weekly, 'monthly':monthly }
    return rs_json

def get_sale_exp_df(sale_df, exp_df, merge_by_col):
    df = pd.merge(sale_df, exp_df, on=merge_by_col, how='outer')
    log.info(f'No of sale expense rows: {df.shape[0]}')
    df[['total_cash_sale', 'total_expense']] = df[['total_cash_sale', 'total_expense']].replace(np.nan, 0)
    df['id'] = df[merge_by_col]
    return df

def add_daily_sale_expense(exp_sale_json):
    log.info(f'add_daily_sale_expense....{exp_sale_json}')
    msg = f'''daily sale expense added !!! '''
    msg_json = {}
    try:
        created_by = exp_sale_json['created_by']
        sale_expense_date = exp_sale_json['sale_expense_date']
        comments = exp_sale_json['comments']
        sale_json = {'cash_sale_amount': exp_sale_json['cash_sale_amount'], 'sale_date': sale_expense_date, 'created_by': created_by,'comments':comments}
        sale_df = pd.DataFrame([sale_json])

        expense_arr = exp_sale_json['expense_arr']
        exp_rows = []
        for each_exp in expense_arr:
            exp_rows.append({'expense_date': sale_expense_date,
                             'comments': comments,
                             'created_by': created_by,
                             'expense_type_id': each_exp['expense_type_id'],
                             'expense_amt': each_exp['expense_amt']})

        exp_df = pd.DataFrame(exp_rows)

        engine = db_engine()
        with engine.begin() as con:
            sale_df.to_sql('daily_sales', con=con, schema=DB_SCHEMA, if_exists='append', index=False)
            exp_df.to_sql('daily_expenses', con=con, schema=DB_SCHEMA, if_exists='append', index=False)

        msg_json['status'] = SUCCESS
    except Exception as ex:
        msg_json['status'] = ERROR
        msg = f'''Failed to add daily_sale and expenses !!! '''
        traceback.print_exc()
    log.info(msg)
    msg_json["message"] = msg
    return msg_json
