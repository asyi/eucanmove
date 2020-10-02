$(".loadMore").click(loadMorePosts);

let clickCount = 0;
let $articles = {};
let postCount = 0;
function loadMorePosts() {
  clickCount++;
  const _this = this;

  let pathname = window.location.pathname;
  let $blogContainer = $(".blog-grid-container");
  let $blogGridContainerSection5 = $(".blog-grid-container-section-5");
  let $blogGridContainerTagsFull = $("#blog-grid-container-tags-full");
  $(this).addClass("loading");

  if (pathname.includes("/tags")) {
    console.log("IN TAGS tagSection", $blogContainer)
    let tagSectionTitle = $blogContainer.attr("data-tagTitle");
    let tagSectionIndex = $blogContainer.attr("data-tag");
    console.log("IN TAGS tagSection", tagSectionTitle)
    console.log("IN TAGS tagSection I", tagSectionIndex)
    let totalTags = parseInt($blogContainer.attr("data-totalTags"));
    let totalTagPosts = parseInt($blogContainer.attr("data-totalTagPosts"));
    let tagPostsToLoad = totalTagPosts

    $.get(pathname, data => {
      let blogGridItems = $.parseHTML(data);
      let $tagPosts = $(blogGridItems).find(".blog-grid-item");
      console.log("TAGS to cut", $tagPosts)
    //   $blogContainer.attr("data-tag", nextTag).append($tagPosts);

    if (clickCount == 1) {
        $.get(`${pathname}#${tagSectionTitle}`, data => {
          let blogGridItems = $.parseHTML(data);
          // 6 is the offset from tags.html
          $tagPosts = $(blogGridItems).find(".blog-grid-item").slice(6);
          console.log("TAGS to cut", $tagPosts)
          tagPostsToLoad -= 6
          console.log("TAGS LEFT", tagPostsToLoad)
          loadPosts($tagPosts, 6, $blogGridContainerTagsFull, tagSectionIndex, totalTagPosts, _this);
        });
    }

      if (totalTags == tagPostsToLoad) {
        $(".loadMore").remove();
      }

      $(_this).removeClass("loading");
    });
  } else if (pathname.includes("/jekyll-theme-memoirs/")) {
    let nextPage = parseInt($blogContainer.attr("data-page")) + 1;
    let totalPages = parseInt($blogContainer.attr("data-totalPages"));

    if (clickCount == 1) {
      $.get(`${pathname}page/${nextPage}`, data => {
        let blogGridItems = $.parseHTML(data);

        // 21 is the offset from index.html
        $articles = $(blogGridItems).find(".blog-grid-item").slice(21);

        loadPosts($articles, 6, $blogGridContainerSection5, nextPage, totalPages, _this);
      });
    } else if (clickCount >= 2 && postCount <= 5) {
      // if there are less than 5 remaining posts, append them to the next
      // page's post series
      $.get(`${pathname}page/${nextPage}`, data => {
        let blogGridItems = $.parseHTML(data);

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
