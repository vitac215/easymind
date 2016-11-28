$(document).ready(function() {

	// Hide the first node's delete button
	$('.node > .circles:nth-child(2) > .delete').css("display", "none");

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
		var text = grandparent[0].childNodes[0].childNodes[0];
		// $(text).css({ fill: "#ff0000" })
		return text;
	}

	// Text bold
	$('#text-bold').click( function() {
		var text = getText();
		if (!text) {
			return;
		}
		if ($(text).css('font-weight') == "bold") {
			$(text).css({ 'font-weight': 'normal' });
		} else {
			$(text).css({ 'font-weight': 'bold' })
		}
	})

	// Text italic
	$('#text-italic').click( function() {
		var text = getText();
		if (!text) {
			return;
		}
		if ($(text).css('font-style') == 'italic') {
			$(text).css({ 'font-style': 'normal' })
		} else {
			$(text).css({ 'font-style': 'italic' })
		}
	})
});