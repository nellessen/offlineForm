/*!
 * jQuery Plugin offlineForm v0.1
 * http://davidn.de/
 *
 * Copyright 2011, David Nellessen
 * license: Public domain
 *
 * Inspired by Alex Gibson
 * http://miniapps.co.uk/
 */
(function($) {
    // Create main plugin function jQueries designated name space.
    $.fn.offlineForm = function(options) {
        // Apply default options.
        options = $.extend({}, $.fn.offlineForm.defaults, options || {});
        // Send data to the remote server.
        function sendDataToServer(serialized_form, success_callback) {
            var form_object = JSON.parse(serialized_form);
            console.log('Sending offline form data to server . Url: ' + form_object.url + ' | Form:' + form_object.form);
            
            // Send form using a ajax request.
            $.post(form_object.url, form_object.form, function(data) {
              success_callback();
              console.log("Success sending offline form: " + serialized_form);
            });
        }

        function submitForm(form) {
            // If online, proceed with normal form submission.
            if (navigator.onLine) return true;
            // If offline, save form in localstorage.
            saveDataLocally(form);
            // Prevent form form beeing submitted when offline.
            return false;
        }

        //called on submit if device is offline from processData()
        function saveDataLocally(unserialized_form) {

            var timeStamp = new Date().getTime();
            // @todo: Check if relative urls work!
            var url = unserialized_form.attr('action') || location.href;
            var serialized_form = JSON.stringify({'url': url, 'time': timeStamp, 'form': unserialized_form.serialize()});
            
            try {
                localStorage.setItem(timeStamp, serialized_form);
                console.log('Saved form locally: ' + timeStamp + ': ' + serialized_form);
                if (typeof options.callbackMessage === 'function')
                  options.callbackMessage(options.textMessage);
            } catch (e) {
                if (e == QUOTA_EXCEEDED_ERR) {
                    console.log('Local Storage quota exceeded!');
                }
            }
            
            // About count info.
            updateCount();
        }

        // Sends locally stored data to the external host.
        function sendLocalDataToServer() {
            // Helper function 
            // http://stackoverflow.com/questions/750486/javascript-closure-inside-loops-simple-practical-example
            function createDeleteCallback(keyDelete) {
                return function(){ // Callback on success.
                    // Remove Item
                    console.log('Delete Local Storage entry ' + keyDelete);
                    window.localStorage.removeItem(keyDelete);
                    // About count info.
                    updateCount();
                };
            }
            
            // Iterate all items.
            for (var key in localStorage){
                var value = window.localStorage.getItem(key); 
                console.log('Loading Local Storage Item. Key: ' + key + ' | Value: ' + value);
                sendDataToServer(value, createDeleteCallback(key));
            }
            
        }

        //called when device goes online
        function goneOnline(){
            // Notify user about online status.
            notifyUserIsOnline();
            // Start sending cached forms.
            sendLocalDataToServer();
        }
        //called when device goes offline
        function goneOffline(){
            // Notify user about offline status.
            notifyUserIsOffline();
        }

        // Notifies users about beeing online.
        function notifyUserIsOnline() {
            var status = $('#offlineForm-status');
            var offlineForm = $('#offlineForm');
            offlineForm.addClass('onLine');
            offlineForm.removeClass('offline');
            if (options.applyStyles) $('#offlineForm').css('background-color', 'green');
            status.html('Connectivity');
        }
        // Notifies users about beeing offline.
        function notifyUserIsOffline() {
            var status = $('#offlineForm-status');
            var offlineForm = $('#offlineForm');
            offlineForm.addClass('offline');
            offlineForm.removeClass('online');
            if (options.applyStyles) $('#offlineForm').css('background-color', 'red');
            status.html('Offline');
        }
        // Notifies users about how many items are stored offline ready to be send.
        function updateCount() {
            var length = window.localStorage.length;
            if (length > 0)
              $('#offlineForm-count').html(options.textStatus.replace('@amount', length));
            else 
              $('#offlineForm-count').html('');
        }

        // Init the plugin. This should happen after dom loaded.
        var browserSupport = init();
        function init() {
            // Check if browser supports local storage
            if(typeof window.localStorage  === 'undefined') return false;
            
            // Create DOM nodes.
            $(options.barSelector).prepend('<div id="offlineForm"><span id="offlineForm-status"></span> <span id="offlineForm-count"></span></div>');

            if (options.applyStyles) applayStyles();

            // Update count.
            updateCount();
            
            //if online.
            if (navigator.onLine) goneOnline();
            else goneOffline();

            //listen for connection changes
            window.addEventListener('online', goneOnline, false);
            window.addEventListener('offline', goneOffline, false);

            return true;
        };

        // Default styling for the markup inserted by this plugin.
        function applayStyles() {
            $('#offlineForm').css({
                'text-align': 'center',
                'background-color': '#aaa',
                'display': 'block',
                'position': 'relative',
                'padding': '7px 12px',
                'color': 'white',
                'overflow': 'hidden',
                'text-transform': 'uppercase',
                'font-weight': 'bold',
                'font-size': '120%',
            });
        }

        // Iterate over all forms this plugin is applied to.
        return this.each(function(){
            // Assign our custom submit handler to the form we deal with.
            if(browserSupport) 
                $(this).submit(function(e) {return submitForm($(this));});
        });
    }

    // Define default options.
    $.fn.offlineForm.defaults = {
        textMessage: 'Thank you for your submission. The data is cached locally and will be send as soon as you visit this page with internet connectivity.',
        callbackMessage: function (message) {alert(message);},
        textStatus: '(@amount item(s) cached)',
        applyStyles: true,
        barSelector: 'body',
    };
})(jQuery);