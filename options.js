

var main = function() {
	
	// When a radiobox is clicked on hide and show the appropriate stuff.
	$(".radiobox").on("change", function () {
		//Find out the class and code of the parent to send to show_hide_levels
		var myObj = $(this).parent();		
		show_hide_levels(myObj.attr('class'), myObj.attr('level'), myObj.attr('nextLevel'), myObj.attr('type'));
	});	
	
	
		
	$(".btn").on( "click", function() {
		getCode();
	});
	
	// When the user wants to add another inputBox
	$("#addInputBox	").on( "click", function() {
		var $newDivToInsert = $(this).next().clone();
		
		// Remove the class "plot-option" from the $newInput
		// This is a hack for getting the getSnippet function to be called only once
		// Need to redesign things and replace this with something better
		$newDivToInsert.removeClass('plot-option');		
		
		// Change the id in the clone div to avoid id collisions. 
		var number = $newDivToInsert.attr("id").match(/\d+$/);
		$newDivToInsert.attr("id", $newDivToInsert.attr("id").replace(number, parseInt(number)+1));
		
		// Change the id in the [make function] 
		var $innerDiv = $('div', $newDivToInsert);
		number = $innerDiv.attr("id").match(/\d+$/);
		$innerDiv.attr("id", $innerDiv.attr("id").replace(number, parseInt(number)+1));
		
		// Change the id in the in new input tag.
		var $newInput = $('input', $newDivToInsert);
		number = $newInput.attr("id").match(/\d+$/);
		$newInput.attr("id", $newInput.attr("id").replace(number, parseInt(number)+1));
		
		
		
		
		// Need to enable the new make function button? Maybe later
		
		
		// I'm guessing the appendTo will cause the +1 button to not really work after the first +1. 
		// But the appendTo quickly fixes the issue of the getSnippet function gets called twice but is designed 
		// to only be called once.
		$newDivToInsert.appendTo($(this).next());
		//$(this).next().append($newDivToInsert);
		
		
	});
	
	// Assumes user uses x as the independent variable.
	$("#to-user-defined-1").on("click", function() {
		// Paste the code from the input box into the user-defined code at the bottom
		
		// Get all the input tags
		var $inputs = $('.func-definition');
		
		// Loop through the $inputs and create a string to be added to the #user-defined box
		var string = '';
		for(var i = 0; i < $inputs.length; i++) {
			string += 'f'+ i + '[x_]:= ' + $($inputs[i]).val() + '; '; 
		}
				
		$("#user-defined").val(string);
		
		// Replace the user input in the input boxes with the names of the functions
		for(var i = 0; i < $inputs.length; i++) {
			$($inputs[i]).val('f'+ i + '[x]'); 
		}
	});
	
}	 
	// Show and hide the options not on the appropriate level. 
	function show_hide_levels(c, level, nLevel, type ) {
		var thisLevel = parseInt(level);
		var nextLevel = parseInt(nLevel);
		
		var  allThePTags = $('.domRan');		// Previously '.'+c (I was using c in case I could reuse this code for other function option div tags.)
		
		// If the radiobox from the given snippets does not lead to more options then take away 
		// things from the next levels. 
		if (nextLevel == 0) {
			 // Loop through everything in the given function-option div tag.
			for ( var i = 0; i < allThePTags.length; i++) {
				// Check if the given p tag is on a level that needs to be hidden.
				if ($(allThePTags[i]).attr('level') > thisLevel) {
										
					// Before hiding them, switch the radio buttons back to the default checked or not checked.
					// This is not working. Weird stuff happens with radio buttons. Maybe I should try using check boxes instead....
					/*
					if ($(allThePTags[i]).attr('type') == 'r') {
						if ($(allThePTags[i]).attr('nextLevel') > 0) {
							$(allThePTags[i]).removeProp("checked");	
						}
						else {
							$(allThePTags[i]).prop("checked","false");
						}
						
					}
					*/
					
					$(allThePTags[i]).removeClass('hidden');
					$(allThePTags[i]).removeClass('visible');
					$(allThePTags[i]).addClass('hidden');
				}
				// Check if the given p tag is on the level and needs to be revealed.
				if ($(allThePTags[i]).attr('level') == thisLevel) {
					$(allThePTags[i]).removeClass('hidden');
					$(allThePTags[i]).addClass('visible');
					
				}
			}
		}
		// If the radiobox leads to more levels then reveal the options on those levels and hide 
		// the options on this level.
		else {
			 // Loop through everything in the given function-option div tag.
			for ( var i = 0; i < allThePTags.length; i++) {
				// Hide non-radio buttons on lower levels
				if (parseInt($(allThePTags[i]).attr('level')) < nextLevel && $(allThePTags[i]).attr('type') != 'r' ) {
					
					$(allThePTags[i]).removeClass('hidden');
					$(allThePTags[i]).removeClass('visible');
					$(allThePTags[i]).addClass('hidden');
				}
				// Reveal things that are on the next level
				if ($(allThePTags[i]).attr('level') == nextLevel) {
					$(allThePTags[i]).removeClass('hidden');
					$(allThePTags[i]).addClass('visible');
					
				}
			}
			
		}
				
	} // End show_hide_levels
	
	// Takes jquery objects that are the div tags of each of the user specified options 
	// and returns a waplot object created from the values in the forms.
	function getWaplotObj(plotInputs, optionInputs) {
		
		// Define the waplot object. The constructor takes (plots, snippets).
		var w = new Waplot([], []);
		
		// Start by getting the array of plot objects.
		for (var i = 0; i < plotInputs.length; i++) {
			var p = plotInputToPlotObj(plotInputs[i]);
			w.addPlot(p);
		}		
		
		// Loop through each div except the one used to define the object and 
		// create and add a snippet object to the waplot object.
		for (var i = 0; i < optionInputs.length; i++) {
			var d = inputToSnippet(optionInputs[i]);
			w.addSnippet(d);
		}
		
		return w;
	}
	
	// Takes a div tag holding the input from a plot div and returns a Plot object
	var plotInputToPlotObj = function(div) {
		
		// constructor of Plot is Plot(type, snippets)
				
		// Extract the plot type from the id of the given div. The id should be 'plot type - Index'. Remove the -Index.
		var plotType = $(div).attr('id').split('-')[0]; 
		var p = new Plot(plotType, []);
		// Look at all the div tags of class "plot-option" inside the given div input.
		var options = $(".plot-option" , div);
		
		//Send each .plot-option div through a case statement that makes snippets based on the id.
		for (var i = 0; i < options.length; i++) {
			var snip = plotOptionToSnippet(options[i], p);
			p.addSnippet(snip);
		}
		return p;
		
	}
	
	// The input div is the jquery object that is the .plot-option div
	// Also takes the plot object that the snippet will be a part of.
	// Returns a snippet object.  
	var plotOptionToSnippet = function(div, p) {
		
		// Take off any numbers hyphened on to the end of the ids. 
		var type = $(div).attr('id').split('-')[0]; 
		
		// Will eventually need to make another layer of case statements to 
		// know how to handle the different inputs from different types of plot objects.
		// The below switch will only work for 2D function plot type.		
		
		switch (type) {
						
			case "function":
				var skeleton = '<_>';
				var params = [];
				// Get all the function definition inputs. Then loop through them
				var funcs = $(".func-definition" ,div);				
				var param1 = "";
				for (var i = 0; i < funcs.length; i++) {
					// If it's the first time you are adding something then don't add a comma. Otherwise you should.
					// Maybe should check that the input field is not empty.
					if (i === 0) { 
						param1 += $(funcs[i]).val();
					}
					else {
						param1 += ', ' + $(funcs[i]).val();
					}
				}
				params[0] = param1;				
				
				return new Snippet(skeleton, params, 'loc1');
			
			case "domain":
				var skeleton = ", {x, <_>, <_>}";
				var params = [];
				var inputs = $('input',div);
				params[0] = $(inputs[0]).val();
				params[1] = $(inputs[1]).val();				
				return new Snippet(skeleton, params, 'loc2');
				
			case "style":
			    // Get all the select tags
				var selectTags = $('select' ,div); 
				// var tempString = '<_>'  for each select tag.
				var skeleton = ", PlotStyle -> {Directive[<_>, <_>]}";
				var params = [];
							
				// An object that has properties named after options on html form and corresponding values 
				// of their mathematica code.
				var colorHash = {
					1 : "Black",
					2 : "RGBColor[52/255,71/255,183/255]",
					3 : " RGBColor[109/255,96/255,18/255]",
				};
				
				var thicknessHash = {
					1 : "Thick",
					2 : "Thin",					
				};				
				
				// An object with properties that are the html id's of the input boxes. Their properties
				// are functions that get the values in the input boxes and return a string to be put into the params.
				// ...... This is all kinda wonky. There is probably a better way.
				var idToMathematica = {
					style_color : function() {
						return colorHash[$('#style_color').val()];
					},
					style_thickness : function(){
						return thicknessHash[$('#style_thickness').val()];
					}
				};
				
				// Loop through the select tags. Use their ids to know what to do with each one.
				for (var i = 0; i < selectTags.length; i++) {
					// Maybe make a hash table with keys of the ids of the select tags and values of functions
					// to translate values in the select tags into parts of the snippet object... 
					params.push(idToMathematica[$(selectTags[i]).attr('id')]());
				}
				return new Snippet(skeleton, params, 'loc3'); // inputs for a new snippet object = outline, params, location
			
			
			default: 
				console.log("The input did not have a function" + type + ". You might be crazy. Add a case in fillGraphObj!");
				break;
		}
		return;
	}
	
	// Takes the jquery object that is the div of a user specified option. Takes the values in the input fields and returns
	// a snippet object.  
	var inputToSnippet = function(div) {
		
		var type = $(div).attr('id');
		switch (type) {
						
			case "window":
				// Determine how user specifies the viewing window
				var skeleton = 'PlotRange -> {{<_>, <_>}, {<_>, <_>}}';
				// var numVisibleInputs =  ....
				// I think I should rethink how I have the window radio buttons. Make it easy to know how many are not hidden.
				var params = [];
				var visiblePTags = $('p.visible > input' ,div); // This contains some radio buttons. Don't count those
				var numVisibleInputs = 0;
				for(var i = 0; i < visiblePTags.length; i++) {
					if($(visiblePTags[i]).attr('type')==='text') {
						numVisibleInputs++;
					}
				}
				if (numVisibleInputs == 1) {
					var temp = $('#window-max-x1').val();
					params[0] = params[2] = -1 * temp;
					params[1] = params[3] = temp; 
				} else if (numVisibleInputs == 2) {
					  params[0] = params[2] = $('#window-max-x2').val(); 
					  params[1] = params[3] = $('#window-max-y2').val(); 
					}
					else {
						params[0] = $('#window-min-x3').val();  
						params[1] = $('#window-max-x3').val();  
						params[2] = $('#window-min-y3').val();  
						params[3] = $('#window-max-y3').val();  
					}
				
				// make the snippet object using the constructor then return it.	
				 				
				return new Snippet(skeleton, params, 'show2'); // inputs for a new snippet object = outline, params, location
						
				
			case "axisLabel":
				var skeleton = 'AxesLabel -> {Style[<_>, 14], Style[<_>, 14]}';
				var params = [];
				params[0] = $('#axisLabel-x').val();  
				params[1] = $('#axisLabel-y').val(); 
			
				return new Snippet(skeleton, params, 'show2'); // inputs for a new snippet object = outline, params, location;	
			
			case "gridlines":
				var skeleton = "GridLines -> {Table[i, {i, <_>, <_>, <_>}], Table[i, {i, <_>, <_>, <_>}]}, GridLinesStyle -> {{Gray, Opacity[0.3]}, {Gray, Opacity[0.3]}}";
				var params = [];
				params[0] = $('#gridlines-x-min').val();  
				params[1] = $('#gridlines-x-max').val();
				params[2] = $('#gridlines-x-inc').val(); 
				params[3] = $('#gridlines-y-min').val();  
				params[4] = $('#gridlines-y-max').val();
				params[5] = $('#gridlines-y-inc').val(); 
				
				return new Snippet(skeleton, params, 'show2'); // inputs for a new snippet object = outline, params, location;
				
			case "tickmarks":
		        var skeleton = "Ticks -> {Table[i, {i, <_>, <_>, <_>}], Table[i, {i, <_>, <_>, <_>}]}, TicksStyle -> Directive[12]";
				var params = [];
				params[0] = $('#tickmarks-x-min').val();  
				params[1] = $('#tickmarks-x-max').val();
				params[2] = $('#tickmarks-x-inc').val(); 
				params[3] = $('#tickmarks-y-min').val();  
				params[4] = $('#tickmarks-y-max').val();
				params[5] = $('#tickmarks-y-inc').val(); 
				
				return new Snippet(skeleton, params, 'show2'); // inputs for a new snippet object = outline, params, location;

			case "aspectRatio":
				var skeleton = "AspectRatio -> <_>";
				var params = [];
				params[0] = $('#aspectRatio-in').val();
				return new Snippet(skeleton, params, 'show2');
				
				case "text":
				var skeleton = 'Graphics[Text[Style[<_>, 14], {<_>, <_>}]]';
				var params = [];
				params[0] = $('#text-value').val();  
				params[1] = $('#text-x').val(); 
				params[2] = $('#text-y').val();
			
				return new Snippet(skeleton, params, 'show2'); // inputs for a new detail object = outline, params, location;	
				
			case "point":
				var skeleton = 'Graphics[{PointSize[<_>],Point[{<_>, <_>}]}]';
				var params = [];
				params[0] = $('#point-size').val();  
				params[1] = $('#point-x').val(); 
				params[2] = $('#point-y').val();
			
				return new Snippet(skeleton, params, 'show2'); // inputs for a new detail object = outline, params, location;
			
			case "axesOrigin":
				var skeleton = 'AxesOrigin -> {<_>, <_>}';
				var params = [];
				params[0] = $('#axesOrigin-x').val();  
				params[1] = $('#axesOrigin-y').val();  
			
				return new Snippet(skeleton, params, 'show2'); // inputs for a new detail object = outline, params, location;
			
			default: 
				console.log("The input did not have a function" + type + ". You might be crazy. Add a case in fillGraphObj!");
				break;
		}
		return;
	};
	
	function getCode() {
				
		var allTheIds = [];
		var optionDivs = $(".function-option").not(".unwanted");
		var plotDivs = $(".plot").not(".unwanted");
		
		var w = getWaplotObj(plotDivs, optionDivs);
				
		var code = w.toCode();
		var userDefined = $("#user-defined").val();
		code = "<waplot type = 'MathematicaSyntax'>" + 	userDefined + " " + code + " </waplot> ";		
		document.getElementById("waplot-box").value = code;
		
		return;
	}
	
	// Make clicking the + or - collapse 
	$(".collapse").click(function () {

		var $collapse = $(this);
		//getting the next element
		var $content = $collapse.parent().next();
		//open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
		$content.slideToggle(100, function () {
			//execute this after slideToggle is done
			//change text of header based on visibility of content div
			$collapse.text(function () {
				//change text based on condition
				return $content.is(":visible") ? "[-]" : "[+]";
			});
		});
		$content.toggleClass('hidden');

	});
	
	$(".remove").click(function () {

		var $parent = $(this).parent();
		var $content = $parent.next();
		
		// toggle the unwanted class for the corresponding function-option div.
		$content.toggleClass('unwanted');
		$content.toggleClass('hidden');
		
		// then get rid of the optHeader containing class as well.
		$parent.toggleClass('unwanted');
		$parent.toggleClass('hidden');
		

	});
	
	$(".menu-option").click(function () {

		// var $parent = $(this).parent();
		// var $content = $parent.next();
		
		// Find out the id and take off the '-a'.
		var id = $(this).attr('id').split('-')[0];
		var $content = $('#'+id);
		var $optHeader = $content.prev();
		
		// I think I should not use toggling and instead check if it is visible and set the states
		// of the classes. Use something similar to this $content.is(":visible") ? "[-]" : "[+]";
		
		// Display the .function-option associated with that tag
		// Check if the $content is already being displayed or not.
		if($content.hasClass('unwanted')) { // 'unwanted' is hidden and not minimized.
			// Make the $content appear on the left pane.
			$content.toggleClass('unwanted');
			$optHeader.toggleClass('unwanted');
			$content.toggleClass('hidden');
			$optHeader.toggleClass('hidden');	
		} else if ($content.hasClass('hidden')) { // $content is being displayed on the left. Check if minimized 
			// Unminimize the content by calling on the .collapse div click function.
			$content.toggleClass("hidden");
			/*$optHeader.text(function () {
				//change text based on condition
				return $content.is(":visible") ? "[-]" : "[+]";
			});
			*/
		}
				

	});
	
	/*
	* Takes the id from   
	*/
	var formToSnippet = function() {
	
	};
	
	

$(document).ready(main);