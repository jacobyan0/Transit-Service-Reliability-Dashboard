<?php
  include 'backend/config.php';
  $page = isset($_GET['page']) ? $_GET['page'] : 'realtime';
  $pagePath = "pages/$page.php";
  include 'includes/header.php';
  if (file_exists($pagePath)) {
      include $pagePath;
  } else {
      include 'pages/realtime.php';
  }

  include 'includes/footer.php';

