
var main = function() {
	
	$("#2D-plus1Func-1").click(function () {
		
		// Clone the previous <span>. Then edit the clone appropriately
		var $clone = $(this).prev().clone();
		
		// Look at the <sub></sub> to set the clone's  <sub>n</sub> appropriately.
		var newIndex = parseInt($('sub',$clone).text(), 10) + 1;
		$('sub',$clone).text(newIndex);
		$('input',$clone).val(''); // Remove the text.
		
		$(this).before($clone); // Insert the $clone before the button.
		
	});	
	
	$("#2D-toMFunc-1").click(function () {
		// Show the text area if it is hidden
		if ($("#user-defined-1").css('display') === 'none') {
			$("#user-defined-1").removeClass('hidden');
		}
		
		// Get all the input tags. Need to filter by not buttons.
		var $inputs = $('input', $(this).parent()).filter( function( index ) {
				return $(this).attr('type') === 'text';
			});
		
		// Loop through the $inputs and create a string to be added to the #user-defined box
		var string = '';
		for(var i = 0; i < $inputs.length; i++) {
			string += 'f'+ (i+1) + '[x_]:= ' + $($inputs[i]).val() + '; '; 
		}
				
		$("#user-defined-1").val(string);
		
		// Replace the user input in the input boxes with the names of the functions
		for(var i = 0; i < $inputs.length; i++) {
			$($inputs[i]).val('f'+ (i+1) + '[x]'); 
		}
		
	});	
}

$(document).ready(main);