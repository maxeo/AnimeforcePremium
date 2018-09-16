// ==UserScript==
// @name        Animeforce premium
// @description Permette di godere in maniera ottimale della piattaforma Animeforce, skippando alcune pagine intermedie e avendo il download diretto delle puntate
// @author Maxeo | maxeo.net
// @license https://creativecommons.org/licenses/by-sa/4.0/
// @include     http://www.animeforce.org/*
// @include     https://www.animeforce.org/*
// @homepageURL    https://greasyfork.org/it/scripts/25912-animeforce-premium
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @require https://greasyfork.org/scripts/26454-jquery-cookie/code/jQuery%20Cookie.user.js
// @version     1.11.7
// @grant       none
// @namespace https://greasyfork.org/users/88678
// @icon           https://www.maxeo.net/imgs/icon/greasyfork/animeforcePremium.png
// ==/UserScript==
        var AFPSettings = [], AFPFast = [];

//AFP_FastAction()
var removePopnsEvent=setInterval(function(){
  if(window.popns!=null){
    window.popns=null;
    removePopnsEvent=null;
  }
}, 100);

function importAPSettings() {
  APSettings['version'] = ($.cookie('version') != undefined) ? $.cookie('version') : '1'
}
function AFPshow(prop) {
  return decodeURIComponent($.cookie('AFPS_' + prop));
}
function AFPdef(prop) {
  return (AFPshow(prop) != undefined) ? true : false
}
function AFPsetDefault() {
  //interfaccia
  $.cookie('AFPS_new_home', true, {expires: 365, path: '/'});
  //Pagina dello streaming
  $.cookie('AFPS_show_title', true, {expires: 365, path: '/'});
  //generale
  $.cookie('AFPS_right_logo', false, {expires: 365, path: '/'});
  $.cookie('AFPS_background_def', '', {expires: 365, path: '/'});
  $.cookie('AFPS_background_video', '', {expires: 365, path: '/'});
  //Funzionalità premium
  $.cookie('AFPS_direct_download', true, {expires: 365, path: '/'});
  $.cookie('AFPS_direct_html5_video', true, {expires: 365, path: '/'});
  $.cookie('AFPS_direct_next_prev_streaming', true, {expires: 365, path: '/'});
  $.cookie('AFPS_version', 100, {expires: 365, path: '/'});
}




/*****  Definisco Le funzioni Generali  *****/
//contains incase sensitive
jQuery.expr[':'].icontains = function(a, i, m) {
  return jQuery(a).text().toUpperCase()
      .indexOf(m[3].toUpperCase()) >= 0;
};
//Verifico se l'url è valido
function isValidURL(url) {
  var RegExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  if (RegExp.test(url)) {
    return !0
  } else {
    return !1
  }
}
//Strpos di php
function searchIndex(str, searchValue, isCaseSensitive) {
  var modifiers = isCaseSensitive ? 'gi' : 'g';
  var regExpValue = new RegExp(searchValue, modifiers);
  var matches = [];
  var startIndex = 0;
  var arr = str.match(regExpValue);

  [].forEach.call(arr, function (element) {
    startIndex = str.indexOf(element, startIndex);
    matches.push(startIndex++);
  });

  return matches;
}
//Verifico se un elemento è nella view
function isScrolledIntoView(elem) {
  var docViewTop = $(window).scrollTop();
  var docViewBottom = docViewTop + $(window).height();
  var elemTop = $(elem).first().offset().top;
  var elemBottom = elemTop + $(elem).first().height();
  for (i = 0; i < $(elem).length; i++) {
    elemN = $(elem + ':eq(' + i + ')')
    elemTop = elemN.offset().top;
    elemBottom = elemTop + elemN.height();
    if ((elemBottom <= docViewBottom) && (elemTop >= docViewTop))
      return true;
  }
}

/*****  Funzioni di tipo 'DO'  *****/
//Home Page
function doHomepage() {
  function examineLink(){
    $('.article-excerpt a:not(.linkExaminated)').each(function(){
      var thisElem=$(this)
      var thisImg= thisElem.parents('.panel').find('div.article-image.darken > a')
      
      var originalLink=$(this).attr('href')
      var link=originalLink.replace(/episodi((-([0-9]*))*)-/,'').replace(/episodio-([0-9]*)-/,'').replace(/-ita-streaming/,'-ita-download-streaming').replace(/-fine\//, '/')
      if(!thisElem.find('img').length)
        $(this).append('&nbsp;&nbsp;<img style="height: 16px;" src="https://premium-menu.animeforce.maxeo.net/w8.png">')
      if(link==originalLink)
        link='/404';
      $.get(link,function(){
        thisElem.attr('href',link).addClass('linkExaminated')
        thisImg.attr('href',link)
        thisElem.find('img').attr('src',"https://premium-menu.animeforce.maxeo.net/ok.png")
      }).fail(function() {
          $.get(originalLink,function(data){
            var myRegexp=/<a href="(.*)" class="btn btn-medium btn-inverse/g;
            var newHref=myRegexp.exec(data)[1];
            thisElem.attr('href',newHref).addClass('linkExaminated').find('img').attr('src',"https://premium-menu.animeforce.maxeo.net/ni.png")
            thisImg.attr('href',newHref)
          })
      });
    })
  }
  function enableInfiniteScroll() {
    //prevengo che scarichi due volte la stessa pagina
    var scrolledpage = true;
    var pageNumber = 1;
    $('.pagination.pagination-normal').css('height', '30px').html('')
    if (isScrolledIntoView('.pagination.pagination-normal'))
      $('html,body').scrollTop(0);
    $(document).bind('scroll', function () {
      if (isScrolledIntoView('.pagination.pagination-normal')) {
        if (scrolledpage) {
          pageNumber++;
          $.post('//www.animeforce.org/wp-content/themes/flavor/functions/ajax.php', {
            'sorter': 'recent',
            'loop': 'main loop',
            'action': 'sort',
            'location': 'main loop',
            'view': 'grid',
            'columns': '3',
            'paginated': pageNumber,
            'currentquery[post_type][2]': 'post',
          }, function () {
            scrolledpage = 0;
          }, 'json').done(function (data) {
            var result = data;
            $('.main-loop-inner').append(result.content);
            
            examineLink()
            scrolledpage = true
          }).fail(function () {
            console.log('errore. non è stato possibile caricare la pagina o la pagina non esiste');
          })
        }
      }
    });
  }
  function executeSlideshow() {
    //settaggi per preparare lo slideshow
    var headerDisplay = $('#featured-bar-wrapper #featured-bar-shadow')
    var headerDisplay_small = headerDisplay.find('.featured-widgets')
    $('.slotholder img').css('opacity',1);
    $('#featured .tp-loader').remove();
    $('#featured-wrapper .tparrows').remove();
    $('#randompostswiththumbnails_widget-6').append($('#featured-bar-shadow .featured-widget.right #RandomPostsByWondermill_Widget').parent().html());
    $('#randompostswiththumbnails_widget-6 .header:eq(1)').remove()
    var headerDisplay_small_content = headerDisplay_small.children().eq(0).html();
    headerDisplay_small.remove()
    headerDisplay.find('.row .span7').removeClass('span7').addClass('span12');
    $('#featured ul').css('display', 'block').html('<center>' + $('#featured ul').html() + '</center>');
    $('#featured li').each(function () {
      $(this).html('<a href="' + $(this).attr('data-link') + '">' + $(this).html() + '</a>');
    });
    //$('.caption.randomrotate.title').css('display', 'ruby')
    $('#featured li img').css('position', 'relative').css('top', '-12px');
    $('#featured li').css('transition', 'all 0.5s linear 0s').css('transform', 'rotateY(90deg) rotateX(90deg)');
    //$('#featured li img').attr('width', 500).attr('height', '');
    $('#featured ul li').css('display', 'none').eq(0).css('display', 'block').css('transform', 'rotateX(0deg) rotateY(0deg)');
    //Eseguo lo slideshow
    var slideCount = -1;
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

    // ordinamento anime casuali 
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
    //
  }
  function hideshowMenu() {
    var hiddenableBox = $('.woocommerce div.container div.row div.span12 div#featured-bar-wrapper.solo div#featured-bar-shadow div.row div.span12').parent().parent().parent().parent();
    var hiddenableBoxH = 400;
    var hidenbuttonEnable = false;
    $('#sub-menu').html('<center><img src="https://i.imgur.com/kXGSEVq.png" style="height: 20px;transition: all 0.5s ease 0s;"></center>').css('cursor', 'pointer');
      
    $('#sub-menu.menu-inner').click(function () {
      if (hidenbuttonEnable) {
        if (hiddenableBox.height() > 10) {
          
          $('#sub-menu').img
          hiddenableBox.css('height', 0).css('opacity', 0);
          $('#sub-menu center img').css('transform','rotate(180deg)');
          $.cookie('AFPS_slideopen_status', 1, {expires: 365, path: '/'});
        } else {
          hiddenableBox.css('height', hiddenableBoxH + 'px').css('opacity', 1);
          $('#sub-menu center img').css('transform','none');
          $.cookie('AFPS_slideopen_status', 0, {expires: 365, path: '/'});
          ;
        }
      }
    })
    setTimeout(function () {
      hiddenableBoxH = hiddenableBox.height();
      hidenbuttonEnable = true;
      hiddenableBox.css('transition', '1s linear').css('height', hiddenableBoxH).children().css('height', hiddenableBoxH);
      if($.cookie('AFPS_slideopen_status')==1){
       hiddenableBox.css('height', 0).css('opacity', 0);
       $('#sub-menu center img').css('transform','rotate(180deg)');
    }
    }, 1000);
  }
  
  
  //Ricerca Rapida
  
  
  function cerca_parola(ricerca_questo) {
  $.post('//www.animeforce.org/wp-content/themes/flavor/functions/ajax.php', {
    'sorter': 'recent',
    'loop': 'main loop',
    'action': 'sort',
    'location': 'main loop',
    'view': 'grid',
    'columns': '3',
    'paginated': 1,
    'currentquery[s]': ricerca_questo,
  }, function () {
  }, 'json').done(function (data) {
    var html = data.content
    var immagini = html.match(/<img .*?src="(.*?)".*?title="(.*?)""/g)
    var indirizzi = html.match(/darken"><a.*?href="(.*?)".*?><img/g)
    var newData = {
      immagini: Array(),
      title: Array(),
      link: Array(),
    };
    for (var i = 0; i < immagini.length; i++) {
      var myRegExpImg = /<img .*?src="(.*?)"/g
      var myRegExpTitle = /<img .*?title="(.*?)"/g
      var myRegExpLink = /<a .*?href="(.*?)"/g
      newData.immagini.push(myRegExpImg.exec(immagini[i]) [1])
      newData.title.push(myRegExpTitle.exec(immagini[i]) [1])
      newData.link.push(myRegExpLink.exec(indirizzi[i]) [1])
    }
    console.log(newData)
    var positionBox = $('#searchform input').offset()
    var input_ricerca = $('#searchform input')
    if (!$('#box_di_ricerca').length) {
      console.log(positionBox)
      $('body').append('<div class="box-di-ricerca" id="box_di_ricerca"></div>')
    }
    $('#box_di_ricerca').css('width', input_ricerca.width()).css('top', (positionBox.top + 10 + input_ricerca.height()) + 'px').css('left', (positionBox.left + 10) + 'px').css('position', 'absolute').css('background', '#FFF').html('').css('z-index', 10000);
    for (var i = 0; i < newData.title.length; i++) {
      $('#box_di_ricerca').append('<a href="' + newData.link[i] + '"><img style="height:50px" src="' + newData.immagini[i] + '">' + newData.title[i] + '</a><br><br>')
    }
  })
}
$('#searchform input').attr('autocomplete','off').keyup(function () {
  cerca_parola($(this).val())
})
  
$('body').on('click','div',function(){
    if(!$(this).hasClass('box-di-ricerca')){
      $('#box_di_ricerca').remove();
    }
  })
  
  
  
  


  enableInfiniteScroll();
  executeSlideshow();
  hideshowMenu();
  examineLink();

}
//Anime Specifico
function doAnimeSpecifico() {
  $('.code-block.code-block-2').css('display', 'none') //Eliminazione elemento grafico
  //Abilito il download
  if (AFPshow('direct_download') != 'false') {
    $('img[src="/DDL/download.png"],img[src="//www.animeforce.org/DDL/download.png"]').addClass('download-button')
  }
  $('.download-button').attr('src', '//www.nvidia.it/docs/IO/151365/loader.gif')
  var counter = 0;
  var counter_end = $('.download-button').length;
  function getRealUrl(url, function_exec) {
    if (url[0] == '/'){
      url = window.location.protocol + url;
    }
    $.get('//url-redirect.maxeo.net/?url=' + encodeURI(url), function (data) {
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
  //Verifica url consono
  var str_url_download_correct=$('.download-button:eq(0)').parent().attr('href')
  if(typeof str_url_download_correct=='string' && str_url_download_correct.match(/^()\/\/j\.gs.*$/)){
    error_message='Adblock necessario per effettuare il download';
    $('.download-button').attr('src', '//i.imgur.com/LUULz1e.png').attr('title',error_message)
    console.log(error_message)
  }
  else
  recurseUrl();
}
//Tutte le pagine non di streaming
function doGeneralNotStreaming() {
  $('#sizzlin-wrapper,.widget-unwrapped').remove();
  if (AFPshow('hide_footer') == 'true')
    $('#footer-wrapper, #subfooter-wrapper').remove();
  $('#menu-menu-2 li ul li a').each(function(){
    $(this).attr('href',$(this).attr('href').replace(/^http:\/\/adf.ly\/[0-9]*\//g,''))
  })
  
  //Search in lista anime a-z
   if (window.location.pathname == '/lista-anime/') {
    src_input = '<input id="filtro" type="text" placeholder="Scrivi qui per cercare tra gli anime" style="width: 100%">'
    $('.the-content p').eq(0).append(src_input);
    $('#filtro').on('keyup', function () {
      if ($('#filtro').val().length >= 1) {
        $('.the-content h2').css('display', 'none');
        $('.the-content').find('li').each(function () {
          if ($(this).is(':icontains(\'' + $('#filtro').val() + '\')'))
          $(this).css('display', '');
           else
          $(this).css('display', 'none');
        });
      } else {
        $('.the-content li,.the-content h2').css('display', '');
      }
    });
  }
}
//Menu Premium
function doPremiumMenu() {
  $.get('https://premium-menu.animeforce.maxeo.net/form.html?2').done(function (data) {
    $('.content-wrapper .main-loop.sidebar-right ').html(data).css('height', 'auto')
            .parent().parent().parent().parent().find('.pagination').html('&nbsp;')
  })
}
//Pagina per il redirect alla pagina dell'anime
function doRedirectPage() {
  document.location.href = $('.the-content .btn.btn-medium.btn-inverse').prop('href');
}
//Pagina di Streaming
function doStreamingPage() {
  
  var Myreg= /(.*?)&ol=.*&s=ol/
  var resNewStream=Myreg.exec(document.location.href);
  if(resNewStream!=null)
    document.location.href=resNewStream[1]

  setInterval(function(){
      $( ":contains('Please disable your ad blocker!')[id]" ).remove()
  },500)


  function operazioniTitolo() {
    if (titolto_puntata != undefined) {
      titolto_puntata_link = titolto_puntata;
      titolto_puntata = titolto_puntata.split('/');
      titolto_puntata = titolto_puntata[titolto_puntata.length - 1].replace(/_/g, ' ').split('.') [0];
      if (AFPshow('show_title') == 'false')
        titolto_puntata = '';
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
  }
  var titolto_puntata
  $('body').attr('oncontextmenu', '');
  $('footer #wtf').remove()
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
              //Sostituzione video con componente html5
              if (AFPshow('direct_html5_video') == 'true') {
                iframeVideoElement.parent().html('<video controls><source src=\'' + dataUrl + '\' type=\'video/mp4\'>Your browser does not support HTML5 video.</video>');
              }
              $('a').each(function () {
                if (!$(this).parent().hasClass('lightsoffbtn'))
                  $(this).off()
              })
            }
          }
        })
      }
    })
  } else {
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


/*****  Funzioni di tipo 'IS'  *****/
function isHomepage() {
  return ($('#featured-bar-wrapper #featured-bar-shadow').is(':visible'))
}
function isAnimeSpecifico() {
  return $('table img[src$="/DDL/streaming.png"]').length
}
function isGeneralNotStreaming() {
  return $('body').attr('oncontextmenu') != 'return false;'
}
function isPremiumMenu() {
  return window.location.pathname == '/premium'
}
function isRedirectPage() {
  return $('.the-content .btn.btn-medium.btn-inverse').is(':visible')
}
function isStreamingPage() {
  return $('body').attr('oncontextmenu') == 'return false;'
}

/***** Subito ***/
//Generale
if (!AFPdef('version') || AFPshow('version') < 100) {
  AFPsetDefault();
} else {
}

//Tutte le pagine non di streaming
if (isGeneralNotStreaming()) {
  //Cambio background

  b_general_page = AFPshow('background_def');
  if (b_general_page.length) {
    if (isValidURL(b_general_page))
      b_general_page = 'url("' + b_general_page + '")'
    $('body').css("background", b_general_page)
  }
  //Aggiungo menu "premium"
  $('#menu-menu-2').append('<li class="menu-item"><a href="/premium">Menu Premium</a></li>');
  //Logo a destra se impostato
  (AFPshow('right_logo') == 'true') ? $('#logo').css('float', 'right') : $('#logo').css('float', 'left');
}
//Menu Premium
if (isPremiumMenu()) {
  $('title').text('Menu Premium - AnimeForce');
  $('.sortbar-title').remove();
  $('.content-wrapper .main-loop.sidebar-right ').html('')
}
//Pagina dello streaming
if (isStreamingPage()) {
  //Cambio background
  b_video_page = AFPshow('background_video');
  if (b_video_page.length) {
    if (isValidURL(b_video_page))
      b_video_page = 'url("' + b_video_page + '")'
    $('body').css("background", b_video_page)
  }
}


/*****  Aziono la funzione a seconda della pagina quando il doom è pronto  *****/
$(document).ready(function () {
//Home Page
  if (isHomepage()) {
    if (AFPshow('new_home') != 'false')
      doHomepage()
  }
  //Anime Specifico
  if (isAnimeSpecifico()) {
    doAnimeSpecifico()
  }
  //Tutte le pagine non di streaming
  if (isGeneralNotStreaming()) {
    doGeneralNotStreaming()
  }
  //Menu Premium
  if (isPremiumMenu()) {
    doPremiumMenu()
  }
  //Pagina per il redirect alla pagina dell'anime
  if (isRedirectPage()) {
    doRedirectPage()
  }
  //Pagina dello streaming
  if (isStreamingPage()) {
    doStreamingPage()
  }
})