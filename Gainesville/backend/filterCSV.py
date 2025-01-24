import geopandas as gpd
import matplotlib.pyplot as plt

# Path to the shapefile (excluding file extensions)
geojson_file = '/Applications/AMPPS/www/ontime/miami_routes.geojson'
gdf = gpd.read_file(geojson_file)

# Plot the GeoDataFrame
gdf.plot()

# Add title and labels
plt.title('GeoJSON Data')
plt.xlabel('Longitude')
plt.ylabel('Latitude')

# Show the plot
plt.show()

