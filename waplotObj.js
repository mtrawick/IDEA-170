/* Constructors for the snippet object
*  outline is a string that represents the skeleton of the mathematica code. It has
*          <_> in the place of where the parameters should go.
*
*  params is an array holding the parameters to be put into the outline.
*
*  location is a string representing where in the mathematica code should the snippet
*           be placed. Look at the object the snippet is being placed into to 
*           to know what location is appropriate.
*/
function Snippet(outline, params, location) {
	this.outline = outline;
	this.params = params;
	this.location = location;
	
	
	this.toCode = function() {
		var output = this.outline;
		// Loop through the outline and replace the nth <_> with the nth parameter
		var paramIndex = 0;
		while (paramIndex < this.params.length) {
			// Replace the next instance of <_> with the next parameter
			output = output.replace('<_>', this.params[paramIndex]);
			paramIndex++;
		}
		return output;
	};	
} 

/*
*  
*  snippets is an array of snippets objects
*  type is the type of plot Plot, ListPlot, ParametricPlot, etc
*/
function Plot(type, snippets) {
	
	this.type = type;
	this.snippets = snippets;
	
	this.toCode = function() {
		
		// p1 = Plot[{}]
		var code = this.type + '[ {(*loc1*)}(*loc2*)(*loc3*)];';
		
		// Loop through the snippets and add each snippet
		var codeToInsert, insertSpot = '';
		if (snippets != undefined) {
		  for (var i = 0; i < snippets.length; i++) {
			 codeToInsert = snippets[i].toCode();
			 insertSpot = '(*'+snippets[i].location+'*)';
			 code = code.replace(insertSpot, insertSpot + codeToInsert);
		  }
		}
		
		// Remove the mathematica comments.
		code = code.replace(/\(\*.*?\*\)/g, '');
		return code;
	}
	
	this.addSnippet = function(d) {
	    snippets.push(d);
	};
	
}

/* Constructor for waplot object
*  snippets is an array of snippet objects.  You can send in an empty array and then use the addSnippet() 
*  method to add more later.
*  plots is an array of plot objects
*  
*  Need to see if this works
*
*/
function Waplot(plots, snippets) {
	this.plots = plots;
	this.snippets = snippets;

	this.addSnippet = function(d) {
	    snippets.push(d);
	};
	
	this.addPlot = function(p) {
	    plots.push(p);
	};
	
	this.toCode = function() {
		var code = '';
		for (var i = 0; i < plots.length; i++) {
			code += code + 'p' + i + ' = ' + plots[i].toCode();
		}
		
		// Make a list of all the names of the plots so you can add them to the Show[].
		var names = '';
		for (var i = 0; i < plots.length; i++) {
			if (i === 0) {
				names += 'p' + i;
			}
			else {
				names += ', p' + i;
			}
		}
		
		// The mathematica comments (* *) are put into to serve as place holders. 
		// The comments are used to add snippets to those spots in code.
		code += " Show[" + names + "(*show1*)(*show2*)]";		
		
		// Loop through the snippets and add each snippet
		var codeToInsert, insertSpot = '';
		if (snippets != undefined) {
		  for (var i = 0; i < snippets.length; i++) {
			 codeToInsert = snippets[i].toCode();
			 insertSpot = '(*'+snippets[i].location+'*)';
			 code = code.replace(insertSpot, insertSpot + ', ' + codeToInsert);
		  }
		}
		
		// Remove the mathematica comments.
		code = code.replace(/\(\*.*?\*\)/g, '');
		return code;
	};
}

/* Try to use the waplot object to make the code for a mathematica plot.
*  This was used in a snippet to see that it works.
var func = 'Sin[x]';
var indep = 'x';
var min = '-Pi';
var max = 'Pi';
var snippets = [];

var w = new Waplot(func, indep, min, max, snippets);
var styleSkeleton = 'PlotStyle -> {Directive[<_>, <_>]}';
var params = ['Thick','Black'];
var loca = 'func1';
var style = new Snippet(styleSkeleton, params, loca);


var skeleton = 'AxesLabel -> {Style[<_>, 14], Style[<_>, 14]}';
params = ['x', 'y'];
loca = 'show2';
var axis = new Snippet(skeleton, params, loca);

w.addSnippet(style);
w.addSnippet(axis);

console.log(w.toCode());
*/