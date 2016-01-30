# activity-logger [![npm version](https://badge.fury.io/js/activity-logger.svg)](http://badge.fury.io/js/activity-logger) [![Build Status](https://travis-ci.org/hswolff/activity-logger.svg?branch=master)](https://travis-ci.org/hswolff/activity-logger) [![ghit.me](https://ghit.me/badge.svg?repo=hswolff/activity-logger)](https://ghit.me/repo/hswolff/activity-logger)


> Log activities, showing the time it takes to complete them.

Track how long certain activities take in your application.

Think of it is a more powerful and expressive `console.time`, one that lets you customize not only what is logged out but also where it goes. You can pipe messages to `console.log`, `process.stdout`, or write to the file system however you like!

Super inspired by [react-native's Activity module](https://github.com/facebook/react-native/blob/master/packager/react-packager/src/Activity/index.js).

## Install

```
$ npm install --save activity-logger
```


## Usage

Basic usage.

```js
const activity = require('activity-logger');

var ovenActivity = activity.start('Heating up the oven.');
// logs -> 'Heating up the oven';

setTimeout(function() {
	activity.end(ovenActivity);
	// logs -> 'Heating up the oven (1234ms)'
}, 1234);
```

You can customize what the output looks like.

```js
activity.setStartFormatter(function(activity) {
	return '[' + activity.id + '] ' + activity.message + ' @ ' +
		new Date(activity.timestamps[0]).toLocaleTimeString();
});

var activityId = activity.start('Booting up');
// logs -> '[2] Booting up @ 9:51:26 AM'

activity.setEndFormatter(function(activity) {
	return '[' + activity.id + '] ' + activity.message + ' @ ' +
		new Date(activity.timestamps[0]).toLocaleTimeString() +
		' - COMPLETED (' + (activity.timestamps[1] - activity.timestamps[0]) + 'ms)';
});

setTimeout(function() {
	activity.end(activityId);
	// logs -> '[2] Booting up @ 9:51:26 AM - COMPLETED (23ms)'
}, 23);
```

And you can change where the output is sent!

```js
activity.setOutputHandlers(function(message) {
	fs.appendFileSync('./log.txt', message, 'utf8');
});

// Now every message is appended to our log file.
```

## API

### activity.start(activityMessage)

Returns the `activityId` you can later use to end the activity. Logs out to console
that the activity has started.

#### activityMessage

Type: `string`

The message you want outputted.


### activity.end(activityId)

Ends the activity and returns the `Activity` object. Logs out to the console the activity ended, showing the time it
took to complete.

#### activityId

Type: `number`

The id of the activity we want to end.


### activity.create(activityMessage)

Returns the `activityId` you can later use to end the activity. Does not create any
timestamp, just registers a new activity.

#### activityMessage

Type: `string`

The message you want outputted.


### activity.mark(activityId)

Adds a new timestamp to the Activity's array of timestamps.

#### activityId

Type: `number`

The id of the activity.


### activity.disable()

Disable output.

### activity.enable()

Enable output.


### activity.setStartFormatter(formatter)

Change how start events are outputted.

#### formatter

Type: `function`

Formatter is given an `activity` object. It must return a string as that is
given to each function in `outputHandlers` array.

`activity`
```json
{
	"id": 21,
	"message": "Message string given from activity.start",
	"timestamps": [1453692902523]
}
```

### activity.setEndFormatter(formatter)

Change how end events are outputted.

#### formatter

Type: `function`

Formatter is given an `activity` object. It must return a string as that is
given to each function in the `outputHandlers` array. In the end event the `timestamps` array has a second value to calculate the time spread.

`activity`
```json
{
	"id": 21,
	"message": "Message string given from activity.start",
	"timestamps": [1453692902523, 1453692905599]
}
```

### activity.getOutputHandlers()

Returns all `outputHandlers`.

### activity.setOutputHandlers(...handlers)

Overwrite the existing `outputHandlers` array.

#### handlers

Type: `...function`

A variable number of new functions to set as `outputHandlers`.

### activity.addOutputHandler(handler)

Add one handler to the `outputHandlers` array.

#### handlers

Type: `function`


## License

MIT © [Harry Wolff](http://hswolff.com)
