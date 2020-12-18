import css from '../css/index.css';
require('../../index.html');
import image from '../images/suit.jpg';
import video from '../images/clown.mp4';
// TRANSFORM_DOMAIN="";
$(document).ready(function() {
  // var headerHeight = $('.navbar').outerHeight();
  $('#exploreButton a').click(function(e) {
    e.preventDefault();
    var targetHref = $(this).attr('href');
    var scrollTop = $(targetHref).offset().top
    $('html').animate({
      scrollTop
    }, 1000);
  });
  $('#logo a').click(function(e) {
    e.preventDefault();
    var targetHref = $(this).attr('href');
    var scrollTop = $(targetHref).offset().top
    $('html').animate({
      scrollTop
    }, 1000);
  });
});

$('form').submit(function() {
  var input = $('#form input');
  console.log(input.val());
});