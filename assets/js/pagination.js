$(".loadMore").click(loadMorePosts);

let clickCount = 0;
let $articles = {};
let postCount = 0;

let tagPostsToLoad = 0

let sliceCount = 6

function loadMorePosts() {
  clickCount++;
  const _this = this;

  let pathname = window.location.pathname;
  let $blogContainer = $(".blog-grid-container");
  let $blogGridContainerSection5 = $(".blog-grid-container-section-5");
  let $blogGridContainerTagsFull = $("#blog-grid-container-tags-full");
  $(this).addClass("loading");

  if (pathname.includes("/tags")) {
    console.log("CLICK CONT", clickCount)
    console.log("IN TAGS tagSection", $blogContainer)
    let tagSectionTitle = $blogContainer.attr("data-tagTitle");
    let tagSectionIndex = $blogContainer.attr("data-tag");
    // let totalTags = $blogContainer.attr("data-totalTags");
    let totalTagsCount = parseInt($blogContainer.attr("data-totalTagsCount"));
    console.log("TOTAL TAGS COUNT", totalTagsCount)
    var totalTagPostsCount = parseInt($blogContainer.attr("data-totalTagPostsCount"));
    console.log("TOTAL TAG POST COUNT", totalTagPostsCount)


    $.get(pathname, data => {

    if (clickCount >= 2 && postCount <= 5) {
        // if there are less than 5 remaining posts, append them to the next
        // page's post series
        console.log("IN HEREEEEE - aaaaaaa with slice count", sliceCount)
        console.log("original tag posts to load", tagPostsToLoad)
        $.get(`${pathname}#${tagSectionTitle}`, data => {
          let blogGridItems = $.parseHTML(data);


          loadLastPosts(
            $(blogGridItems).find("#blog-grid-container-tags-hidden").find(".blog-grid-item"),
            $blogGridContainerTagsFull,
            _this
          );
        });
    } else {
        $.get(`${pathname}#${tagSectionTitle}`, data => {
            let blogGridItems = $.parseHTML(data);
            $tagPosts = $(blogGridItems).find("#blog-grid-container-tags-hidden").find(".blog-grid-item").slice(sliceCount);

            console.log("TAGS to cut", $tagPosts)
            tagPostsToLoad = totalTagPostsCount - 6
            sliceCount = sliceCount + 6
            console.log("TAGS LEFT", tagPostsToLoad)
            console.log("slice count 2222", sliceCount)
            loadPosts($tagPosts, 6, $blogGridContainerTagsFull, tagSectionIndex, totalTagPostsCount, _this);
          });

        if (tagPostsToLoad === (sliceCount)) {
            $(".loadMore").remove();
        }

        $(_this).removeClass("loading");
    }
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
          $(blogGridItems).find(".blog-grid-item"),
          $blogGridContainerSection5.attr("data-page", nextPage - 1),
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
  blogGridItems,
  attachmentSection,
  _this
) {

    var batch;

    // Get last remaining elements
    batch = blogGridItems.slice(Math.max(blogGridItems.length - postCount, 0));

    console.log("BATCH", batch)

    attachmentSection.append(batch);

    $(".loadMore").remove();
    $(_this).removeClass("loading");

}
