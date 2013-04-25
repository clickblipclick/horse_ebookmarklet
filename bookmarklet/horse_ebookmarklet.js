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
		script.src = 'http://ajax.googleapis.com/ajax/libs/jquery/' + reqVersion + '/jquery.min.js';

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
		document.documentElement.childNodes[0].appendChild( script );
	}

})( window, document,

	// Minimum jQuery version required. Change this as-needed.
	'1.9.1',

	// Your jQuery code goes inside this callback. $ refers to the jQuery object,
	// and L is a boolean that indicates whether or not an external jQuery file
	// was just "L"oaded.
	function( $, L ) {
		'use strict';
		'$:nomunge, L:nomunge'; // Used by YUI compressor.

		var tweetArray = [];

		// Get JSON of last 200 Horse Tweets
		$.getJSON('http://api.twitter.com/1/statuses/user_timeline.json?screen_name=horse_ebooks&count=200&callback=?', function (data) {
			// Not super reliable but good enough regex to find URLs
			var urlRegex = /(https?:\/\/[^\s]+)/g;
			var tweetCount = data.length;
			for (var i = 0; i < tweetCount; i++) {
				tweetArray.push( data[i].text.replace(urlRegex, '') );
			}

		});

		// These are the elements we're looking for
		var elements = $('p, h1, h2, h3, h4, h5, h6, li, a, div, span');

		elements.each(function( index, element ) {
			// Let's ignore elements with text no greater
			console.log(element.text);
			if (typeof element.text !== 'undefined') {

				//console.log(element.text);
			}

		});


        //         $("p, h1, h2, h3, h4, h5, h6, li, a, div, span").each(function () {
        //             if (!(0 < $(this).children().length) || $(this).is("p")) {
        //                 var b = $(this).text().length;
        //                 if (5 < b) if ($(this).is("li, a, span")) {
        //                     var a = c[Math.floor(Math.random() * c.length)],
        //                         b = a.substring(0, 2 * b);
        //                     $(this).text(b)
        //                 } else a = c[Math.floor(Math.random() * c.length)], $(this).text(a)
        //             }
        //         });
        //         $("img").each(function () {
        //     var a = $(this).width(),
        //         b = $(this).height();
        //     1.8 > a / b && 0.4 < a / b ? ($(this).attr("src", "http://www.heyben.com/horse_ebookmarklet/img/horse_ebookmarklet.jpg"), $(this).width(a), $(this).height(b)) : ($(this).attr("src", "http://www.heyben.com/horse_ebookmarklet/img/horse_ebookmarklet.jpg"), $(this).width(a), b > a ? $(this).height(1.18 * a) : $(this).width(0.84 * b))
        // }
	}
);