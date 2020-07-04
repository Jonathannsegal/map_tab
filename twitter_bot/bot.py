import tweepy
import wikipedia
import time
from keys import *

auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
auth.set_access_token(ACCESS_KEY, ACCESS_SECRET)
api = tweepy.API(auth)

FILE_NAME = 'last_seen_id.txt'

def retrieve_last_seen_id(file_name):
    f_read = open(file_name, 'r')
    last_seen_id = int(f_read.read().strip())
    
    return last_seen_id

def store_last_seen_id(last_seen_id, file_name):
    f_write = open(file_name, 'w')
    f_write.write(str(last_seen_id))
    f_write.close()
    return

def reply_to_tweets():
    print('retrieving and replying to tweets...', flush=True)
    last_seen_id = retrieve_last_seen_id(FILE_NAME)
    mentions = api.mentions_timeline(
                        last_seen_id,
                        tweet_mode='extended')
    for mention in reversed(mentions):
        try:
            print(str(mention.id) + ' - ' + mention.full_text, flush=True)
            hashtag = mention.entities.get('hashtags')[0].get('text').lower()
            last_seen_id = mention.id
            store_last_seen_id(last_seen_id, FILE_NAME)
            response = ''
            if len(wikipedia.summary(hashtag)) > 280:
                response = (wikipedia.summary(hashtag)[0:277] + "...")
            else:
                response = (wikipedia.summary(hashtag)[0:280])
            print(response)
            api.update_status(status = response, in_reply_to_status_id = mention.id , auto_populate_reply_metadata=True)
        except:
            last_seen_id = mention.id
            store_last_seen_id(last_seen_id, FILE_NAME)
            print("An exception occurred")

while True:
    reply_to_tweets()
    time.sleep(15)