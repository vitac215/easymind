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
});