// ==UserScript==
// @name        Animeforce premium
// @description Permette di godere in maniera ottimale della piattaforma Animeforce, skippando alcune pagine intermedie e avendo il download diretto delle puntate
// @author Maxeo | maxeo.net
// @license https://creativecommons.org/licenses/by-sa/4.0/
// @include     http://*.animeforce.org/*
// @include     https://*.animeforce.org/*
// @homepageURL    https://greasyfork.org/it/scripts/25912-animeforce-premium
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @require https://greasyfork.org/scripts/26454-jquery-cookie/code/jQuery%20Cookie.user.js
// @version     2.2.0
// @grant       none
// @namespace https://greasyfork.org/users/88678
// @icon           https://www.maxeo.net/imgs/icon/greasyfork/animeforcePremium.png
// ==/UserScript==
function AFP_index() {
  var $ = jQuery;
  var AFPremium = {
    skeletron: {
      head: {
        enable: true
      },
      topheader: {
        enable: true
      },
      header: {
        enable: true
      },
      maincontent: {
        enable: true
      },
      leftcolumn: {
        enable: true
      },
      rightcolumn: {
        enable: true
      },
      footer: {
        enable: true
      }
    },
    pagetype: undefined,
    logs: 1,
    loadPageType: function () {
      if ($('body').hasClass('home')) {
        this.setPageType('home')
      } else
      if ($('body').hasClass('error404')) {
        if (window.location.pathname == '/premium') {
          this.setPageType('premium-menu')
        } else {
          this.setPageType('error404')
        }
      } else if (($('body').attr('class') == undefined || $('body').attr('class') == '') && $('#menu-menu-2').length == 0) {
        this.setPageType('streaming-page')
      } else if ($('body').hasClass('single-post')) {
        if ($('table img[src="/DDL/download.png"], table img[src="/DDL/streaming.png').length) {
          this.setPageType('episode-list')
        } else {
          this.setPageType('episode-preview')
        }
      } else if (document.location.pathname == '/lista-anime/' || window.location.pathname == '/lista-anime-in-corso/') {
        this.setPageType('lista-anime');
      } else if ($('body').hasClass('archive')) {
        this.setPageType('archive');
      } else if (document.location.pathname == '/lista-anime-hentai/') {
        this.setPageType('hentai');
      }

      return this.pagetype;
    },
    setPageType: function (pagename) {
      this.pagetype = pagename;
    },
    getPageType: function () {
      return this.pagetype;
    },
    executeFunctionality: function (funct_name) {
      for (var index in arguments) {
        this.functionalities[arguments[index]]();
      }
    },
    loadFunctionalities: function () {
      //funzionalità globali
      this.executeFunctionality('decreaseAD', 'miglioraUtilizzoMenu');


      //funzionalità specifiche
      switch (this.getPageType()) {
        case 'home':
          this.executeFunctionality('addPremiumMenu', 'premiumSearchHomePage');
          break;
        case 'premium-menu':
          this.executeFunctionality('addPremiumMenu');
          break;
        case 'episode-list':
          this.executeFunctionality('addPremiumMenu', 'removeAdflyInPageAnime', 'animeDownloadIstant');
          break;
        case 'episode-preview':
          this.executeFunctionality('addPremiumMenu');
          break;
        case 'lista-anime':
          this.executeFunctionality('addPremiumMenu', 'searchInList');
          break;
        case 'archive':
          this.executeFunctionality('addPremiumMenu', 'searchInList');
          break;
        case 'hentai':
          this.executeFunctionality('addPremiumMenu');
          break;
        case 'error404':
          this.executeFunctionality('addPremiumMenu');
          break;
        case 'streaming-page':
          this.executeFunctionality('dontBlocADblock');
          break;
        default:

      }
    },
    logAfp: function (data) {
      if (this.logs) {
        console.log(data);
      }
    },
    functionalities: {
      parent: function () {
        return AFPremium;
      },
      /*
       * Aggiunge il menu premium alle pagine
       */
      addPremiumMenu: function () {
        $('#menu-menu-2').append('<li class="menu-item"><a href="/premium">Menu Premium</a></li>')
      },
      decreaseAD: function () {
        /***  PAGINA DI STREAMING   ***/
        if (this.parent().getPageType() == 'streaming-page') {
          var disableFunction = setInterval(function () {
            if ($("body > center + *").length) {
              $('footer').remove();
              while ($("body > center + *").length) {
                $("body > center + *").remove();
              }
            }
          }, 300)

        } else {
          /***  PAGINE NON DI STREAMING   ***/
          $('[style^="position: fixed; top: 0px; bottom: 0px; left: 0px; right: 0px; z-index: 2147483647;"]')
                  .attr('style', "position:fixed;right:200vw")
                  .css('display', 'none')
          $('.tp-loader').remove()
          $('#menu-menu-2').on('mouseover', function () {
            $('#menu-menu-2 #menu-item-21035 .sub-menu')
                    .css('display', 'block')
                    .css('visibility', 'visible')
          })
          $('#menu-menu-2 a').each(function () {
            $(this).attr('href', $(this).attr('href').replace('//adf.ly/16031519', ''))
          })
          $('.widget-unwrapped iframe').parent().addClass('fb-container').removeClass('widget-unwrapped')
          $('.widget-unwrapped').remove()

        }
      },
      dontBlocADblock: function () {
        var disableFunction = setInterval(function () {
          if ($('[href="http://www.animeforce.org/block/guida.html"]').parents('[id]').length) {
            $('[href="http://www.animeforce.org/block/guida.html"]').parents('[id]').remove();
            clearInterval(disableFunction);
          }
        }, 300);

      },
      searchInList: function () {
        jQuery.expr[':'].icontains = function (a, i, m) {
          return jQuery(a).text().toUpperCase()
                  .indexOf(m[3].toUpperCase()) >= 0;
        };
        var src_input = '<input id="filtro" type="text" placeholder="Scrivi qui per cercare tra gli anime" style="width: 100%">'
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
      },
      miglioraUtilizzoMenu: function () {
        if (this.parent().getPageType() != 'streaming-page') {
          $('#menu-menu-2 .sub-menu').css('display', 'none')
          $('#menu-menu-2').on('mouseover', function () {
            $('#menu-menu-2 #menu-item-21035 .sub-menu').css('display', 'block').css('visibility', 'visible')
          })
          $('#menu-menu-2').on('mouseout', function () {
            $('#menu-menu-2 .sub-menu').css('display', 'none')
          })
        }
      },
      animeDownloadIstant: function () {
        $('body').append('<div class="w8-afp-download" style="position: fixed;right: 0;top: 0;background: rgba(0, 120, 255, 0.63);padding: 18px;z-index: 3000;color: #FFF;font-size: 20px;text-align: right;font-family: Verdana;">Analizzo la pagina per il download diretto.<br>Attendere...</div>')
        if ($('img[src="/DDL/download.png"]').length) {
          setTimeout(
                  function () {
                    var url = 'https:' + $('img[src="/DDL/download.png"]').eq(0).parent().attr('href');
                    $.get('//url-redirect.maxeo.net/?url=' + encodeURI(url), function (data) {
                      var filecode = url.match(/\?file=(.*)/)[1];
                      var longData = data.match(/file=(.*)/)[1].substr();
                      var basedata = longData.substr(0, longData.indexOf(filecode))
                      $('img[src="/DDL/download.png"]').each(function () {
                        url = $(this).parent().attr('href');
                        var filecode = url.match(/\?file=(.*)/)[1];
                        var downloadLink = 'http://' + basedata + filecode;
                        $(this).parent().attr('href', downloadLink)
                      })
                      $('.w8-afp-download').remove();
                    });
                  }
          , 3000)
        }

      },
      removeAdflyInPageAnime: function () {
        $.get('#').done(function (data) {
          $('table[style="width: 100%;"]').html(data.match(/\<table\ style\=\"width\:\ 100\%\;\"\>\n(.*\n)*\<\/tbody\>\n<\/table>/)[0])
        })
      },
      premiumSearchHomePage: function () {
        AFPremium.skeletron.rightcolumn.animeList = [];
        $.get('https://ww1.animeforce.org/lista-anime/').done(function (data) {
          var bxcontainer = data.match(/(\<div\ class\=\"the\-content\"\>.*(.*\n)*\<script\ type=\"text\/javascript\"\>)+/g) [0]
          bxcontainer = bxcontainer.match(/\<li\>\<strong\>\<a\ href=.*\<\/a\>/g)
          var animeList = [
          ];
          for (var index in bxcontainer) {
            var link = bxcontainer[index].match(/.*">/)[0].match(/\".*\//)[0].replace(/\"/g, '')
            var nameAnime = bxcontainer[index].match(/\"\>.*Sub Ita/i)[0].replace(/\"|\/|\>|\</g, '')

            animeList.push({'name': nameAnime, 'link': link})
          }
          AFPremium.skeletron.rightcolumn.animeList = animeList;
        })

        $('#searchform input[type="text"]').on('keyup', function () {
          if ($(this).val().length > 2) {
            var positionBox = $('#searchform input').offset()
            var input_ricerca = $('#searchform input')
            var listaAnime = AFPremium.skeletron.rightcolumn.animeList;
            var listaRisultati = [];
            if (!$('#box_di_ricerca').length) {
              $('body').append('<div class="box-di-ricerca" id="box_di_ricerca"></div>')
              $('#box_di_ricerca')
                      .css('width', input_ricerca.width())
                      .css('top', (positionBox.top + 10 + input_ricerca.height()) + 'px')
                      .css('left', (positionBox.left + 10) + 'px')
                      .css('position', 'absolute')
                      .css('background', '#FFF')
                      .css('z-index', 10000);
            }
            $('#box_di_ricerca').html('<ul style="list-style: none;margin: 0;"></ul>');
            for (var index in listaAnime) {
              if (listaAnime[index].name.toUpperCase().indexOf($(this).val().toUpperCase()) + 1 > 0) {
                listaRisultati.push(listaAnime[index]);
              }
            }
            for (var index in listaRisultati) {
              $('#box_di_ricerca ul').append('<li style="padding: 4px;background: #009cff;margin: 2px 0;font-family: Verdana;"><a href="' + listaRisultati[index].link + '">' + listaRisultati[index].name + '</a></li>');
            }

          }
        })

        $('body').on('click', 'div', function () {
          if (!$(this).hasClass('box_di_ricerca')) {
            $('#box_di_ricerca').remove();
          }
        })


      }
    }

  };
  AFPremium.loadPageType();
  AFPremium.loadFunctionalities();

}

AFP_index(); //$('#featured-wrapper #featured img.wp-post-image')
