/*
 * Loading in a version of jQuery just for the bookmarklet is something I'd
 * like to avoid, so here I'm going to try to replicate all of the fuctionality
 * of the bookmarklet without jQuery.
 */

(function(){
	'use strict';
	// Get document head and create script tag to inject.
	var docHead = document.getElementsByTagName('head').item(0),
		jsonScript = document.createElement('script'),
		tweetArray = [];

	var getTweets = function(data) {
		var urlRegex = /(https?:\/\/[^\s]+)/g,
			tweetCount = data.length;
		for (var i = 0; i < tweetCount; i++) {
			// For all tweets, remove anything matching the URL and put the tweet in a new object along with
			// it's length. Then put that in the tweetArray.
			var tweetText = data[i].text.replace(urlRegex, '');
			var tweetObject = { text: tweetText, length: tweetText.length };
			tweetArray.push( tweetObject );
		}
		horseE.init(tweetArray);
	};

	jsonScript.type = 'text/javascript';
	jsonScript.src = '//api.twitter.com/1/statuses/user_timeline.json?screen_name=horse_ebooks&count=200&callback=getTweets';

	docHead.appendChild(jsonScript);

	var horseE = {
		init: function(tweets) {
			this.tweets = tweets;
			this.cacheElements(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'a', 'div', 'span']);
			this.replaceText();
		},
		cacheElements: function(elements) {
			var elementsLength = elements.length;
			this.allElements = [];
			while(elementsLength--) {
				var nl = document.getElementsByTagName(elements[elementsLength]);
				for(var i = nl.length; i--; this.allElements.unshift(nl[i]));
			}
		},
		replaceText: function() {
			var eLength = this.allElements.length;
			for (var i = 0; i < eLength; i++) {
				var el = this.allElements[i];
				if (typeof el.text !== 'undefined') {
					var len = el.text.length;
					if ((len > 2) && (el.children.length === 0)) {
						//var replacementText = this.getReplacementTweet(len);
						//el.text = replacementText;
					}
				}
			}
		},
		checkLength: function(element) {
  			return element.length > 10;
		}
	}
	/*
	var horseEbookmarklet = {
		tweetArray: [],
		init: function() {
			this.getTweets();
		},
		getTweets: function() {
			// Pull tweets from twitter
			var that = this;
			$.getJSON('//api.twitter.com/1/statuses/user_timeline.json?screen_name=horse_ebooks&count=200&callback=?', function (data) {
				var urlRegex = /(https?:\/\/[^\s]+)/g;
				var tweetCount = data.length;
				for (var i = 0; i < tweetCount; i++) {
					// For all tweets, remove anything matching the URL and put the tweet in a new object along with
					// it's length. Then put that in the tweetArray.
					var tweetText = data[i].text.replace(urlRegex, '');
					var tweetObject = { text: tweetText, length: tweetText.length };
					that.tweetArray.push( tweetObject );
				}
				that.cacheElements();
				that.replaceText();
				that.replaceImages();
			});
		},
		cacheElements: function() {
			// Store all matching elements on the page
			this.textElements = $('p, h1, h2, h3, h4, h5, h6, li, a, div, span'),
			this.imgElements = $('img');
		},
		replaceImages: function() {
			this.imgElements.each(function() {
				// Store each image's width and height
				var w = $(this).width(),
					h = $(this).height();

				// Create a new div with that width and height, setting overflow to hidden.
				// Add the horse image to that div with 100% width and auto height
				var newImg = $(document.createElement('div')).css({
					width: w,
					height: h,
					overflow: 'hidden',
					position: 'relative'
				}).html('<img src="http://www.heyben.com/horse_ebookmarklet/img/horse_ebookmarklet.jpg" alt="horse_ebooks" style="position:absolute; top: 0; left:0;width: 100%; max-width: 100%; min-width: 100%; height: auto;" />');
				// Replace the images with that div/image
				$(this).replaceWith(newImg);
			});
		},
		replaceText: function() {
			var that = this;
			this.textElements.each(function() {
				// Get the length of the text in each item.
				var textLength = $(this).text().length;
				// Let's ignore elements with only 1 or 2 characters and elements with children
				if ((textLength > 2) && $(this).children().length === 0) {
					// Get replacement text
					var replacementText = that.getReplacementTweet(textLength);
					$(this).text(replacementText);
				}

			});
		},
		getReplacementTweet: function(length) {
			// If the text is less than 140 characters, return tweets where the length is within +/-4 characters
			if (length < 140) {
				this.greppedTweets = $.grep( this.tweetArray, function(n) {
					return (n.length > (length -4) && n.length < (length +4));
				});
			}
			// Otherwise if the text is longer than 140 characters, return one that's between 130 & 140 characters
			else {
				this.greppedTweets = $.grep( this.tweetArray, function(n) {
					return (n.length > 130 && n.length < 140);
				});
			}
			// Then from those pick one randomly
			var tweet = this.greppedTweets[Math.floor(Math.random()*this.greppedTweets.length)];
			// If it couldn't find a tweet of a similar size, don't return anything, otherwise return replacement text
			if (typeof tweet === 'undefined') {
				tweet = false;
			}
			return tweet.text;
		}
	};

	horseEbookmarklet.init();
	*/
});