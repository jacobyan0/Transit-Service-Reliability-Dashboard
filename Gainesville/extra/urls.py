#temporary script -> fixing issue of incorrect image urls for bus stops

import requests
import pandas as pd

def get_github_files(repo_owner, repo_name, folder_path, branch="main"):
    api_url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/git/trees/{branch}?recursive=1"
    headers = {"Accept": "application/vnd.github.v3+json"}
    response = requests.get(api_url, headers=headers)
    
    if response.status_code != 200:
        raise Exception(f"Failed to fetch repository contents: {response.status_code}")
    
    json_response = response.json()
    tree = json_response.get('tree', [])
    
    files = []
    is_first_row = True
    for item in tree:
        if item['type'] == 'blob' and item['path'].startswith(folder_path):
            if is_first_row:
                is_first_row = False
                continue
            file_path = item['path']
            file_name = file_path[len(folder_path):].lstrip('/')
            download_url = f"https://raw.githubusercontent.com/{repo_owner}/{repo_name}/{branch}/{file_path}"
            
            name_without_ext = file_name.rsplit('.', 1)[0]
            lat, lng = name_without_ext.rsplit(',', 1)
            
            files.append({"lat": f'"{lat}"', "lng": f'"{lng}"', "url": download_url})
    
    return files

def save_to_csv(files, csv_filename):
    df = pd.DataFrame(files)
    df.to_csv(csv_filename, index=False)

if __name__ == "__main__":
    repo_owner = "jacobyan0"
    repo_name = "Just-and-Green-Transportatiion-Lab"
    folder_path = "best_images"
    branch = "main"
    csv_filename = "github_files2.csv"

    files = get_github_files(repo_owner, repo_name, folder_path, branch)
    save_to_csv(files, csv_filename)

    print(f"File URLs and names have been saved to {csv_filename}")


