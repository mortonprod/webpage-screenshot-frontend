import css from '../css/index.css';
require('../../index.html');
import image from '../images/suit.jpg';
import video from '../images/clown.mp4';
var TRANSFORM_DOMAIN="https://apipagemelt-prod.alexandermorton.co.uk";
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
  var url = $('#form input').val();
  if(!/https:\/\//.test(url) && !/http:\/\//.test(url)){
    url = 'https://' + url;
  }
  $( "#form button" ).html( "<span class=\"spinner-grow spinner-grow-sm\" role=\"status\" aria-hidden=\"true\"></span>");
  $("#form button").prop('disabled', true);
  console.log(url);
  var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  var vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  $.get( `${TRANSFORM_DOMAIN}/?url=${url}&vw=${vw}&vh=${vh}`)
  .done( function(data) {
    sessionStorage.setItem('image', `${data.url}`)
    window.location.assign(`https://${window.location.hostname}/canvas.html`);
  })
  .fail(function() {
    $( "#form > button" ).html( "Submit");
    $("#form > button").prop('disabled', false);
    $("#form").append( "<div class=\"alert alert-danger alert-dismissible fade show\" role=\"alert\"> Something went wrong with that domain. Try another... <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"> <span aria-hidden=\"true\">&times;</span> </button> </div>");
    // $( ".close" ).click(function() {
    //   $( "#form > button" ).html( "Submit");
    //   $("#form > button").prop('disabled', false);
    // })
  });
});