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
// @version     1.11.7
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
    loadFunctionalities: function () {
      //funzionalità globali
      this.functionalities.decreaseAD();


      //funzionalità specifiche
      switch (this.getPageType()) {
        case 'home':
          this.functionalities.addPremiumMenu();
          break;
        case 'premium-menu':
          this.functionalities.addPremiumMenu();
          break;
        case 'episode-list':
          this.functionalities.addPremiumMenu();
          break;
        case 'episode-preview':
          this.functionalities.addPremiumMenu();
          break;
        case 'lista-anime':
          this.functionalities.addPremiumMenu();
          break;
        case 'archive':
          this.functionalities.addPremiumMenu();
          break;
        case 'hentai':
          this.functionalities.addPremiumMenu();
          break;
        case 'error404':
          this.functionalities.addPremiumMenu();
          break;
        case 'streaming-page':
          this.functionalities.dontBlocADblock();
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
        if (this.parent().getPageType() == 'streaming-page') {
          var disableFunction = setInterval(function () {
            if ($("body > center + *").length) {
              $('footer').remove();
              while ($("body > center + *").length) {
                $("body > center + *").remove();
              }
            }
          }, 300)

        }
      },
      dontBlocADblock: function () {
        var disableFunction = setInterval(function () {
          if ($('[href="http://www.animeforce.org/block/guida.html"]').parents('[id]').length) {
            $('[href="http://www.animeforce.org/block/guida.html"]').parents('[id]').remove();
            clearInterval(disableFunction);
          }
        }, 300);

      }
    }
  };
  AFPremium.loadPageType();
  AFPremium.loadFunctionalities();

}

AFP_index(); //$('#featured-wrapper #featured img.wp-post-image')
