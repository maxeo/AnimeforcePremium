$('body').append('<div class="pippo" style="position: fixed; left: 686px; top: 50px; z-index: 1000;"><video src="http://www.eyesonanime.org/DDL/ANIME/DragonBallSuper/DragonBallSuper_Ep_01_SUB_ITA.mp4" style="width: 40vw;border-bottom-right-radius: 15px;border-bottom-left-radius: 15px;"></video><div class="pippoheader" style="position: absolute;width: 100%;height: 100%;background: #FFF0;top: 0;left: 0;"></div><div style="position: absolute;background: #000000b3;width: 100%;height: 25px;top: -25px;border-top-right-radius: 15px;border-top-left-radius: 15px;cursor: move;" class="muovimi"></div></div>')
function dragElement(elmnt) {
  var pos1 = 0,
  pos2 = 0,
  pos3 = 0,
  pos4 = 0;
  document.querySelector('.muovimi').onmousedown = dragMouseDown;
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + 'px';
    elmnt.style.left = (elmnt.offsetLeft - pos1) + 'px';
  }
  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
dragElement(document.querySelector('.pippo'))
$('.pippoheader').on('click', function () {
  if ($('.pippo video') [0].paused) {
    $('.pippo video') [0].play()
  } else {
    $('.pippo video') [0].pause()
  }
}).on('dblclick', function () {
  var videoElement = $('.pippo video') [0]
  toggleFullScreen()
  function toggleFullScreen() {
    if (!document.mozFullScreen && !document.webkitFullScreen) {
      if (videoElement.mozRequestFullScreen) {
        videoElement.mozRequestFullScreen();
      } else {
        videoElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else {
        document.webkitCancelFullScreen();
      }
    }
  }
})
