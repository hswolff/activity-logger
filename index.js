'use strict';

var uuid = 1;
var activities = Object.create(null);

function writeActivity(template, activity) {
  if (!enabled) {
    return;
  }

  if (outputHandlers.length === 0) {
    throw new Error('No output handlers defined.');
  }

  outputHandlers.forEach(handler => {
    handler(template(activity));
  });
}
// Exported for testing purposes. Do not use.
exports._write = writeActivity;

function startActivity(activityMessage) {
  var startTime = Date.now();

  if (activityMessage === undefined ||
      activityMessage === undefined ||
      typeof activityMessage !== 'string') {
    throw new Error('activity.start() requires an activity name.');
  }

  const activityId = uuid++;
  const activity = {
    id: activityId,
    message: activityMessage,
    timestamps: [startTime]
  };

  activities[activityId] = activity;

  writeActivity(activityEvents.start, activity);

  return activityId;
}
exports.start = startActivity;

function endActivity(activityId) {
  var endTime = Date.now();

  var activity = activities[activityId];

  if (activity === undefined) {
    throw new Error('activity with id "' + activityId + '" not found.');
  }

  activity.timestamps.push(endTime);

  writeActivity(activityEvents.end, activity);

  delete activities[activityId];
}
exports.end = endActivity;

var enabled = true;

// Disable writing to outputHandlers.
exports.disable = function disable() {
  enabled = false;
};

// Enable writing to outputHandlers.
exports.enable = function enable() {
  enabled = true;
};

var activityEvents = {
  start: function(activity) {
    return activity.message;
  },

  end: function(activity) {
    var firstTime = activity.timestamps[0];
    var lastTime = activity.timestamps[activity.timestamps.length - 1];
    return activity.message + ' (' + (lastTime - firstTime) + 'ms)';
  }
};

exports.setStartFormatter = function setStartFormatter(formatter) {
  activityEvents['start'] = formatter;
};

exports.setEndFormatter = function setEndFormatter(formatter) {
  activityEvents['end'] = formatter;
};

var outputHandlers = [console.log.bind(console)];

exports.getOutputHandlers = function getOutputHandlers() {
  return outputHandlers;
};

exports.setOutputHandlers = function setOutputHandlers() {
  var handlers = Array.prototype.slice.call(arguments, 0);
  // If an array is given as first arg make sure resulting outputHandlers
  // is flat.
  outputHandlers = handlers.reduce(function(flat, arg) {
    return flat.concat(arg);
  }, []);
  return outputHandlers;
};

exports.addOutputHandler = function addOutputHandler(handler) {
  outputHandlers.push(handler);
  return outputHandlers;
};
