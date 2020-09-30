$(".loadMore").click(loadMorePosts);

let clickCount = 0;
let $articles = {};
let postCount = 0;
function loadMorePosts() {
  clickCount++;
  const _this = this;

  const pathname = window.location.pathname;
  const $blogContainer = $(".blog-grid-container");
  const $blogGridContainerSection5 = $(".blog-grid-container-section-5");
  $(this).addClass("loading");

  if (pathname.includes("/tags")) {
    const nextTag = parseInt($blogContainer.attr("data-tag")) + 1;
    const totalTags = parseInt($blogContainer.attr("data-totalTags"));

    $.get(pathname, data => {
      const blogGridItems = $.parseHTML(data);
      const $articles = $(blogGridItems).find(".blog-grid-item");
      $blogContainer.attr("data-tag", nextTag).append($articles);

      if (totalTags == nextTag) {
        $(".loadMore").remove();
      }

      $(_this).removeClass("loading");
    });
  } else if (pathname.includes("/jekyll-theme-memoirs/")) {
    const nextPage = parseInt($blogContainer.attr("data-page")) + 1;
    const totalPages = parseInt($blogContainer.attr("data-totalPages"));

    if (clickCount == 1) {
      $.get(`${pathname}page/${nextPage}`, data => {
        const blogGridItems = $.parseHTML(data);

        $articles = $(blogGridItems).find(".blog-grid-item").slice(21);

        loadPosts($articles, 6, $blogGridContainerSection5, nextPage, totalPages, _this);
      });
    } else if (clickCount >= 2 && postCount <= 5) {
      // if there are less than 5 remaining posts, append them to the next
      // page's post series
      $.get(`${pathname}page/${nextPage}`, data => {
        const blogGridItems = $.parseHTML(data);

        loadLastPosts(
          $blogGridContainerSection5,
          blogGridItems,
          nextPage,
          _this
        );
      });
    } else if (clickCount >= 2) {
      $.get(`${pathname}page/${nextPage}`, data => {
        loadPosts(
          $articles,
          6,
          $blogGridContainerSection5,
          nextPage,
          totalPages,
          _this
        );
      });
    }
  }
}

function loadPosts(
  articles,
  batchSize,
  blogContainerSection,
  nextPage,
  totalPages,
  _this
) {
  let totalPosts = 0;
  for (let article in articles) {
    if (articles.hasOwnProperty(article) && !isNaN(article)) {
      totalPosts++;
    }
  }


  var batchSize = totalPosts < batchSize ? totalPosts : batchSize;

  let batch = articles.slice(0, batchSize);

  blogContainerSection.attr("data-page", nextPage).append(batch);

  $articles = articles.slice(batchSize);

  totalPosts -= batch.length;
  postCount = totalPosts;

  if (totalPosts == 0) {
    $(".loadMore").remove();
  }

  if (totalPages == nextPage) {
    console.log("no more pages, removing", totalPosts);
    $(".loadMore").remove();
  }

  $(_this).removeClass("loading");
}

function loadLastPosts(
  blogContainerSection,
  blogGridItems,
  nextPage,
  _this
) {
    var remainingArticles = $(blogGridItems).find(".blog-grid-item");

    var batch;

    // Get last remaining elements
    batch = remainingArticles.slice(Math.max(remainingArticles.length - postCount, 0));

    blogContainerSection.attr("data-page", nextPage - 1).append(batch);

    $(".loadMore").remove();
    $(_this).removeClass("loading");

}
