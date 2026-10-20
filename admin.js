/*!
 * Click2Chat – admin dashboard: tabs, colour pickers, media uploader, live preview.
 */
( function ( $ ) {
	'use strict';

	var cfg = window.click2chatAdmin || {};
	var form = document.getElementById( 'c2c-form' );
	if ( ! form ) {
		return;
	}

	var OPT = cfg.option || 'click2chat_settings';
	var i18n = cfg.i18n || {};
	var icons = cfg.icons || {};
	var FRAMES = {
		desktop: { w: 1280, h: 720, max: 0 },
		tablet: { w: 820, h: 900, max: 340 },
		mobile: { w: 390, h: 760, max: 220 }
	};
	var device = 'desktop';
	var popupOpen = false;

	var widget = document.getElementById( 'c2c-preview-widget' );
	var frame = document.getElementById( 'c2c-frame' );
	var screenEl = document.getElementById( 'c2c-screen' );
	var note = document.getElementById( 'c2c-preview-note' );
	var popupBtn = document.getElementById( 'c2c-toggle-popup' );

	/* ---------- form readers ---------- */
	function field( name ) {
		return form.elements[ OPT + '[' + name + ']' ];
	}
	function val( name ) {
		var e = field( name );
		return e ? String( e.value ) : '';
	}
	function chk( name ) {
		var e = field( name );
		return !! ( e && e.checked );
	}
	function dfield( dev, key ) {
		return form.elements[ OPT + '[devices][' + dev + '][' + key + ']' ];
	}
	function dval( dev, key ) {
		var e = dfield( dev, key );
		return e ? String( e.value ) : '';
	}
	function dchk( dev, key ) {
		var e = dfield( dev, key );
		return !! ( e && e.checked );
	}
	function num( v, def ) {
		var n = parseInt( v, 10 );
		return isNaN( n ) ? def : n;
	}
	function el( tag, cls, text ) {
		var node = document.createElement( tag );
		if ( cls ) {
			node.className = cls;
		}
		if ( text ) {
			node.textContent = text;
		}
		return node;
	}
	function hasText( design ) {
		return [ 2, 4, 5 ].indexOf( design ) > -1;
	}

	/* ---------- CSS variables (mirrors Click2Chat_Frontend::device_vars) ---------- */
	function colorVars() {
		return {
			'--c2c-bg': val( 'button_bg' ),
			'--c2c-color': val( 'button_color' ),
			'--c2c-hover': val( 'hover_bg' ),
			'--c2c-accent': val( 'accent' ),
			'--c2c-font': num( val( 'font_size' ), 15 ) + 'px',
			'--c2c-shadow': chk( 'shadow' ) ? '0 6px 18px rgba(0,0,0,.28)' : 'none'
		};
	}

	function deviceVars( dev, design ) {
		var size = num( dval( dev, 'size' ), 60 );
		var ox = num( dval( dev, 'ox' ), 24 ) + 'px';
		var oy = num( dval( dev, 'oy' ), 24 ) + 'px';
		var h = dval( dev, 'h' );
		var v = dval( dev, 'v' );
		var label = hasText( design ) && dchk( dev, 'label' ) && val( 'button_text' ).trim() !== '';
		var tx = '0';
		var ty = '0';
		var vars = {
			'--c2c-size': size + 'px',
			'--c2c-icon': Math.round( size * 0.5 ) + 'px',
			'--c2c-pad': label ? Math.round( size * 0.4 ) + 'px' : '0px',
			'--c2c-label-display': label ? 'inline' : 'none',
			'--c2c-left': 'auto',
			'--c2c-right': 'auto',
			'--c2c-top': 'auto',
			'--c2c-bottom': 'auto'
		};

		if ( h === 'left' ) {
			vars[ '--c2c-left' ] = ox;
		} else if ( h === 'right' ) {
			vars[ '--c2c-right' ] = ox;
		} else {
			vars[ '--c2c-left' ] = '50%';
			tx = '-50%';
		}
		if ( v === 'top' ) {
			vars[ '--c2c-top' ] = oy;
		} else if ( v === 'bottom' ) {
			vars[ '--c2c-bottom' ] = oy;
		} else {
			vars[ '--c2c-top' ] = '50%';
			ty = '-50%';
		}
		vars[ '--c2c-transform' ] = ( tx === '0' && ty === '0' ) ? 'none' : 'translate(' + tx + ',' + ty + ')';

		vars[ '--c2c-pop-top' ] = v === 'top' ? 'calc(100% + 12px)' : 'auto';
		vars[ '--c2c-pop-bottom' ] = v === 'top' ? 'auto' : 'calc(100% + 12px)';
		vars[ '--c2c-pop-left' ] = h === 'left' ? '0' : ( h === 'center' ? '50%' : 'auto' );
		vars[ '--c2c-pop-right' ] = h === 'right' ? '0' : 'auto';
		vars[ '--c2c-pop-transform' ] = h === 'center' ? 'translateX(-50%)' : 'none';
		return vars;
	}

	function applyVars( node, vars ) {
		Object.keys( vars ).forEach( function ( k ) {
			node.style.setProperty( k, vars[ k ] );
		} );
	}

	/* ---------- element builders ---------- */
	function fillIcon( holder ) {
		var key = val( 'icon' );
		var url = val( 'custom_icon' ).trim();
		holder.textContent = '';
		if ( key === 'custom' && /^https?:\/\//i.test( url ) ) {
			var img = document.createElement( 'img' );
			img.alt = '';
			img.src = url;
			holder.appendChild( img );
		} else {
			holder.innerHTML = icons[ key === 'custom' ? 'whatsapp' : key ] || icons.whatsapp || '';
		}
	}

	function buildButton() {
		var a = el( 'a', 'c2c-btn' );
		a.href = '#';
		a.setAttribute( 'aria-label', val( 'aria_label' ) );
		var ic = el( 'span', 'c2c-icon' );
		ic.setAttribute( 'aria-hidden', 'true' );
		fillIcon( ic );
		a.appendChild( ic );
		a.appendChild( el( 'span', 'c2c-label', val( 'button_text' ) ) );
		return a;
	}

	function buildPopup() {
		var p = el( 'div', 'c2c-popup' );
		var head = el( 'div', 'c2c-popup-head' );
		var av = el( 'span', 'c2c-avatar' );
		fillIcon( av );
		head.appendChild( av );
		var meta = el( 'span', 'c2c-popup-meta' );
		meta.appendChild( el( 'strong', '', val( 'popup_title' ) ) );
		meta.appendChild( el( 'span', '', val( 'popup_subtitle' ) ) );
		head.appendChild( meta );
		var close = el( 'button', 'c2c-close' );
		close.type = 'button';
		close.innerHTML = icons.close || '';
		head.appendChild( close );
		p.appendChild( head );

		var body = el( 'div', 'c2c-popup-body' );
		if ( val( 'welcome_message' ).trim() !== '' ) {
			body.appendChild( el( 'div', 'c2c-bubble', val( 'welcome_message' ) ) );
		}
		p.appendChild( body );

		var foot = el( 'div', 'c2c-popup-foot' );
		var start = el( 'a', 'c2c-start' );
		start.href = '#';
		var si = el( 'span', 'c2c-icon' );
		si.innerHTML = icons.whatsapp || '';
		start.appendChild( si );
		start.appendChild( el( 'span', '', val( 'popup_button' ) ) );
		foot.appendChild( start );
		p.appendChild( foot );
		return p;
	}

	/* ---------- rendering ---------- */
	function designValue() {
		return num( val( 'design' ), 1 );
	}

	function renderMinis() {
		var hosts = form.querySelectorAll( '.c2c-mini-host' );
		Array.prototype.forEach.call( hosts, function ( host ) {
			var design = num( host.getAttribute( 'data-design' ), 1 );
			var w = el( 'span', 'c2c-widget c2c-mini c2c-design-' + design );
			var vars = colorVars();
			var label = hasText( design ) && val( 'button_text' ).trim() !== '';
			vars[ '--c2c-size' ] = '44px';
			vars[ '--c2c-icon' ] = '22px';
			vars[ '--c2c-pad' ] = label ? '18px' : '0px';
			vars[ '--c2c-label-display' ] = label ? 'inline' : 'none';
			vars[ '--c2c-font' ] = '13px';
			applyVars( w, vars );
			var b = buildButton();
			b.setAttribute( 'tabindex', '-1' );
			w.appendChild( b );
			host.textContent = '';
			host.appendChild( w );
		} );
	}

	function renderPreview() {
		var design = designValue();
		var classes = [ 'c2c-widget', 'c2c-is-preview', 'c2c-design-' + design ];
		var vis = dchk( device, 'visible' );

		if ( chk( 'animation_enabled' ) ) {
			classes.push( 'c2c-anim-' + val( 'animation' ) );
		}
		if ( chk( 'hover_effect' ) ) {
			classes.push( 'c2c-hover-fx' );
		}
		var showPopup = popupOpen && chk( 'popup_enabled' ) && vis;
		if ( showPopup ) {
			classes.push( 'c2c-open' );
		}

		widget.className = classes.join( ' ' );
		widget.removeAttribute( 'style' );
		var vars = colorVars();
		var dv = deviceVars( device, design );
		Object.keys( dv ).forEach( function ( k ) {
			vars[ k ] = dv[ k ];
		} );
		vars[ '--c2c-display' ] = vis ? 'block' : 'none';
		vars[ '--c2c-z' ] = '5';
		applyVars( widget, vars );

		widget.textContent = '';
		if ( showPopup ) {
			widget.appendChild( buildPopup() );
		}
		widget.appendChild( buildButton() );

		if ( ! vis ) {
			note.textContent = i18n.hidden || '';
		} else if ( val( 'number' ).replace( /\D+/g, '' ) === '' ) {
			note.textContent = i18n.noNumber || '';
		} else {
			note.textContent = '';
		}

		if ( popupBtn ) {
			popupBtn.textContent = popupOpen ? ( i18n.hidePopup || '' ) : ( i18n.showPopup || '' );
			popupBtn.disabled = ! chk( 'popup_enabled' );
		}
	}

	function scaleFrame() {
		var d = FRAMES[ device ];
		var host = frame.parentNode;
		var cs = window.getComputedStyle( host );
		var avail = host.clientWidth - ( parseFloat( cs.paddingLeft ) || 0 ) - ( parseFloat( cs.paddingRight ) || 0 );
		if ( avail < 50 ) {
			return;
		}
		var w = d.max ? Math.min( avail, d.max ) : avail;
		var k = ( w - 2 ) / d.w; // minus the 1px frame border on each side.
		screenEl.style.width = d.w + 'px';
		screenEl.style.height = d.h + 'px';
		screenEl.style.transform = 'scale(' + k + ')';
		frame.style.width = w + 'px';
		frame.style.height = Math.round( d.h * k ) + 2 + 'px';
	}

	var raf = null;
	function render() {
		if ( raf ) {
			window.cancelAnimationFrame( raf );
		}
		raf = window.requestAnimationFrame( function () {
			raf = null;
			renderMinis();
			renderPreview();
			scaleFrame();
		} );
	}
	window.click2chatRender = render;

	/* ---------- tabs ---------- */
	var tabs = Array.prototype.slice.call( form.querySelectorAll( '.c2c-tab' ) );
	var panels = Array.prototype.slice.call( form.querySelectorAll( '.c2c-panel' ) );
	var STORE = 'click2chat_tab';

	function activate( slug, focus ) {
		var found = tabs.some( function ( t ) {
			return t.getAttribute( 'data-tab' ) === slug;
		} );
		if ( ! found ) {
			slug = 'general';
		}
		tabs.forEach( function ( t ) {
			var on = t.getAttribute( 'data-tab' ) === slug;
			t.setAttribute( 'aria-selected', on ? 'true' : 'false' );
			t.tabIndex = on ? 0 : -1;
			if ( on && focus ) {
				t.focus();
			}
		} );
		panels.forEach( function ( p ) {
			p.hidden = p.id !== 'c2c-panel-' + slug;
		} );
		try {
			window.sessionStorage.setItem( STORE, slug );
		} catch ( e ) {}
		scaleFrame();
	}

	tabs.forEach( function ( t, i ) {
		t.addEventListener( 'click', function () {
			activate( t.getAttribute( 'data-tab' ), false );
		} );
		t.addEventListener( 'keydown', function ( e ) {
			var next = null;
			if ( e.key === 'ArrowRight' ) {
				next = tabs[ ( i + 1 ) % tabs.length ];
			} else if ( e.key === 'ArrowLeft' ) {
				next = tabs[ ( i - 1 + tabs.length ) % tabs.length ];
			} else if ( e.key === 'Home' ) {
				next = tabs[ 0 ];
			} else if ( e.key === 'End' ) {
				next = tabs[ tabs.length - 1 ];
			}
			if ( next ) {
				e.preventDefault();
				activate( next.getAttribute( 'data-tab' ), true );
			}
		} );
	} );

	var initial = 'general';
	try {
		initial = window.sessionStorage.getItem( STORE ) || 'general';
	} catch ( e ) {}
	activate( initial, false );

	/* ---------- preview controls ---------- */
	Array.prototype.forEach.call( form.querySelectorAll( '.c2c-device' ), function ( b ) {
		b.addEventListener( 'click', function () {
			device = b.getAttribute( 'data-device' );
			Array.prototype.forEach.call( form.querySelectorAll( '.c2c-device' ), function ( o ) {
				o.setAttribute( 'aria-pressed', o === b ? 'true' : 'false' );
			} );
			render();
		} );
	} );

	if ( popupBtn ) {
		popupBtn.addEventListener( 'click', function () {
			popupOpen = ! popupOpen;
			render();
		} );
	}

	widget.addEventListener( 'click', function ( e ) {
		e.preventDefault();
		var t = e.target;
		if ( t.closest && t.closest( '.c2c-close' ) ) {
			popupOpen = false;
			render();
		} else if ( t.closest && t.closest( '.c2c-btn' ) && chk( 'popup_enabled' ) ) {
			popupOpen = ! popupOpen;
			render();
		}
	} );

	/* ---------- inputs ---------- */
	form.addEventListener( 'input', render );
	form.addEventListener( 'change', render );
	window.addEventListener( 'resize', scaleFrame );

	// Colour pickers.
	$( '.c2c-color' ).wpColorPicker( {
		change: function ( event, ui ) {
			$( event.target ).val( ui.color.toString() );
			render();
		},
		clear: function () {
			render();
		}
	} );

	// Media uploader for the custom icon.
	var mediaFrame = null;
	$( '#c2c-upload' ).on( 'click', function ( e ) {
		e.preventDefault();
		if ( ! window.wp || ! wp.media ) {
			return;
		}
		if ( ! mediaFrame ) {
			mediaFrame = wp.media( {
				title: i18n.mediaTitle,
				button: { text: i18n.mediaButton },
				library: { type: 'image' },
				multiple: false
			} );
			mediaFrame.on( 'select', function () {
				var att = mediaFrame.state().get( 'selection' ).first().toJSON();
				$( '#c2c_custom_icon' ).val( att.url );
				$( 'input[name="' + OPT + '[icon]"][value="custom"]' ).prop( 'checked', true );
				render();
			} );
		}
		mediaFrame.open();
	} );
	$( '#c2c-remove-icon' ).on( 'click', function () {
		$( '#c2c_custom_icon' ).val( '' );
		var current = $( 'input[name="' + OPT + '[icon]"]:checked' ).val();
		if ( current === 'custom' ) {
			$( 'input[name="' + OPT + '[icon]"][value="whatsapp"]' ).prop( 'checked', true );
		}
		render();
	} );

	render();
	window.setTimeout( scaleFrame, 150 );
} )( jQuery );
