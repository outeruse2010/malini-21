# ********************************
# * Project : malini-py
# * File :  log_config.py
# * Created by Malancha at 19/7/2021
# ********************************


import logging

def logger():
    log = logging.getLogger(__name__)
    if not log.hasHandlers():
        handler = logging.StreamHandler()
        formatter = logging.Formatter('''
        %(asctime)s %(levelname)s %(filename)s : %(funcName)s: %(lineno)d :: %(message)s
        ''')
        handler.setFormatter(formatter)
        log.addHandler(handler)
        log.setLevel(logging.INFO)
    return log

log = logger()