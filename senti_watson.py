import re
import tweepy
from tweepy import OAuthHandler
from textblob import TextBlob
import json
from watson_developer_cloud import NaturalLanguageUnderstandingV1
from watson_developer_cloud.natural_language_understanding_v1 \
  import Features, SentimentOptions




class TwitterClient(object):
	'''
	Generic Twitter Class for sentiment analysis.
	'''
	def __init__(self):
		'''
		Class constructor or initialization method.
		'''
		# keys and tokens from the Twitter Dev Console
		consumer_key = "H3l8vFiB3UidU6uy5h53meohu"
		consumer_secret = "sViYwc5Md5scOyaV4Sqr6URjY88tLzHG7fJox0dj6lAoJaoZXa"
		access_token = "956641182603411457-NyNWQKaFCx73fz7sbiyFydBLQP8eQS0"
		access_secret = "Jh9USoFO3OG2keTHYeGN8wuimEuI3uGwBB2bDDc85Urka"
 		self.natural_language_understanding = NaturalLanguageUnderstandingV1(
		  username='c2293356-d444-401a-a6a6-16c06a38d15e',
		  password='4MnxJkCyQy53',
		  version='2017-02-27')

		# attempt authentication
		try:
			# create OAuthHandler object
			self.auth = OAuthHandler(consumer_key, consumer_secret)
			print ("lol1")
			# create tweepy API object to fetch tweets
			self.api = tweepy.API(self.auth)
			print ("lol3")
			# set access token and secret
			self.auth.set_access_token(access_token, access_token_secret)
			print ("lol2")

			
		except:
			print("Error: Authentication Failed")
 
	def clean_tweet(self, tweet):
		'''
		Utility function to clean tweet text by removing links, special characters
		using simple regex statements.
		'''
		return ' '.join(re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)", " ", tweet).split())
 
	def get_tweet_sentiment(self, tweet):
		'''
		Utility function to classify sentiment of passed tweet
		using textblob's sentiment method
		'''

		# create TextBlob object of passed tweet text
		print tweet
		try:
			response = self.natural_language_understanding.analyze(
			  text=self.clean_tweet(tweet),
			  features=Features(
				sentiment=SentimentOptions(
				  )))
			print response["sentiment"]["document"]["label"]
			return response["sentiment"]["document"]["label"]
		except:
			return "neutral"
	def get_tweets(self, query, count = 10):
		'''
		Main function to fetch tweets and parse them.
		'''
		# empty list to store parsed tweets
		tweets = []
 
		try:
			# call twitter api to fetch tweets
			fetched_tweets = self.api.search(q = query, count = count)
 
			# parsing tweets one by one
			for tweet in fetched_tweets:
				# empty dictionary to store required params of a tweet
				parsed_tweet = {}
 
				# saving text of tweet
				parsed_tweet['text'] = tweet.text
				# saving sentiment of tweet
				parsed_tweet['sentiment'] = self.get_tweet_sentiment(tweet.text)
 
				# appending parsed tweet to tweets list
				if tweet.retweet_count > 0:
					# if tweet has retweets, ensure that it is appended only once
					if parsed_tweet not in tweets:
						tweets.append(parsed_tweet)
				else:
					tweets.append(parsed_tweet)
 
			# return parsed tweets
			return tweets
 
		except tweepy.TweepError as e:
			# print error (if any)
			print("Error : " + str(e))
 
def main():
	# creating object of TwitterClient Class
	api = TwitterClient()
	# calling function to get tweets
	
	tweets = api.get_tweets(query = 'bitcoin', count = 1000)
 
	# picking positive tweets from tweets
	ptweets = [tweet for tweet in tweets if tweet['sentiment'] == 'positive']
	# percentage of positive tweets
	print("Positive tweets percentage: {} %".format(100*len(ptweets)/len(tweets)))
	# picking negative tweets from tweets
	ntweets = [tweet for tweet in tweets if tweet['sentiment'] == 'negative']
	# percentage of negative tweets
	print("Negative tweets percentage: {} %".format(100*len(ntweets)/len(tweets)))
	# percentage of neutral tweets
	print("Neutral tweets percentage: {} %".format(100*(len(tweets) - len(ntweets) - len(ptweets))/len(tweets)))
 
	# printing first 5 positive tweets
	print("\n\nPositive tweets:")
	for tweet in ptweets[:10]:
		print(tweet['text'])
 
	# printing first 5 negative tweets
	print("\n\nNegative tweets:")
	for tweet in ntweets[:10]:
		print(tweet['text'])
 
if __name__ == "__main__":
	# calling main function
	main()

