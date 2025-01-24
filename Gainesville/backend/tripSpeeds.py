import pandas as pd
import geopandas as gpd
import matplotlib.pyplot as plt


file_path = r'/Users/ksushi/Documents/gnv_data/gnv_data.xlsx'
gtfs_rt_data = pd.read_excel(file_path)
# drop duplicate
gtfs_rt_data = gtfs_rt_data.drop('Unnamed: 0', axis=1, errors='ignore')
gtfs_rt_data = gtfs_rt_data.drop_duplicates(keep = 'first', ignore_index=True)

# choose columns
gtfs_rt_data = gtfs_rt_data[['vid', 'tmstmp', 'lat', 'lon', 'pid', 'rt', 'des', 'pdist', 'spd', 'tatripid', 'stsd']]
geo_gtfs_rt_data = gpd.GeoDataFrame(data=gtfs_rt_data,
                                    geometry=gpd.points_from_xy(gtfs_rt_data['lon'], gtfs_rt_data['lat']),
                                    crs='EPSG:4326').to_crs('EPSG:3857')

# change into python.datetime
geo_gtfs_rt_data['tmstmp'] = pd.to_datetime(geo_gtfs_rt_data['tmstmp'])

# sort values & reset index
geo_gtfs_rt_data = geo_gtfs_rt_data.sort_values(by='tmstmp', ascending=True)
geo_gtfs_rt_data = geo_gtfs_rt_data.reset_index(drop=True)

filtered_data = geo_gtfs_rt_data[geo_gtfs_rt_data['pid'] == 477]
# Load your GeoDataFrame (for example, containing some geographic data)
#gdf = gpd.read_file("/Applications/AMPPS/www/ontime/Gainesville/data/route.geojson")  # Adjust path as necessary
gdf = filtered_data
# Plotting the GeoDataFrame
fig, ax = plt.subplots(figsize=(10, 10))
gdf.plot(ax=ax, color='blue', edgecolor='black')

# Add title and labels
plt.title("GeoDataFrame Map")
plt.xlabel("Longitude")
plt.ylabel("Latitude")

# Show the plot
plt.show()
