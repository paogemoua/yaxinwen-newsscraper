$(document).ready(function() {
    $(".navbar-hamburger").on("click", function() {
        $(".navbar-hamburger").toggleClass("is-active");
        $(".dropdown").toggle();
        $(".dropdown").toggleClass("is-open");
    });

    $.getJSON("/articles", function(data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].saved === true) {
                $("#saved-results").append("<div class='saved-div'><p class='saved-text'>" + data[i].title + "<br>" + 
                data[i].description + "</p><a class='delete-button button is-danger is-medium' data-id='" + 
                data[i]._id + "'>Delete</a><a class='comments-button button is-info is-medium' data-id='" + 
                data[i]._id + "'><span class='icon'><i class='fa fa-comments'></i></span>Comments</a></div>");
            }
        }
    });

    $(document).on("click", ".comments-button", function() {
        $(".modal").toggleClass("is-active");
        var articleID = $(this).attrii("data-id");
        $.ajax({
            method: "GET",
            url: "/article/" + articleID
        }).done(function(data) {
            $("#comments-header").html("Article Comments (ID: " + data._id + ")");
            if(data.comments.length !==0) {
                $("#comments-list").empty();
                for (i = 0; i < data.comments.length; i++) {
                    $("#comments-list".append("<div class='comment-div'><p class='comment'>" + data.comments[i].body + "</p></div>");
                }
            }
            $("footer.modal-card-foot").html(<"<button id='save-comment' class='button is-success' data-id='" + data._id + "'>Save Comment</button>")
        });
    });

    // Line 52
    $(document).on
})