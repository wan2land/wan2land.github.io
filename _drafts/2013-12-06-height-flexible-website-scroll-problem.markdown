---
layout: post
title: Height Flexible Website, Scroll Problem
---
Prefrerence : [Sitedrop](http://sitedrop.com/)

```prettyprint lang-javascript
$(document).ready(function() {

	var window_height = $(window).height();
	var $splash_0_holder = $('#splash_0_holder');
	var $splash_0 = $('#splash_0')
	var $fixed_panel = $('.fixed_panel');
	var $top_bar = $('#top_bar');
	var $panels = $('.panel');
	var $footer = $('#footer');
	var $splash_spacer = $('#splash_spacer');
	var narrow = false;

	var ua = navigator.userAgent;
	var iphone = ~ua.indexOf('iPhone') || ~ua.indexOf('iPod');
	var ipad = ~ua.indexOf('iPad');
	var ios = iphone || ipad;
	var android = ~ua.indexOf('Android');
	var disable_scroll = ios || android;

	if (disable_scroll) {
		$('body').addClass('mobile');
	}

	function page_adjustments() {

		window_width = $(window).width();
		window_height = $(window).height();
		panel_height = 540
		window_spacer = (window_height - panel_height)/2;

		if (window_height>758) {
			$splash_spacer.height(window_height);
		} else {
			$splash_spacer.height(758);
		}

		$('#learn_more').click(function() {
			first_panel = $('#panel_0').offset().top - window_spacer;
			$('html,body').stop().animate({
				scrollTop: first_panel
			}, 200)
		});

	}
	page_adjustments();

	function check_narrow() {
		if (window_width<960) {
			narrow = true;
		} else {
			narrow = false;
		}
	}
	check_narrow();

	$top_bar.click(function() {
		if ($(this).hasClass('active')) {
			$('html,body').stop().animate({
				scrollTop: 0
			}, 400);
		}
	})

	$panels.click(function() {
		if (!disable_scroll) {
			if ($(this).index()+1==$panels.length) {
				if ($(this).hasClass('active')) {
					var scroll_to = $(this).offset().top + 180;
				} else {
					var scroll_to = $(this).offset().top - window_spacer;
				}
			} else {
				if (scroll_top>($(this).offset().top-window_spacer-10)) {
					var scroll_to = $(this).next().offset().top - window_spacer;
				} else {
					var scroll_to = $(this).offset().top - window_spacer;
				}
			}
			$('html,body').stop().animate({
				scrollTop: scroll_to
			})
		}
	});

	$('#footer').click(function() {
		if (!disable_scroll) {
			var footer_expose = $panels.last().offset().top + 180;
			$('html,body').stop().animate({
				scrollTop: footer_expose
			});
		}
	})

	$(window).scroll(function() {
		scroll_top = $(window).scrollTop();
		if (!disable_scroll) {
			if (scroll_top>100) {
				$('#top_bar').addClass('active');
			}
			$panels.each(function() {
				$panel = $(this);
				if (scroll_top>($panel.position().top+window_height/3)) {
					$panel.addClass('active');
				} else {
					$panel.removeClass('active');
				}
			});
		}
	});

	$(window).resize(function() {
		if (!disable_scroll) {
			check_narrow();
			page_adjustments();
			$(window).trigger('scroll');
		}
	});
});
```
