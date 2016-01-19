/**
 * File: LeftAndMain.Ping.js
 */
(function($) {
	$.entwine('ss.ping', function($){

		$('.cms-container').entwine(/** @lends ss.Form_EditForm */{
			/**
			 * Variable: PingIntervalSeconds
			 * (Number) Interval in which /Security/ping will be checked for a valid login session.
			 */
			PingIntervalSeconds: 5*60,
			
			onadd: function() {
				this._setupPinging();
				this._super();
			},

			/**
			 * Function: _setupPinging
			 *
			 * This function is called by prototype when it receives notification that the user was logged out.
			 * It uses /Security/ping for this purpose, which should return '1' if a valid user session exists.
			 * It redirects back to the login form if the URL is either unreachable, or returns '0'.
			 */
			_setupPinging: function() {
				var onSessionLost = function(xmlhttp, status) {
					if(xmlhttp.status > 400 || xmlhttp.responseText == 0) {
						// TODO will pile up additional alerts when left unattended
						if(window.open('Security/login')) {
							alert('Please log in and then try again');
						} else {
							alert('Please enable pop-ups for this site');
						}
					}
				};

				// start hamaka hmk custom - fix ping errors
				// ipv te pingen naar '../Security/ping' gaan we die url baseren op de base href om fake uitlog meldingen te voorkomen
				var bases = document.getElementsByTagName('base');
				var baseHref = null;

				if (bases.length > 0) {
						baseHref = bases[0].href;
				}

				var sUrl;

				if(baseHref != null)
				{
					sUrl = baseHref + 'Security/ping';
				}
				else
				{
					sUrl = '../Security/ping';
				}
				// setup pinging for login expiry
				setInterval(function() {
					$.ajax({
						url: sUrl,
						//url: '../Security/ping',
						global: false,
						type: 'POST',
						complete: onSessionLost
					});
				}, this.getPingIntervalSeconds() * 1000);

				// end hamaka hmk custom - fix ping errors
			}
		});
	});
}(jQuery));
