import requests

url = "http://localhost:3000/spotify/recommendation?"

data = {
    "genres": "pop",
    "limit": 10,
    "speechiness": 0.1,
    "liveness": 0.3,
    "instrumentalness": 0.0,
    "energy": 0.7,
    "acousticness": 0.2,
    "danceability": 0.8,
}

response = requests.post(url, json=data)
print(response.json())

