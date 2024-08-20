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

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="Garfield$1969",
  database="ontime"
)

mycursor = mydb.cursor()

list6=[]
keys=["QxNvqGVVVdD4k3LgZjUgEEDz3", "RrQJYQvn2PpvPCRUVQepQvMnc", "W3QZPYauJ33b94tM5e9SvuGci"]

def gatherData(num):
    nexttime = time.time()  # initializing
    url1='https://riderts.app/bustime/api/v3/getvehicles?key=' + keys[num] +'rt=1,2,3,5,6,7,8,9,10,11&tmres=s&format=json'
    # get route 12-33
    url2="https://riderts.app/bustime/api/v3/getvehicles?key=" + keys[num] + "&rt=12,13,15,16,17,20,23,25,26,33&tmres=s&format=json"
    # get route 34-122
    url3="https://riderts.app/bustime/api/v3/getvehicles?key=" + keys[num] + "&rt=34,35,37,38,43,46,75,711,119,122&tmres=s&format=json"
    # get route 125-600
    url4="https://riderts.app/bustime/api/v3/getvehicles?key=" + keys[num] + "&rt=125,126,127,150,600&tmres=s&format=json"
    for i in range(1): #may set to 100000 -> number of cycles
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
        #if list5:
        #    for v in list5:
        #        sql = "INSERT ignore INTO data (vid, rt, tmstmp, lat, lon, des, dly) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        #        val = (v['vid'], v['rt'], v['tmstmp'], v['lat'], v['lon'], v['des'], v['dly'])
        #        mycursor.execute(sql, val)
        #    mydb.commit()
        df.to_csv("data/realtime.csv",index=False,encoding='utf-8')

try:
    gatherData(0) #try key 1
except Exception:
    try: 
        gatherData(1) #try key 2
    except Exception:
        gatherData(2) #try key 3
    