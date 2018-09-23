<?php
header('Access-Control-Allow-Origin: *');
if ($_SERVER['REQUEST_METHOD'] == 'GET' && !empty($_GET['id'])) {
  $id = $_GET["id"];
  parse_str(file_get_contents('http://www.youtube.com/get_video_info?video_id=' . $id), $video_data);
  $streams = $video_data['url_encoded_fmt_stream_map'];
  $streams = explode(',', $streams);
  $counter = 1;
  $vr = [];
  foreach ($streams as $streamdata) {
    parse_str($streamdata, $streamdata);
    foreach ($streamdata as $key => $value) {
      $vr[$counter][$key] = $value;
    }
    $counter = $counter + 1;
  }

  header('Content-Type: application/json');
  echo json_encode($vr);
  die();
}
