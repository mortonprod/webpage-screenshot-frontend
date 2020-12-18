import css from '../css/index.css';
require('../../index.html');
import image from '../images/suit.jpg';
import video from '../images/clown.mp4';
var TRANSFORM_DOMAIN="https://vcxt1fzq20.execute-api.eu-west-2.amazonaws.com/dev";
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

$('#form').submit(function(event) {
  event.preventDefault();
  var input = $('#form input');
  $( "#form button" ).html( "<span class=\"spinner-grow spinner-grow-sm\" role=\"status\" aria-hidden=\"true\"></span>");
  $("#form button").prop('disabled', true);
  console.log(input.val());
  $.get( `${TRANSFORM_DOMAIN}/?url=${input.val()}`, function( data ) {
    window.location.replace(`${window.location.hostname}/canvas?url=${data.body.url}`);
  }).fail(function() {
    $( "#form button" ).html("");
    $("#form").append( "<div class=\"alert alert-danger alert-dismissible fade show\" role=\"alert\"> Something went wrong with that domain. Try another... <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"> <span aria-hidden=\"true\">&times;</span> </button> </div>");
    $( ".close" ).click(function() {
      $( "#form > button" ).html( "Submit");
      $("#form > button").prop('disabled', false);
    })
  });
});