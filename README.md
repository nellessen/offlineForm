# jQuery offlineForm Plugin

offlineForm is a jQuery plugin **facilitating offline capability for html forms** using [HTML5 webstorage](http://dev.w3.org/html5/webstorage/). Applied to any form it will store submitted data in the web browser's local storage whenever the user is offline and send the data to the remote server as soon as the user gets online again.

The plugin is in an early stage at the moment. It needs some testing to be ready for production usage. I would love to get feedback from any user testing this plugin! Currently it does support all form elements except for file fields.

## Usage / API
Use `offlineForm` in your document's `ready` function to apply offline capability to forms:
````javascript
// Apply offline capibility to all forms.
$('form').ajaxForm();
````
##Options
You can customize functionality by specifing settings in the jQuery tipical way:
````javascript
// Apply offline capibility to forms with id myform.
$('#myform').ajaxForm({
    textMessage: 'Thank you for submission. The data is cached locally and will be send as soon as you visit this page with internet connectivity.',
    callbackMessage: function (message) {alert(message);}, // Callback after offline form submission.
    textStatus: '(@amount submissions cached)', // Text in the bar indicating how many submissions are cached.
    applyStyles: true, // Apply default styles.
    barSelector: 'body', // Selector to prepend the status bar to.
});
````

---

##Copyright and License
The jQuery offlineForm plugin is dual licensed under the MIT and GPL licenses:

* [MIT](http://malsup.github.com/mit-license.txt)
* [GPL](http://malsup.github.com/gpl-license-v2.txt)

You may use either license.  The MIT License is recommended for most projects because it is simple and easy to understand and it places almost no restrictions on what you can do with the plugin.

If the GPL suits your project better you are also free to use the plugin under that license.

You don't have to do anything special to choose one license or the other and you don't have to notify anyone which license you are using. You are free to use the this Software in commercial projects as long as the copyright header is left intact.
