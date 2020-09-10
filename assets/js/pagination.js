"use strict";

$(".loadMore").click(loadMorePosts);

function loadMorePosts() {
  var _this = this;

  var pathname = window.location.pathname;
  var $blogContainer = $(".blog-grid-container");
  $(this).addClass("loading");

  if (pathname.includes("/tags")) {
    var nextTag = parseInt($blogContainer.attr("data-tag")) + 1;
    var totalTags = parseInt($blogContainer.attr("data-totalTags"));

    $.get(pathname, function (data) {
      var blogGridItems = $.parseHTML(data);
      var $articles = $(blogGridItems).find(".blog-grid-item");
      $blogContainer.attr("data-tag", nextTag).append($articles);
      console.log("total tag", totalTags)
      console.log("next tag", nextTag)

      if (totalTags == nextTag) {
        $(".loadMore").remove();
      }

      $(_this).removeClass("loading");
    });
  } else if (pathname.includes("/jekyll-theme-memoirs/")) {
    console.log("main path")
    var nextPage = parseInt($blogContainer.attr("data-page")) + 1;
    var totalPages = parseInt($blogContainer.attr("data-totalPages"));

    $.get(pathname + "/page/" + nextPage, function (data) {
      var blogGridItems = $.parseHTML(data);
      var $articles = $(blogGridItems).find(".blog-grid-item");
      $blogContainer.attr("data-page", nextPage).append($articles);
      if (totalPages == nextPage) {
        $(".loadMore").remove();
      }

      $(_this).removeClass("loading");
    });
  }
}


