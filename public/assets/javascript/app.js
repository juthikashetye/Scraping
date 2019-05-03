var inputVal;
var currDiv;
var currDivId;
var favArticle;

function getNews() {
  $('#mainDiv').empty();

  $.ajax({
    method: 'GET',
    url: '/news'
  }).then(function(news) {

    for (var nIndex in news) {

      var newsDiv = $("<div>");
      newsDiv.html(`<span class="titleSpan">Title: ${news[nIndex].title}</span> <br> 
                     <span class="storySpan">Story: ${news[nIndex].story}</span> <br>
                     <a class="storyLink" href="${news[nIndex].link}">See full story</a> <br>`);

      var saveButton = $("<button>").attr("class", "saveArticle").text("Save Article");

      newsDiv.append(saveButton);

      $('#mainDiv').append(newsDiv);
    }
  })
}

// getComments(currDivId);

function getComments() {

  $.ajax({
    method: 'GET',
    url: "/all-comments"
  }).then(function(c) {

    for (var cIndex in c) {
      var prevComments = $("<div>").attr("class", "prevCommentsDiv").html(c[cIndex].comment);
      // currDiv.append(prevComments);
    }
  })
}

function getFavNews() {
  $('#favArticlesDiv').empty();

  $.ajax({
    method: 'GET',
    url: '/savedArticles'
  }).then(function(sNews) {

    for (var sIndex in sNews) {

      var sNewsDiv = $("<div>");
      sNewsDiv.html(`<span class="titleSpan">Title: ${sNews[sIndex].title}</span> <br> 
                     <span class="storySpan">Story: ${sNews[sIndex].story}</span> <br>
                     <a class="storyLink" href="${sNews[sIndex].link}">See full story</a> <br>`);

      var commentDiv = $("<div>").attr("class", "commentDiv")
        .attr("id", "commentDiv" + sNews[sIndex]._id);

      var input = $('<input>').attr("class", "comment")
        .attr("id", "input" + sNews[sIndex]._id);

      var addButton = $("<button>").attr('class', 'add-comment').attr('data-id', sNews[sIndex]._id).text('Add comment');

      sNewsDiv.append(commentDiv);
      sNewsDiv.append(input);
      sNewsDiv.append(addButton);

      $('#favArticlesDiv').append(sNewsDiv);
    }
  })
}

$(document).on('click', '.add-comment', function(e) {

  e.preventDefault();

  inputVal = $(this).prev().val();
  currDiv = $(this).prev().prev(".commentDiv");
  currDivId = $(this).prev().prev(".commentDiv").attr("id");
  console.log("Comment: ", inputVal);

  $.ajax({
    method: 'POST',
    url: `/addComment`,
    data: {
      comment: inputVal
    }
  }).then(function(cid) {

    console.log("Added comment: ", cid);

    var commentPara = $("<p>").text(cid.comment).attr("id", "commentPara" + cid._id);

    var deleteButton = $('<button>').attr('class', 'delete-comment').attr('data-id', cid._id).text('Delete comment');

    commentPara.append(deleteButton);
    currDiv.append(commentPara);

    // getNews();
    // getComments(currDivId);
  })
})

$(document).on('click', '.saveArticle', function(e) {

  e.preventDefault();

  var favArticleTitle = $(this).parent().children(".titleSpan").text();
  var favArticleLink = $(this).parent().children(".storyLink").text();
  var favArticleStory = $(this).parent().children(".storySpan").text();
  $.ajax({
    method: 'POST',
    url: '/saved',
    data: {
      link: favArticleLink,
      title: favArticleTitle,
      story: favArticleStory
    }
    
  }).then(function(s) {

    console.log("Saved Article: ", s);
    // console.log(s.comment);
    // console.log(s._id);

    // var commentPara = $("<p>").text(s.comment).attr("id", "commentPara" + s._id);

    // var deleteButton = $('<button>').attr('class', 'delete-comment').attr('data-id', s._id).text('Delete comment');

    // commentPara.append(deleteButton);
    // currDiv.append(commentPara);

    // getNews();
    // getComments();
  })
})

$(document).on('click', '.delete-comment', function() {

  var delCommentButton = $(this);

  var id = $(this).attr('data-id');

  $.ajax({
    method: 'DELETE',
    url: `/comment/${id}`
  }).then(function(idd) {
    console.log("Deleted comment id: ", idd);
    delCommentButton.parent().remove();
    // getNews();
    // getComments();
  })
})