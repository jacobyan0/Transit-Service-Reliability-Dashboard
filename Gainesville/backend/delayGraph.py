import requests
import pandas as pd
import time
import os
import json
import csv
import datetime
from datetime import timedelta
from csv import writer
import collections

delays = collections.Counter()
with open('data/delays.csv') as delayfile:
    for row in csv.reader(delayfile, delimiter=','):
        delays[row[0][9:14]] += 1


with open('data/delaysByHour.csv', 'w') as csvfile: 
    csvwriter = csv.writer(csvfile) 
    start_date = datetime.datetime(2023, 7, 11, 10, 0, 0)
    for td in (start_date + timedelta(minutes=1*it) for it in range(660)):
        field = [td.strftime("%H:%M"), delays[td.strftime("%H:%M")]]
        csvwriter.writerow(field) 
