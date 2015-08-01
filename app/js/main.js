// plugin for tooltip
$.fn.tooltip = function (options) {
	option = {
		position	: options.position || 'right',
		content		: options.content || 'Im a tooltip'
	};
	var markup = '<div class="tooltip tooltip-' + options.position + '">\
			<div class="tooltip__inner">\
				' + options.content + '\
			</div>\
		</div>';

	var $this = this,
		body = $('body');

	$this
		.addClass('tooltipped')
		.attr('data-tooltip-position', options.position);

	body.append(markup);

	_positioning($this, body.find('.tooltip').last(), options.position);


	$(document).on('click', function(){
		$('.tooltip').remove();
	});

	$(window).on('resize', function(){

		var
			tooltips = $('.tooltip');

		var
			tooltipsArray = [];

		tooltips.each(function(){
			tooltipsArray.push($(this));
		});

		$('.tooltipped').each(function(index){
			var
				position = $(this).data('tooltip-position');

			_positioning($(this), tooltipsArray[index], position);
		});

	});

	function _positioning(elem, tooltip, position) {
		var
			elemWidth	= elem.outerWidth(true),
			elemHeight	= elem.outerHeight(true),
			topEdge		= elem.offset().top,
			bottomEdge	= topEdge + elemHeight,
			leftEdge	= elem.offset().left,
			rightEdge	= leftEdge + elemWidth;

		var
			tooltipWidth	= tooltip.outerWidth(true),
			tooltipHeight	= tooltip.outerHeight(true),
			leftCentered	= (elemWidth / 2) - (tooltipWidth / 2),
			topCentered		= (elemHeight / 2) - (tooltipHeight / 2);


		var positions = {};

		switch (position) {
			case 'right' :
				positions = {
					left : rightEdge,
					top : topEdge + topCentered
				};
				break;
			case 'top' :
				positions = {
					left: leftEdge + leftCentered,
					top : topEdge - tooltipHeight
				};
				break;
			case 'bottom' :
				positions = {
					left : leftEdge + leftCentered,
					top : bottomEdge
				};
				break;
			case 'left' :
				positions = {
					left : leftEdge - tooltipWidth,
					top : topEdge + topCentered
				};
				break;
		}

		tooltip
			.offset(positions)
			.css('opacity', '1');
		}
};

var module = (function () {

		function _openForm (e) {
			e.preventDefault();

			$('#open-popup').fadeIn();
			$('#add-project').slideDown(1000);
			$('.error').removeClass('error');
		}

		function _closeForm(e) {
			e.preventDefault();

			$('#open-popup').fadeOut();
			$('#add-project').slideUp(1000);

		}

		function _submitForm (e) {
			e.preventDefault();

			var form = $(this);

			if (_validate(form) === false) {
				return false;
			}
			console.log('You can do ajax!');
		}

		function _validate (form) {

			var textType = form.find("[data-validation='text']"),
				mailType = form.find("[data-validation='email']"),
				fileType = form.find("[data-validation='file']"),
				valid = true;

				textType.each(function(){
					var $this		= $(this),
						notEmptyVal = !!$this.val(),
						error		= "Fill out this field";

					if(notEmptyVal){
						return valid;
					}else {
						$this.addClass('error')
						.tooltip({
							content : error,
							position : 'left'
						});
						valid = false;
					}
				});

				fileType.each(function(){
					var $this		= $(this),
						notEmptyVal = !!$this.val(),
						error		= 'Please, add image';

					if(notEmptyVal){
						return valid;
					}else{
						$this.addClass('error')
						.tooltip({
							content : error,
							position : 'left'
						});
						valid = false;
					}
				});

				mailType.each(function(){
					var $this		= $(this),
						regExp		= /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/,
						goodMail	= regExp.test($this.val());

					if(goodMail){
						return valid;
					}else{
						$this.addClass('error')
						.tooltip({
							content : 'Enter your e-mail',
							position : 'bottom'
						});
						valid = false;
					}
				});
			return valid;
		}

		function _removeError () {
			$(this).removeClass('error');
		}

		function _resetBtn () {
			$('.error').removeClass('error');
		}
		return {
			init : function () {
				this.setUpListeners();
				if (!Modernizr.input.placeholder) {
					$('input, textarea').placeholder();
				}

			},

			setUpListeners : function() {
				$('#add-new-proj').on('click', _openForm);
				$('#close-popup').on('click', _closeForm);
				$('form').on('submit', _submitForm);
				$('form').on('keydown', 'input, textarea', _removeError);
				$('form').on('reset', _resetBtn);
			}
	};
}());
module.init();