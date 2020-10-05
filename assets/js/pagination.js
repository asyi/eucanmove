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
    let hash = window.location.href
    let tag = hash.split('/').slice(-1).toString()
    console.log("WINDOW HASHTAG", tag)
    let $blogContainer = $(".blog-grid-container");
    let $tagBlogContainer = $(`#blog-grid-container-${tag}`);
    console.log("WINDOW HASH blog container", $tagBlogContainer)
    let $blogGridContainerSection5 = $(".blog-grid-container-section-5");
    let $blogGridContainerTagsFull = $(`#blog-grid-container-tags-full-${tag}`);
    $(this).addClass("loading");

    if (hash.includes("/tags") || hash.includes("/categories")) {
        let tagSectionTitle = $tagBlogContainer.attr("data-tagTitle");
        console.log("Tag section title", tagSectionTitle)
        let tagSectionIndex = $tagBlogContainer.attr("data-tag");
        var totalTagPostsCount = parseInt($tagBlogContainer.attr("data-totalTagPostsCount"));


        $.get(hash, data => {

            if (clickCount >= 2 && (remainder < 6)) {
                // if there are less than 5 remaining posts, append them to the end
                $.get(`${hash}#${tagSectionTitle}`, data => {
                    console.log("HEREEEE")
                    let blogGridItems = $.parseHTML(data);
                    $tagPosts = $(blogGridItems).find(`#blog-grid-container-tags-hidden-${tagSectionTitle}`).find(".blog-grid-item").slice(sliceCount);

                    loadLastPosts(
                        $tagPosts,
                        $blogGridContainerTagsFull,
                        _this
                    );
                });
            } else {
                $.get(`${hash}#${tagSectionTitle}`, data => {
                    console.log(`${hash}#${tagSectionTitle}`)
                    let blogGridItems = $.parseHTML(data);
                    $tagPosts = $(blogGridItems).find(`#blog-grid-container-tags-hidden-${tagSectionTitle}`).find(".blog-grid-item").slice(sliceCount);
                    console.log("2-> TAG POSTS", $tagPosts)
                    console.log("2-> Total tag post count", totalTagPostsCount)
                    tagPostsToLoad = totalTagPostsCount - 6
                    sliceCount = sliceCount + 6
                    remainder = tagPostsToLoad - sliceCount
                    loadPosts($tagPosts, 6, $blogGridContainerTagsFull, tagSectionIndex, totalTagPostsCount, _this);

                    console.log("2-> Tag posts to load", tagPostsToLoad)
                    console.log("2-> Slice count", sliceCount)
                    console.log("2-> Remainder", remainder)
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