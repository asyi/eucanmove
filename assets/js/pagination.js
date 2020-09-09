$(".loadMore").click(loadMorePosts);
function loadMorePosts() {
  var _this = this;
  var $blogContainer = $(".blog-grid-container");
  var nextPage = parseInt($blogContainer.attr("data-page")) + 1;
  console.log("NEXT PAGE", nextPage)
  var totalPages = parseInt($blogContainer.attr("data-totalPages"));
  $(this).addClass("loading");

  var blogGridItems = $.parseHTML(".blog-grid-container");
  var $articles = $(blogGridItems).find("blog-grid-item");
  $.get("/jekyll-theme-memoirs/page" + nextPage, function ($articles) {

    console.log("article list", $articles )
    // var $articles = blogGridItems.get("")
    console.log("ARTICLES", $articles)
    $blogContainer.attr("data-page", nextPage).append($articles);
    console.log("CONTAINER", $blogContainer )
    if (totalPages == nextPage) {
        $(".loadMore").remove();
    }
    $(_this).removeClass("loading");
  });
}