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
    getPageType: function () {
      if ($('body').hasClass('home')) {
        this.setPage('home')
      } else
      if ($('body').hasClass('error404')) {
        if (window.location.pathname == '/premium') {
          this.setPage('premium-menu')
        } else {
          this.setPage('error404')
        }
      } else if ($('body').attr('class') == '') {
        this.setPage('streaming-page')
      } else if ($('body').hasClass('single-post')) {
        if ($('table img[src="/DDL/download.png"], table img[src="/DDL/streaming.png').length) {
          this.setPage('episode-list')
        } else {
          this.setPage('episode-preview')
        }
      }
      return this.pagetype;
    },
    setPage: function (pagename) {
      this.pagetype = pagename;
    },
    logafp: function (data) {
      if (this.logs) {
        console.log(data)
      }
    }
  };
  AFPremium.getPageType();
}
AFP_index() //$('#featured-wrapper #featured img.wp-post-image')
