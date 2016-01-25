# activity-logger [![Build Status](https://travis-ci.org/hswolff/activity-logger.svg?branch=master)](https://travis-ci.org/hswolff/activity-logger)

> Log activities, showing the time it takes to complete them.

Track how long certain activities take in your application.

By default all activities are given to `console.log`.

You can modify where activity messages should be sent by modifying the `outputHandlers` array.

## Install

```
$ npm install --save activity-logger
```


## Usage

```js
const activity = require('activity-logger');

var ovenActivity = activity.start('Heating up the oven.');
// logs -> 'Heating up the oven';
setTimeout(function() {
	activity.end(ovenActivity);
	// logs -> 'Heating up the oven (1234ms)'
}, 1234);
```


## API

### activity.start(activityMessage)

Returns the `activityId` you can later use to end the activity. Logs out to console
that the activity has started.

#### activityMessage

Type: `string`

The message you want outputted.


### activity.end(activityId)

Ends the activity. Logs out to the console the activity ended, showing the time it
took to complete.

#### activityId

Type: `number`

The id of the activity we want to end.


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
