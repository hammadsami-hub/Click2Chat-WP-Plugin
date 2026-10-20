/*!
 * Click2Chat – frontend script (vanilla JS, no dependencies)
 */
( function () {
	'use strict';

	var widgets = document.querySelectorAll( '.c2c-widget' );
	if ( ! widgets.length ) {
		return;
	}

	function emit( name, widget ) {
		try {
			document.dispatchEvent( new CustomEvent( 'click2chat:' + name, { detail: { widget: widget } } ) );
		} catch ( e ) {}
	}

	function init( widget ) {
		var btn = widget.querySelector( '.c2c-btn' );
		var popup = widget.querySelector( '.c2c-popup' );
		var close = widget.querySelector( '.c2c-close' );
		var start = widget.querySelector( '.c2c-start' );

		if ( ! btn ) {
			return;
		}

		if ( ! popup ) {
			btn.addEventListener( 'click', function () {
				emit( 'click', widget );
			} );
			return;
		}

		function isOpen() {
			return ! popup.hidden;
		}

		function open() {
			popup.hidden = false;
			widget.classList.add( 'c2c-open' );
			btn.setAttribute( 'aria-expanded', 'true' );
			emit( 'open', widget );
		}

		function shut( returnFocus ) {
			popup.hidden = true;
			widget.classList.remove( 'c2c-open' );
			btn.setAttribute( 'aria-expanded', 'false' );
			if ( returnFocus ) {
				btn.focus();
			}
			emit( 'close', widget );
		}

		function toggle() {
			if ( isOpen() ) {
				shut( false );
			} else {
				open();
			}
		}

		btn.addEventListener( 'click', function ( e ) {
			e.preventDefault();
			toggle();
		} );

		// Anchors with role="button" must also react to the Space key.
		btn.addEventListener( 'keydown', function ( e ) {
			if ( e.key === ' ' || e.key === 'Spacebar' ) {
				e.preventDefault();
				toggle();
			}
		} );

		if ( close ) {
			close.addEventListener( 'click', function () {
				shut( true );
			} );
		}

		if ( start ) {
			start.addEventListener( 'click', function () {
				emit( 'click', widget );
			} );
		}

		document.addEventListener( 'keydown', function ( e ) {
			if ( ( e.key === 'Escape' || e.key === 'Esc' ) && isOpen() ) {
				shut( true );
			}
		} );

		document.addEventListener( 'click', function ( e ) {
			if ( isOpen() && ! widget.contains( e.target ) ) {
				shut( false );
			}
		} );

		var seconds = parseInt( widget.getAttribute( 'data-autoopen' ), 10 );
		if ( seconds > 0 ) {
			var seen = false;
			try {
				seen = window.sessionStorage.getItem( 'click2chat_auto' ) === '1';
			} catch ( err ) {}

			if ( ! seen ) {
				window.setTimeout( function () {
					if ( ! isOpen() ) {
						open();
					}
					try {
						window.sessionStorage.setItem( 'click2chat_auto', '1' );
					} catch ( err ) {}
				}, seconds * 1000 );
			}
		}
	}

	Array.prototype.forEach.call( widgets, init );
} )();
