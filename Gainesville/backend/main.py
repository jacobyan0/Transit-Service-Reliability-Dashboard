import requests
import pandas as pd
import time
import os
import csv
import mysql.connector 
import pymysql
from datetime import datetime
import pytz

tzone = pytz.timezone('America/New_York') 
nexttime = time.time()  # initializing
mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="mysql",
  database="ontime"
)

mycursor = mydb.cursor()

# switch to for i in range(2) to run finitely
# i=1
list6=[]
#get routes 1-11
url1='https://riderts.app/bustime/api/v3/getvehicles?key=QxNvqGVVVdD4k3LgZjUgEEDz3&rt=1,2,3,5,6,7,8,9,10,11&tmres=s&format=json'

# get route 12-33
url2="https://riderts.app/bustime/api/v3/getvehicles?key=QxNvqGVVVdD4k3LgZjUgEEDz3&rt=12,13,15,16,17,20,23,25,26,33&tmres=s&format=json"

# get route 34-122
url3="https://riderts.app/bustime/api/v3/getvehicles?key=QxNvqGVVVdD4k3LgZjUgEEDz3&rt=34,35,37,38,43,46,75,711,119,122&tmres=s&format=json"

# get route 125-600
url4="https://riderts.app/bustime/api/v3/getvehicles?key=QxNvqGVVVdD4k3LgZjUgEEDz3&rt=125,126,127,150,600&tmres=s&format=json"


for i in range(1000): #may set to 100000
    sesh = requests.Session()
    req1 = sesh.get(url1)
    list1=[]
    for i in req1.json()['bustime-response']:
        if i == "error":
            continue
        else:
            list1=req1.json()['bustime-response']['vehicle']
    req2 = sesh.get(url2)
    list2=[]
    for i in req2.json()['bustime-response']:
        if i == "error":
            continue
        else:
            list2=req2.json()['bustime-response']['vehicle']
    req3 = sesh.get(url3)
    list3=[]
    for i in req3.json()['bustime-response']:
        if i == "error":
            continue
        else:
            list3=req3.json()['bustime-response']['vehicle']
    req4 = sesh.get(url4)
    list4=[]
    for i in req4.json()['bustime-response']:
        if i == "error":
            continue
        else:
            list4=req4.json()['bustime-response']['vehicle']
    list5=list1+list2+list3+list4
    list6 = list5
    #extract the data every 15 sec
    nexttime += 15
    sleeptime = nexttime - time.time()
    if sleeptime > 0:
       time.sleep(sleeptime)
    df=pd.DataFrame(list6)
    if list6:
        for v in list6:
            sql = "INSERT ignore INTO data (vid, rt, tmstmp, lat, lon, des, dly) VALUES (%s, %s, %s, %s, %s, %s, %s)"
            val = (v['vid'], v['rt'], v['tmstmp'], v['lat'], v['lon'], v['des'], v['dly'])
            mycursor.execute(sql, val)
        mydb.commit()
    df.to_csv("data/realtime.csv",index=False,encoding='utf-8')