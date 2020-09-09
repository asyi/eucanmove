$(".loadMore").click(loadMorePosts);
function loadMorePosts() {
  var _this = this;
  var $blogContainer = $(".blog-grid-container");
  var nextPage = parseInt($blogContainer.attr("data-page")) + 1;
  console.log("NEXT PAGE", nextPage)
  var totalPages = parseInt($blogContainer.attr("data-totalPages"));
  $(this).addClass("loading");

$.get("/jekyll-theme-memoirs/page" + nextPage, function (data) {
    var blogGridItems = $.parseHTML(data);
    var $articles = $(blogGridItems).find(".blog-grid-item");
    console.log("ARTICLES", $articles)

    $blogContainer.attr("data-page", nextPage).append($articles);
    console.log("CONTAINER", $blogContainer )
    if (totalPages == nextPage) {
        $(".loadMore").remove();
    }
    $(_this).removeClass("loading");
    });
}