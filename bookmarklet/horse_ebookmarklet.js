/*
 * jQuery Bookmarklet
 * via http://benalman.com/projects/run-jquery-code-bookmarklet/
 */

(function( window, document, reqVersion, callback, $, script, done, readystate ){
	'use strict';
	// If jQuery isn't loaded, or is a lower version than specified, load the
	// specified version and call the callback, otherwise just call the callback.
	if ( !($ = window.jQuery) || reqVersion > $.fn.jquery || callback( $ ) ) {
		// Create a script element.
		script = document.createElement( 'script' );
		script.type = 'text/javascript';

		// Load the specified jQuery from the Google AJAX API server (minified).
		script.src = '//ajax.googleapis.com/ajax/libs/jquery/' + reqVersion + '/jquery.min.js';

		// When the script is loaded, remove it, execute jQuery.noConflict( true )
		// on the newly-loaded jQuery (thus reverting any previous version to its
		// original state), and call the callback with the newly-loaded jQuery.
		script.onload = script.onreadystatechange = function() {
			if ( !done && ( !( readystate = this.readyState ) || readystate === 'loaded' || readystate === 'complete' ) ) {

				callback( ($ = window.jQuery).noConflict(1), done = 1 );

				$( script ).remove();
			}
		};

		// Add the script element to either the head or body, it doesn't matter.
		document.getElementsByTagName('head')[0].appendChild( script );
	}

})( window, document,

	// Minimum jQuery version required. Change this as-needed.
	'1.7.2',

	// Your jQuery code goes inside this callback. $ refers to the jQuery object,
	// and L is a boolean that indicates whether or not an external jQuery file
	// was just "L"oaded.
	function( $ ) {
		'use strict';

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
					}).html('<img src="//www.heyben.com/horse_ebookmarklet/img/horse_ebookmarklet.jpg" alt="horse_ebooks" style="position:absolute; top: 0; left:0;width: 100%; max-width: 100%; min-width: 100%; height: auto;" />');
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


	}
);