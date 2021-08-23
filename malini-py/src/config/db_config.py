# ********************************
# * Project : malini-py
# * File :  db_config.py
# * Created by Malancha at 19/7/2021
# ********************************

from os import path
import yaml
from sqlalchemy import create_engine


def db_config():
    db_dict = {}
    db_file = path.abspath(path.join(path.dirname(__file__), '..', 'resources', 'database.yaml'))
    # print(resource_file)
    with open(db_file, "r") as f:
        config_dict = yaml.load(f, Loader=yaml.FullLoader)
        db_dict = config_dict['postgresql']
        # print(f'***yaml dict: {db_dict}')
    return db_dict


def db_engine():
    db = db_config()
    # print(f'config: {config_dict}')
    con_url = f'''postgresql://{db['user']}:{db['password']}@{db['host']}:{db['port']}/{db['database']}'''
    engine = create_engine(con_url)
    # print(f'engine: {engine}')
    return engine

