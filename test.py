import pandas as pd
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
client_credentials_manager = SpotifyClientCredentials(client_id='189f3d63cbec414bb7687355630d2fbb', client_secret='feb591e56cbf4acb9d9d936ac827e521')
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)


artist_name =[]
track_name = []
track_popularity =[]
artist_id =[]
track_id =[]
for i in range(0,1000,50):
    track_results = sp.search(q='artist:ed sh year:1980-2020', type='track', limit=50, offset=i)
    for i, t in enumerate(track_results['tracks']['items']):
        artist_name.append(t['artists'][0]['name'])
        artist_id.append(t['artists'][0]['id'])
        track_name.append(t['name'])
        track_id.append(t['id'])
        track_popularity.append(t['popularity'])
        
track_df = pd.DataFrame({'artist_name' : artist_name, 'track_name' : track_name, 'track_id' : track_id, 'track_popularity' : track_popularity, 'artist_id' : artist_id})
print(track_df.shape)
print(track_df.head())