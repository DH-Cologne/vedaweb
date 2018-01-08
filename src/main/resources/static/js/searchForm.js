
function initSearchForm(){

	//add extra term functionality
	
	$(".btn-add-token-plus").click(function(){
		var blockCount = $("#form-search .token-class").length;
		
		if (blockCount < 4){
			var newBlock = $("#form-search .token-class").last().clone();
			$(this).parent().before(newBlock.hide().fadeIn());
			
//			$.each(newBlock.find("input, select"), function(){
//				$(this).attr("name", $(this).attr("name").replace("/\d/", blockCount));
//			});
		}
		
		if ($("#form-search .token-class").length >= 4){
			$(this).hide();
		}
		
		if ($("#form-search .token-class").length > 1){
			$(".btn-add-token-minus").show();
		}
	
		//update js
		keyoskUpdate();
		initTransliteration();
	});
	
	$(".btn-add-token-minus").hide();
	
	$(".btn-add-token-minus").click(function(){
		if ($("#form-search .token-class").length <= 2){
			$(this).hide();
		}
		if ($("#form-search .token-class").length > 1){
			$("#form-search .token-class").last().fadeOut(function(){
				$(this).remove();
				if ($("#form-search .token-class").length < 4){
					$(".btn-add-token-plus").show();
				}
			});
		}
		
		//update
		keyoskUpdate();
		initTransliteration();
	});
	
	//search form submit
	$("#form-search").submit(function(event) {
		// Stop form from submitting normally
		event.preventDefault();

		// Get some values from elements on the page:
		var $form = $(this);
		var params = $form.serializeJSON();
		console.log(JSON.stringify(params));
		var url = $form.attr( "action" );

		// Send the data using post
		var posting = $.post(url, params);

		// Put the results in a div
		posting.done(function(data) {
			alert(data);
		});
	});
	
}