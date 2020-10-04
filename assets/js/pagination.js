$(".loadMore").click(loadMorePosts);

let clickCount = 0;
let $articles = {};
let postCount = 0;

let tagPostsToLoad = 0

let sliceCount = 6

let remainder

function loadMorePosts() {
    clickCount++;
    const _this = this;

    let pathname = window.location.pathname;
    let $blogContainer = $(".blog-grid-container");
    let $blogGridContainerSection5 = $(".blog-grid-container-section-5");
    let $blogGridContainerTagsFull = $("#blog-grid-container-tags-full");
    $(this).addClass("loading");

    if (pathname.includes("/tags")) {
        let tagSectionTitle = $blogContainer.attr("data-tagTitle");
        let tagSectionIndex = $blogContainer.attr("data-tag");
        var totalTagPostsCount = parseInt($blogContainer.attr("data-totalTagPostsCount"));


        $.get(pathname, data => {

            if (clickCount >= 2 && (remainder < 6)) {
                // if there are less than 5 remaining posts, append them to the end
                $.get(`${pathname}#${tagSectionTitle}`, data => {
                    let blogGridItems = $.parseHTML(data);
                    $tagPosts = $(blogGridItems).find("#blog-grid-container-tags-hidden").find(".blog-grid-item").slice(sliceCount);

                    loadLastPosts(
                        $tagPosts,
                        $blogGridContainerTagsFull,
                        _this
                    );
                });
            } else {
                $.get(`${pathname}#${tagSectionTitle}`, data => {
                    let blogGridItems = $.parseHTML(data);
                    $tagPosts = $(blogGridItems).find("#blog-grid-container-tags-hidden").find(".blog-grid-item").slice(sliceCount);
                    tagPostsToLoad = totalTagPostsCount - 6
                    sliceCount = sliceCount + 6
                    remainder = tagPostsToLoad - sliceCount
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

    attachmentSection.append(batch);

    $(".loadMore").remove();
    $(_this).removeClass("loading");

}