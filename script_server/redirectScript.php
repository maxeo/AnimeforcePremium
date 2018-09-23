<?php

header('Access-Control-Allow-Origin: *');
if ($_SERVER['REQUEST_METHOD'] == 'GET' && !empty($_GET['url']) && filter_var($url = $_GET['url'], FILTER_VALIDATE_URL)) {
  $location = (empty($header = get_headers($url, 1)) || empty($header['Location'])) ? false : $header['Location'];
  //caso minuscolo
  if (empty($location) && !empty($header))
    $location = (empty($header['location'])) ? false : $header['location'];

  //Nessun Redirect
  if ($location === false && strpos($header[0], '200'))
    echo $url;
  else {
    if (is_array($location))
      echo end($location);
    else
      echo $location;
  }
}
