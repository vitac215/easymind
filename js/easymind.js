$(document).ready(function() {

	$(document).on('click', '.main', function() {
		// Unselect all others
		$('.main').attr("selected", false);
		// Select the clicked node
		$(this).attr("selected", true);
	})

	function getText() {
		if ($('.main[selected*="selected"]').length == 0) {
			return;
		}
		var node = $('.main[selected*="selected"]');
		var grandparent = node.parent().parent();
		var text = grandparent[0].childNodes[1].childNodes[0];

		return d3.select(text);
	}

	// Text bold
	$('#text-bold').click( function() {
		var text = getText();
		if (!text) {
			return;
		}
		text.style('font-weight', function(d) {
			if (d.text_bold == false) {
				d.text_bold = true;
				return "bold";
			} else {
				d.text_bold = false;
				return "normal";
			}
		})
	})

	// Text italic
	$('#text-italic').click( function() {
		var text = getText();
		if (!text) {
			return;
		}
		text.style('font-style', function(d) {
			if (d.text_italic == false) {
				d.text_italic = true;
				return "italic";
			} else {
				d.text_italic = false;
				return "normal";
			}
		})
	})

	// Text color
	$('#text-color').colorpicker().on('changeColor', function(e) {
		var text = getText();
		if (!text) {
			return;
		}
		text.style('fill', function(d) {
			d.text_color = e.color.toHex();
			return d.text_color;
		})
	});

	// Node color
	$('#node-color').colorpicker().on('changeColor', function(e) {
		var node = d3.select('.main[selected*="selected"]');
		if (!node) {
			return;
		}
		node.style('fill', function(d) {
			d.color = e.color.toHex();
			return d.color;
		})
	});

	// Save as img
	// $('#save').click( function(e) {
	// 	e.preventDefault(); 
	// 	// Append the svg data
	// 	var svgData = $('svg')[0].outerHTML;
	// 	var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
	// 	var svgUrl = URL.createObjectURL(svgBlob);

	// 	// Create a link and download it
	// 	var downloadLink = document.createElement("a");
	// 	downloadLink.href = svgUrl;
	// 	downloadLink.download = "newesttree.svg";
	// 	document.body.appendChild(downloadLink);
	// 	downloadLink.click();
	// 	document.body.removeChild(downloadLink);
	// });

	$('#save').click( function(e) {
		e.preventDefault(); 

		var doctype = '<?xml version="1.0" standalone="no"?>'
		  + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

		var source = (new XMLSerializer()).serializeToString(d3.select('svg').node());
		var blob = new Blob([ doctype + source], { type: 'image/svg+xml;charset=utf-8' });
		var url = window.URL.createObjectURL(blob);

		console.log(url);

		var downloadLink = document.createElement("a");
		downloadLink.href = url;
		downloadLink.download = "output.png";
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
	});

	// d3.select("#save").on("click", function(){
	// 	var html = d3.select("svg")
	// 	    .attr("version", 1.1)
	// 	    .attr("xmlns", "http://www.w3.org/2000/svg")
	// 	    // .node().parentNode.innerHTML;
	// 	    .node().innerHTML;

	// 	// console.log(html);
	// 	html += '<?xml-stylesheet href="css/tree.css" type="text/css"?>';
	// 	var imgsrc = 'data:image/svg+xml;base64,'+ btoa(html);
	// 	var img = '<img src="'+imgsrc+'">'; 
	// 	d3.select("#svgdataurl").html(img);


	// 	var canvas = document.createElement("canvas"),
	// 		context = canvas.getContext("2d");

	// 	var image = new Image;
	// 	image.src = imgsrc;

	// 	console.log(image);

	// 	image.onload = function() {
	// 		context.drawImage(image, 0, 0);

	// 		var canvasdata = canvas.toDataURL("image/png");

	// 		console.log(canvasdata);

	// 		var pngimg = '<img src="'+canvasdata+'">'; 
	// 		d3.select("#pngdataurl").html(pngimg);

	// 		var a = document.createElement("a");
	// 		a.download = "sample.png";
	// 		a.href = canvasdata;
	// 		a.click();
	// 	};

	// });
});