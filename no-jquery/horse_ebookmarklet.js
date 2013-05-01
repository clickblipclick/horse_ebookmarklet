/*
 * Loading in a version of jQuery just for the bookmarklet is something I'd
 * like to avoid, so here I'm going to try to replicate all of the fuctionality
 * of the bookmarklet without jQuery.
 */

(function(){
	'use strict';

	// Define our callback for the Twitter API call
	window.getTweets = function(data) {
		var urlRegex = /(https?:\/\/[^\s]+)/g,
			tweetCount = data.length;
		for (var i = 0; i < tweetCount; i++) {
			// For all tweets, remove anything matching the URL and put the tweet in a new object along with
			// it's length. Then put that in the tweetArray.
			var tweetText = data[i].text.replace(urlRegex, '');
			//var tweetObject = { text: tweetText, length: tweetText.length };
			tweetArray.push( tweetText );
		}
		// Init the bookmarklet.
		horseE.init(tweetArray);
	};

	// Get document head and create script tag to inject.
	var docHead = document.getElementsByTagName('head').item(0),
		jsonScript = document.createElement('script'),
		tweetArray = [];

	// Append JSON to page which calls getTweets callback.
	jsonScript.type = 'text/javascript';
	jsonScript.src = '//api.twitter.com/1/statuses/user_timeline.json?screen_name=horse_ebooks&count=200&callback=getTweets';

	docHead.appendChild(jsonScript);

	var horseE = {
		init: function(tweets) {
			this.tweets = tweets;
			this.allElements = this.cacheElements(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'a', 'div', 'span']);
			this.allImages = this.cacheElements(['img']);
			this.replaceText();
			this.replaceImages();
		},
		cacheElements: function(elements) {
			// Takes an array of element tags, returns all matching elements 
			var elementsLength = elements.length;
			var allElements = [];
			while(elementsLength--) {
				var nl = document.getElementsByTagName(elements[elementsLength]);
				// Combines nodelists to array
				for(var i = nl.length; i--; allElements.unshift(nl[i])){};
			}
			return allElements;
		},
		replaceText: function() {
			var eLength = this.allElements.length;
			for (var i = 0; i < eLength; i++) {
				var el = this.allElements[i];
				if (typeof el.innerHTML !== 'undefined') {
					var len = el.innerHTML.length;
					// For any element with no children that has text length of greater than 4, replace it
					if ((len > 4) && (el.children.length === 0)) {
						var eligibleTweets = this.tweets.filter(this.checkLength(len));
						el.innerHTML = eligibleTweets[Math.floor(Math.random() * eligibleTweets.length)];
					}
				}
			}
		},
		replaceImages: function() {
			var eLength = this.allImages.length;
			for (var i = 0; i < eLength; i++) {
				var el = this.allImages[i];
				if ((el.width > 15) && (el.height > 15)){
					// Get element's height, width and classes.
					var w = el.width;
					var h = el.height;
					var elClass = el.className;

					// Create div to replace image with correct height, width, classes.
					var newDiv = document.createElement('div');
					newDiv.className = elClass;
					newDiv.style.width = w + 'px';
					newDiv.style.height = h + 'px';
					newDiv.style.overflow = 'hidden';


					var newImg = document.createElement('img');
					// Give image the source and make it 100% width
					newImg.src = 'http://www.heyben.com/horse_ebookmarklet/img/horse_ebookmarklet.jpg';
					newImg.style.width = '100%';
					newImg.style.height = 'auto';

					// Append our new elements
					el.parentNode.replaceChild(newDiv, el);
					newDiv.appendChild(newImg);
				}
			}
		},
		checkLength: function(len) {
			if (len > 136) { len = 136; }
			return function(element) {
				return element.length >= (len - 4) && element.length <= (len + 4);
			};
		}
	};

})();