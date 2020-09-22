$(".loadMore").click(loadMorePosts);

let clickCount = 0;
let $articles = {};
let postCount = 0;
function loadMorePosts() {
  clickCount++;
  const _this = this;

  const pathname = window.location.pathname;
  const $blogContainer = $(".blog-grid-container");
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
        $articles = $(blogGridItems).find(".blog-grid-item");

        loadPosts($articles, 6, $blogContainer, nextPage, totalPages, _this);
      });
    } else if (clickCount >= 2 && postCount <= 5) {
      // if there are less than 5 remaining posts, append them to the next
      // page's post series
      $.get(`${pathname}page/${nextPage}`, data => {
        const blogGridItems = $.parseHTML(data);

        loadAdditionalPosts(
          $articles,
          6,
          $blogContainer,
          blogGridItems,
          nextPage,
          totalPages,
          _this
        );
      });
    } else if (clickCount >= 2) {
      $.get(`${pathname}page/${nextPage - 1}`, data => {
        loadPosts(
          $articles,
          6,
          $blogContainer,
          nextPage - 1,
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
  blogContainer,
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

  blogContainer.attr("data-page", nextPage).append(batch);

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

function loadAdditionalPosts(
  articles,
  batchSize,
  blogContainer,
  blogGridItems,
  nextPage,
  totalPages,
  _this
) {
  if (nextPage === totalPages && postCount <= 5) {
    // TODO: figure out why articles is not 3!!!!
    var nextPageArticles = $(blogGridItems).find(".blog-grid-item");
    const allArticles = $(blogContainer).find(".blog-grid-item");
    var extendedArticles = $.merge(articles, nextPageArticles);
    var totalPosts = extendedArticles.length;

    var batchSize = totalPosts < batchSize ? totalPosts : batchSize;

    var batch;
    batch = articles.slice(0, batchSize);

    let filteredBatch = batch;
    for (let i = 0; i < batch.length; i++) {
      for (let y = 0; y < allArticles.length; y++) {
        if (batch[i].className == allArticles[y].className) {
          filteredBatch = $(filteredBatch).not(batch[i]);
        }
      }
    }

    if (filteredBatch.length !== batch.length) {
      blogContainer.attr("data-page", nextPage - 1).append(filteredBatch);
      // TODO - figure out condition for removing button
      totalPosts = 0;
      batchSize = 0;
      $articles = {};
      $(".loadMore").remove();
      $(_this).removeClass("loading");
    } else {
      blogContainer.attr("data-page", nextPage - 1).append(batch);
      $articles = extendedArticles.slice(batchSize);
    }
  } else {
    var nextPageArticles = $(blogGridItems).find(".blog-grid-item");
    var extendedArticles = $.merge(articles, nextPageArticles);
    var totalPosts = extendedArticles.length;

    // check if batchSize is less than 12, since we're displaying 12 posts at a time
    var batchSize = totalPosts < batchSize ? totalPosts : batchSize;

    var batch;

    batch = extendedArticles.slice(0, postCount);

    blogContainer.attr("data-page", nextPage - 1).append(batch);

    $articles = extendedArticles.slice(batchSize);

    totalPosts -= batch.length;
    postCount = totalPosts;
  }

  totalPosts = totalPosts - batchSize;
  postCount = totalPosts;

  if (totalPages == nextPage && totalPosts <= 0) {
    $(".loadMore").remove();
  }

  $(_this).removeClass("loading");
}
