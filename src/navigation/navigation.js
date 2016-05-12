/* Created by Armin on 10/17/2015 */

define(["jquery", "moment", "text!navigation/navigation.html", "css!navigation/navigation.css", "common/util"], function ($, moment, $navHtml) {
    "use strict";

	$(window).resize(function () {
		// media query event handler
		if(matchMedia) {
			var mq = window.matchMedia("(max-width: 699px)");
			mq.addListener(widthChange);
			widthChange(mq);
		} else {
			// TODO: for IE < 11
			var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
		}
	});

	function widthChange(mq) {
		var $menu = $("#nav-menu");
		var $mobileNav = $("#mobile-nav");
		var $navToggle = $("#nav-toggle");
		var normal_class = "nav-normal-menu";
		var mobile_class = "nav-mobile-menu";

		if(mq.matches) {
			// width is less than 700px, toggle mobile menu
			if(!$mobileNav.is(":visible")) {
				$navToggle.removeClass("nav-toggle-active");
			}
		} else {
			// width is at least 700px, toggle normal menu
			if($menu.hasClass(mobile_class)) {
				$menu.removeClass(mobile_class).addClass(normal_class);
			}

			if($menu.parents("#mobile-nav").length) {
				$menu.unwrap();
			}

			$menu.find("li > ul").each(function () {
				$(this).removeAttr("style");
			});
		}
	}

	function toggleMenuStyle() {
		var $menu = $("#nav-menu");
		var normal_class = "nav-normal-menu";
		var mobile_class = "nav-mobile-menu";

		if($menu.hasClass(normal_class)) {
			// add mobile navigation
			$menu.removeClass(normal_class).addClass(mobile_class);
			$menu.wrap("<div id='mobile-nav'></div>");

			$("#mobile-nav").animate({ left: "+=280" }, 320);
		} else if($menu.hasClass(mobile_class)) {
			// remove mobile navigation
			$("#mobile-nav").animate({ left: "-=280" }, 320, function () {
				$menu.removeClass(mobile_class).addClass(normal_class);
				$menu.unwrap();
			});
		}
	}

	function updateListItemHandlers() {
        $("#nav-menu li > ul li").each(function () {
            var $li = $(this);
            if ($li.hasClass('update-list-item-handlers'))
                return;
            $li.addClass('update-list-item-handlers');
            $li.on("click", function() {
                var normal_class = "nav-normal-menu";
                var mobile_class = "nav-mobile-menu";
                var $elem = $(this);
                var $parentUL = $elem.parents("#nav-menu");
                var hasSubMenus = $elem.find("ul").length > 0;
                if ($parentUL.hasClass(normal_class)) {
                    if (!hasSubMenus) {
                        $elem.parent("ul").not("#nav-menu").toggleClass("nav-closed");
                    }
                } else if ($parentUL.hasClass(mobile_class)) {
                    if (!hasSubMenus) {
                        $("#mobile-nav").animate({ left: "-=280" }, 320, function () {
                            $("#nav-toggle").removeClass("nav-toggle-active");
                            toggleMenuStyle();
                        });
                    }
                }
            });
        });
		$("#nav-menu.nav-normal-menu li").each(function () {
			$(this).on("mouseover", function () {
				$(this).find("ul.nav-closed").each(function () {
					$(this).removeClass("nav-closed");
				});
			});
		});
	}

	function updateDropdownToggleHandlers() {
		$("#nav-menu a.nav-dropdown-toggle").each(function () {
			var $anchor = $(this);
			if ($anchor.hasClass('update-dropdown-toggle-handlers'))
			    return;
            $anchor.addClass('update-dropdown-toggle-handlers')
			$anchor.on('click', function (e) {
				var $listItem = $anchor.parent();
				var $parentUL = $listItem.parent();

				var isRoot = $parentUL.attr("id") === "nav-menu";
				var mobile_menu_class = "nav-mobile-menu";
				var expanded_class = "submenu-expanded";
				var isMobileMenu = $anchor.parents("#nav-menu").hasClass(mobile_menu_class);

				if(isMobileMenu) {
					var $submenu = $anchor.next("ul");
					if($submenu.length > 0) {
						// reset active classes
						if(isRoot) {
							$("#nav-menu.nav-mobile-menu li").each(function () {
								$(this).removeClass("active");
							});
						}

						if(isRoot) {
							// close all submenus
							$("#nav-menu li > ul").each(function () {
								$(this).slideUp();
							});
						} else {
							$("#nav-menu li > ul").each(function () {
								var $elem = $(this);
								// close all submenus that are NOT open
								if(!$elem.hasClass(expanded_class)) {
									$elem.slideUp();
								}

								// close all submenus within current submenu
								$parentUL.find("li > ul").each(function() {
									if(!$(this).is($submenu)) {
										$(this).slideUp();
									}
								});
							});
						}

						if(isRoot) {
							$listItem.toggleClass("nav-toggle-active");
						}

						if($submenu.is(":visible")) {
							$submenu.slideUp();
							$submenu.removeClass(expanded_class);
						} else {
							$submenu.slideDown();
							$submenu.addClass(expanded_class);
						}
					}
				}

				e.preventDefault();
			});
		});
		updateListItemHandlers();
	}

  function initLoginButton(root){
      var login_menu = root.find('.login');
      var account_menu = root.find('.account').hide();
      var time = root.find('span.time');
      var login_btn = root.find('.login button');
      var logout_btn = root.find('.account .logout');
      var loginid = root.find('.account span.login-id');
      var balance = root.find('.account span.balance').fadeOut();
      var currency = ''; /* will get this from payout_currencies api on login */
      require(['websockets/binary_websockets'],function(liveapi) {

          function update_balance(data) {
              if(!currency) {
                liveapi.send({payout_currencies: 1})
                       .then(function(_data){
                            currency = _data.payout_currencies[0];
                            setTimeout(function() { update_balance(data); }, 0); /* now that we have currency update balance */
                       }).catch(function(err){ console.error(err);})
                  return;
               }

              var value = '0';
              if(data.authorize) value = data.authorize.balance;
              else value = data.balance.balance;

              balance.text(currency + ' ' + formatPrice(value)).fadeIn();
          };

          /* update balance on change */
          liveapi.events.on('balance', update_balance);

          liveapi.events.on('logout', function() {
              $('.webtrader-dialog[data-authorized=true]').dialog('close').dialog('destroy').remove(); /* destroy all authorized dialogs */
              logout_btn.removeAttr('disabled');
              account_menu.fadeOut();
              login_menu.fadeIn();
              loginid.fadeOut();
              // time.fadeOut();
              balance.fadeOut();
              currency = '';
          });

          liveapi.events.on('login', function(data){
              $('.webtrader-dialog[data-authorized=true]').dialog('close').dialog('destroy').remove(); /* destroy all authorized dialogs */
              login_menu.fadeOut();
              account_menu.fadeIn();

              update_balance(data);
              loginid.text('Account ' + data.authorize.loginid).fadeIn();

              /* switch between account on user click */
              $('.account li.info').remove();
              var oauth = JSON.parse(localStorage.getItem('oauth') || "[]");
              oauth.forEach(function(account) {
                if(account.id !== data.authorize.loginid) {
                  var a = $('<a href="#"></a>').html('<span class="ui-icon ui-icon-login"></span>' + account.id);
                  var li = $('<li/>').append(a).addClass('info');
                  li.data(account);
                  li.click(function() {
                    var data = $(this).data();
                    $('.account li.info').remove();
                    liveapi.switch_account(data.id)
                           .catch(function(err){
                              $.growl.error({ message: err.message });
                           })
                  })
                  li.insertBefore(logout_btn.parent());
                }
              });
          });

          login_btn.on('click', function(){
            login_btn.attr('disabled','disabled');
            require(['oauth/login'], function(login_win){
              login_btn.removeAttr('disabled');
              login_win.init();
            });
          });
          logout_btn.on('click', function() {
              liveapi.invalidate();
              logout_btn.attr('disabled', 'disabled');
          });
      });

      /* update time every one minute */
      time.text(moment.utc().format('YYYY-MM-DD HH:mm') + ' GMT');
      setInterval(function(){ time.text(moment.utc().format('YYYY-MM-DD HH:mm') + ' GMT'); }, 15*1000);
  }

	return {
		init: function(_callback) {
            var root = $($navHtml);
            $("body").prepend(root);

      initLoginButton(root);
			//Theme settings
			require(['themes/themes']);

            $("#nav-toggle").on("click", function (e) {
                $("#nav-toggle").toggleClass("nav-toggle-active");
                toggleMenuStyle();

                e.preventDefault();
            });

            updateDropdownToggleHandlers();

            if(_callback) {
                _callback($("#nav-menu"));
            }
		},
    updateDropdownToggles : updateDropdownToggleHandlers
	};
});
