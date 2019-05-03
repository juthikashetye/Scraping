var inputVal;
      
      function getNews(){
      	$('.mainDiv').empty();
      
      	$.ajax({
      		method: 'GET',
      		url: '/news'
      	}).then(function(news){

      		for (var nIndex in news){
      
      			var newsDiv = $("<div>");
      			newsDiv.html(`Title: ${news[nIndex].title} <br>Link: ${news[nIndex].link} <br>Story: ${news[nIndex].story} <br>`);

            // var saveButton = $("<button>").attr("class", "save").text("Save Article");
      
      			var commentDiv = $("<div>").attr("class", "commentDiv")
      									  .attr("id","commentDiv"+news[nIndex]._id);
      
      			var input = $('<input>').attr("class", "comment")
      									.attr("id", "input"+news[nIndex]._id);

      			var addButton = $("<button>").attr('class', 'add-comment').attr('data-id', news[nIndex]._id).text('Add comment');
      			// getComments(commentDiv);
            // newsDiv.append(saveButton);
      			newsDiv.append(commentDiv);
      			newsDiv.append(input);
      			newsDiv.append(addButton);
      			
      			$('#mainDiv').append(newsDiv);
      		}
      	})
      }
      
      getNews();
      // getComments();

   //    function getComments(cd){

   //    	$.ajax({
   //    		method: 'GET',
   //    		url: '/all-comments'
   //    	}).then(function(c){

   //    		for (var cIndex in c){
   //    		var prevComments = $("<div>").attr("class", "prevCommentsDiv").html(c[cIndex].comment);
   //    		cd.append(prevComments);
			// }
   //    	})
   //    }
      
      $(document).on('click', '.add-comment', function(e){
      
      	e.preventDefault();
      
      	inputVal = $(this).prev().val();
      	var currDiv = $(this).prev().prev(".commentDiv");

      	console.log(inputVal);

      	$.ajax({
      		method: 'POST',
      		url: `/addComment`,
      		data: {
      			comment: inputVal
      		}
      	}).then(function(cid){
      
      		console.log(cid);
      		console.log(cid.comment);
      		console.log(cid._id);

      		var commentPara = $("<p>").text(cid.comment).attr("id", "commentPara"+cid._id);

      		var deleteButton = $('<button>').attr('class', 'delete-comment').attr('data-id', cid._id).text('Delete comment');
      
      		commentPara.append(deleteButton);
      		currDiv.append(commentPara);
      
      		// getNews();
      		// getComments();
      	})
      })
      
      
      $(document).on('click', '.delete-comment', function(){

        var $button = $(this);

      	var id = $(this).attr('data-id');
      
      	$.ajax({
      		method: 'DELETE',
      		url: `/comment/${id}`
      	}).then(function(idd){
      		console.log(idd);
         $button.parent().remove();
      		// getNews();
      		// getComments();
      	})
      })