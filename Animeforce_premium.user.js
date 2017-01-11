// ==UserScript==
// @name        Animeforce premium
// @description Permette di godere in maniera ottimale della piattaforma Animeforce, skippando alcune pagine intermedie e avendo il download diretto delle puntate
// @author Maxeo | maxeo.it
// @license https://creativecommons.org/licenses/by-sa/4.0/
// @include     http://www.animeforce.org/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @version     1.6.1
// @grant       none
// @namespace https://greasyfork.org/users/88678
// @icon           https://www.maxeo.net/imgs/icon/greasyfork/animeforcePremium.png
// ==/UserScript==
//Rimuovo l'apertura delle finestre
function NoOpen(e) {
  return 1
}
parent.open = NoOpen;
this.open = NoOpen;
window.open = NoOpen;
open = NoOpen;
window.open = function () {
  return;
}
open = function () {
  return;
}
this.open = function () {
  return;
}
parent.open = function () {
  return;
}//Verifico se l'url è valido

function isValidURL(url) {
  var RegExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  if (RegExp.test(url)) {
    return !0
  } else {
    return !1
  }
}
function UrlExistsReq(url, cb) {
  jQuery.ajax({
    url: url,
    dataType: 'text',
    type: 'GET',
    complete: function (xhr) {
      if (typeof cb === 'function')
      cb.apply(this, [
        xhr.status
      ]);
    }
  });
}
function UrlExists(link) {
  UrlExistsReq(link, function (status) {
    if (status === 200) {
      return true;
    } 
    else
    return false;
  });
}
$(document).ready(function () {
  //Home Page
  if ($('#featured-bar-wrapper #featured-bar-shadow').is(':visible')) {
    var headerDisplay = $('#featured-bar-wrapper #featured-bar-shadow')
    var headerDisplay_small = headerDisplay.find('.featured-widgets')
    $('#randompostswiththumbnails_widget-6').append($('#featured-bar-shadow .featured-widget.right #RandomPostsByWondermill_Widget').parent().html());
    $('#randompostswiththumbnails_widget-6 .header:eq(1)').remove()
    var headerDisplay_small_content = headerDisplay_small.children().eq(0).html();
    headerDisplay_small.remove()
    headerDisplay.find('.row .span7').removeClass('span7').addClass('span12');
    $('#featured ul').css('display', 'block').html('<center>' + $('#featured ul').html() + '</center>');
    $('#featured li').css('transition', 'all 0.5s linear 0s').css('transform', 'rotateY(90deg) rotateX(90deg)');
    //$('#featured li img').attr('width', 500).attr('height', '');
    $('#featured ul li').css('display', 'none').eq(0).css('display', 'block').css('transform', 'rotateX(0deg) rotateY(0deg)');
    /* Slide Home */
    function executeSlideshow() {
      var slideCount = - 1;
      var slideNext = 0;
      var slideCountLength = $('#featured li').length;
      setInterval(function () {
        slideCount = (slideCount + 1 < slideCountLength) ? slideCount + 1 : 0;
        slideNext = (slideCount + 1 < slideCountLength) ? slideCount + 1 : 0;
        $('#featured li:eq(' + slideCount + ')').css('transform', 'rotateY(90deg) rotateX(90deg)');
        setTimeout(function () {
          $('#featured li:eq(' + slideCount + ')').css('display', 'none')
          $('#featured li:eq(' + slideNext + ')').css('display', 'block')
          setTimeout(function () {
            $('#featured li:eq(' + slideNext + ')').css('transform', 'rotateY(0deg) rotateX(0deg)');
          }, 300);
        }, 501);
      }, 8000);
    }
    executeSlideshow(); //Eseguo la funzione
    /*******************/
    $('#featured-wrapper').css('border', 'none');
    $('.tp-bannertimer.tp-bottom').remove();
    $('#search-2').next('div').next('div').remove();
    $('#search-2').next('div').next('div').remove();
    $('#search-2').parent().append(headerDisplay_small_content);
    $('#randompostswiththumbnails_widget .header').css('text-align', 'center');
    elem = $('#randompostswiththumbnails_widget-6 div:not(.header)').eq(0);
    elem.html('<center>' + elem.html() + '</center>');
    elem = $('#randompostswiththumbnails_widget-6 div:not(.header)').eq(1);
    elem.html('<center>' + elem.html() + '</center>');
    elem = $('#sidebar .widget-unwrapped').html();
    $('#sidebar .widget-unwrapped').remove();
    $('#randompostswiththumbnails_widget-6').parent().append(elem);
    $('#footer-wrapper, #subfooter-wrapper').remove() //
    /* Menu a scomparsa */
    var hiddenableBox = $('.woocommerce div.container div.row div.span12 div#featured-bar-wrapper.solo div#featured-bar-shadow div.row div.span12').parent().parent().parent().parent();
    var hiddenableBoxH = 400;
    var hidenbuttonEnable = false;
    $('#sub-menu').html('<center><img src="http://bit.ly/2ic1tUp" style="height: 20px;"></center>').css('cursor', 'pointer');
    $('#sub-menu.menu-inner').click(function () {
      if (hidenbuttonEnable) {
        if (hiddenableBox.height() > 10) {
          hiddenableBox.css('height', 0).css('opacity', 0);
        } 
        else {
          hiddenableBox.css('height', hiddenableBoxH + 'px').css('opacity', 1);
          ;
        }
      }
    })
    setTimeout(function () {
      hiddenableBoxH = hiddenableBox.height();
      hidenbuttonEnable = true;
      hiddenableBox.css('transition', '1s linear').css('height', hiddenableBoxH);
    }, 1000);
    /********************/
    //
  } //
  //
  //Pagina Anime Specifico

  if ($('img[src="/DDL/streaming.png"]').length) {
    //Eliminazione elemento grafico
    $('.code-block.code-block-2').css('display', 'none')
    $('img[src="/DDL/download.png"]').addClass('download-button')
    $('.download-button').attr('src', 'http://www.nvidia.it/docs/IO/151365/loader.gif')
    var counter = 0;
    var counter_end = $('.download-button').length;
    function getRealUrl(url, function_exec) {
      if (url[0] == '/')
      url = window.location.protocol + '//' + window.location.hostname + url;
      $.get('http://url-redirect.maxeo.net/?url=' + encodeURI(url), function (data) {
        function_exec(data)
      });
    }
    function recurseUrl() {
      getRealUrl($('.download-button:eq(' + counter + ')').parent().attr('href'), function () {
        $.get(arguments[0] + '&s=alt', function (data) {
          var bodySplit = data.split('jwplayer(\'player_1\').setup(');
          if (bodySplit.length > 1) {
            dataUrl = bodySplit[1].split('"');
            dataUrl = dataUrl[1];
            if (isValidURL(dataUrl)) {
              $('.download-button:eq(' + counter + ')').parent().attr('href', dataUrl);
              $('.download-button:eq(' + counter + ')').attr('src', '/DDL/download.png')
            }
          }
          counter++
          if (counter < counter_end)
          recurseUrl()
        });
      })
    }
    recurseUrl();
  } //funzioni on document ready

  function operazioniTitolo() {
    if (titolto_puntata != undefined) {
      titolto_puntata_link = titolto_puntata;
      titolto_puntata = titolto_puntata.split('/');
      titolto_puntata = titolto_puntata[titolto_puntata.length - 1].replace(/_/g, ' ').split('.') [0];
      $('img[title=AnimeForce]').parent().next().html('<h1 style="color:#F80">' + titolto_puntata + '</h1>');
      numero_puntata = titolto_puntata.split(' Ep ') [1].split(' ') [0] * 1;
      puntata_successiva = ((numero_puntata + 1) / 10 >= 1) ? numero_puntata + 1 : '0' + (numero_puntata + 1)
      puntata_precedente = ((numero_puntata - 1) / 10 >= 1) ? numero_puntata - 1 : '0' + (numero_puntata - 1)
      var puntata_successiva_link_download = titolto_puntata_link.replace(/_Ep_[0-9]*_/gi, '_Ep_' + puntata_successiva + '_')
      var puntata_successiva_link = window.location.href.replace(/_Ep_[0-9]*_/gi, '_Ep_' + puntata_successiva + '_')
      var puntata_precedente_link_download = titolto_puntata_link.replace(/_Ep_[0-9]*_/gi, '_Ep_' + puntata_precedente + '_')
      var puntata_precedente_link = window.location.href.replace(/_Ep_[0-9]*_/gi, '_Ep_' + puntata_precedente + '_')
      var datalinks = ''
      datalinks += '<a href="' + puntata_precedente_link + '">Precedente</a>';
      datalinks += '<a href="' + puntata_successiva_link + '">Successiva</a>';
      $('#fb-root').append('<span class="button">' + datalinks + '</span>')
    } else {
      setTimeout(function () {
        operazioniTitolo()
      }, 200)
    }
  } //Catena per redirect

  if ($('.container .main-loop-content .main-content .the-content .btn.btn-medium.btn-inverse').is(':visible')) {
    document.location.href = $('.container .main-loop-content .main-content .the-content .btn.btn-medium.btn-inverse').prop('href')
  } 
  else {
    //se sono nella pagina di download/streaming
    if ($('body').attr('oncontextmenu') == 'return false;') {
      var titolto_puntata
      $('body').attr('oncontextmenu', '');
      //nel caso ci sia l'iframe per lo streaming
      if ($('.hero-unit iframe').attr('src') != undefined) {
        var iframeVideoElement = $('.hero-unit iframe');
        $('#wtf.button').append('<a target=\'_blank\' href=\'' + iframeVideoElement.attr('src') + '\'>Streaming Link</a>');
        $('a').each(function () {
          if (!$(this).parent().hasClass('lightsoffbtn'))
          $(this).off()
        })
        $('#wtf.button a').each(function () {
          if ($(this).html() == 'Streaming Alternativo') {
            $.get($(this).attr('href')).done(function (data) {
              var bodySplit = data.split('jwplayer(\'player_1\').setup(');
              if (bodySplit.length > 1) {
                dataUrl = bodySplit[1].split('"');
                dataUrl = dataUrl[1];
                if (isValidURL(dataUrl)) {
                  titolto_puntata = dataUrl;
                  $('#wtf.button').append('<a target=\'_blank\' href=\'' + dataUrl + '\'>Direct Download</a>');
                  iframeVideoElement.parent().html('<video controls><source src=\'' + dataUrl + '\' type=\'video/mp4\'>Your browser does not support HTML5 video.</video>');
                  $('a').each(function () {
                    if (!$(this).parent().hasClass('lightsoffbtn'))
                    $(this).off()
                  })
                }
              }
            })
          }
        })
      } 
      else {
        var bodySplit = $('body').html().split('jwplayer(\'player_1\').setup(');
        if (bodySplit.length > 1) {
          dataUrl = bodySplit[1].split('"');
          dataUrl = dataUrl[1];
          if (isValidURL(dataUrl)) {
            titolto_puntata = dataUrl;
            $('#wtf.button').append('<a target=\'_blank\' href=\'' + dataUrl + '\'>Direct Download</a>');
            $('a').each(function () {
              if (!$(this).parent().hasClass('lightsoffbtn'))
              $(this).off()
            })
          }
        } else {
          dataUrl = $('#video-player source').attr('src');
          titolto_puntata = dataUrl;
          $('#wtf.button').append('<a target=\'_blank\' href=\'' + dataUrl + '\'>Direct Download</a>');
          $('#video-player').unbind('click');
        }
      }
      operazioniTitolo();
    }
  }
})
