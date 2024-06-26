jQuery(function ($) {
  var $bodyEl = $('body'),
    $sidedrawerEl = $('#sidedrawer');


  // ==========================================================================
  // Toggle Sidedrawer
  // ==========================================================================
  function showSidedrawer() {
    // show overlay
    var options = {
      onclose: function () {
        $sidedrawerEl
          .removeClass('active')
          .appendTo(document.body);
      }
    };

    var $overlayEl = $(mui.overlay('on', options));

    // show element
    $sidedrawerEl.appendTo($overlayEl);
    setTimeout(function () {
      $sidedrawerEl.addClass('active');
    }, 20);
  }


  function hideSidedrawer() {
    $bodyEl.toggleClass('hide-sidedrawer');
  }


  $('.js-show-sidedrawer').on('click', showSidedrawer);
  $('.js-hide-sidedrawer').on('click', hideSidedrawer);


  // ==========================================================================
  // Animate menu
  // ==========================================================================
  var $titleEls = $('strong', $sidedrawerEl);

  $titleEls
    .next()
    .hide();

  $titleEls.on('click', function () {
    $(this).next().slideToggle(200);
  });
});

// ==========================================================================
// Version switcher
// ==========================================================================
function switchVersion(version) {
  const currentPathArr = arr = window.location.pathname.split("/").slice(0, -1);
  currentPathArr.splice(-1, 1, version);
  window.location.href = `${currentPathArr.join("/")}`;
}

$(document).ready(function () {
  function loadPageContent(url) {
    $.ajax({
      url: url,
      method: 'GET',
      success: function (data) {
        $('#content-wrapper .mui-container-fluid').html(data);
      },
      error: function () {
        alert('Failed to load content.');
      }
    });
  }

  $('.nav-link').on('click', function (e) {
    e.preventDefault();
    var url = $(this).attr('href');
    loadPageContent(url);
  });


  const themeToggle = document.getElementById('theme-switcher');

  const currentTheme = localStorage.getItem('theme') || 'light';

  if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }

  $(themeToggle).find(".dark-mode-icon").html(currentTheme === 'dark' ? "brightness_7" : "brightness_4");

  themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const newTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      $(themeToggle).find(".dark-mode-icon").html(
        newTheme === 'dark' ? "brightness_7" : "brightness_4");
  });
});


