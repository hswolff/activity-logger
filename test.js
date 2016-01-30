var rewire = require('rewire');
var assert = require('assert');
var sinon = require('sinon');
var activity = rewire('./index.js');

describe('activity', function() {
  var getActivity = activity.__get__('getActivity');
  var writeActivity = activity.__get__('writeActivity');

  before(function() {
    activity.setOutputHandlers(sinon.spy());
  });

  describe('create', function() {
    it('throws if given wrong input', function() {
      assert.throws(function() {
        activity.create();
      });
      assert.throws(function() {
        activity.create(2828);
      });
      assert.throws(function() {
        activity.create({});
      });
    });

    it('returns a uuid', function() {
      var ovenActivity = activity.create('Warming up the oven.');
      assert(typeof ovenActivity === 'number');
    });

    it('returns an unique uuid', function() {
      var ovenActivity = activity.create('Warming up the oven.');
      var waterActivity = activity.create('Boiling the water.');
      assert(ovenActivity !== waterActivity);
    });

    it('creates activity without any timestamps', function() {
      var timelessId = activity.create('Timeless.');
      var timelessActivity = getActivity(timelessId);
      assert(timelessActivity.timestamps.length === 0);
    });
  });

  describe('start', function() {
    it('creates activity with one timestmap', function() {
      var testId = activity.start('Marathon, go!');
      var testActivity = getActivity(testId);
      assert(testActivity.timestamps.length === 1);
    });
  });

  describe('end', function() {
    it('throws if id doesn\'t exist', function() {
      assert.throws(function() {
        activity.end(-1);
      });
    });

    it('deletes activity after writing it', function() {
      var id = activity.start('Message');
      activity.end(id);

      assert.throws(function() {
        activity.end(id);
      });
    });
  });

  describe('write', function() {
    it('throws if no output handlers defined', function() {
      activity.setOutputHandlers();
      assert.throws(function() {
        activity.start('foo');
      });
    });

    it('calls template and handlers with right args', function() {
      var handler = sinon.spy();
      activity.setOutputHandlers(handler, handler);

      var writeData = {foo: 'bar'};
      var templateVal = 'Whee';
      var template = sinon.spy(function() {
        return templateVal;
      });
      writeActivity(template, writeData);

      assert.equal(template.callCount, 2);
      assert.equal(handler.callCount, 2);

      assert(template.alwaysCalledWithExactly(writeData));
      assert(handler.alwaysCalledWithExactly(templateVal));
    });
  });

  describe('disable', function() {
    it('prevents writing to output', function() {
      var handler = sinon.spy();
      activity.setOutputHandlers(handler);

      activity.disable();
      activity.start('foo');
      assert.equal(handler.callCount, 0);
    });
  });

  describe('enable', function() {
    it('allows writing to output', function() {
      var handler = sinon.spy();
      activity.setOutputHandlers(handler);

      activity.disable();
      activity.start('foo');
      assert.equal(handler.callCount, 0);

      activity.enable();
      activity.start('foo');
      assert.equal(handler.callCount, 1);
    });
  });

  describe('setOutputHandlers', function() {
    it('accepts an array', function() {
      var handlers = [1, 2, 3];
      var newHandlers = activity.setOutputHandlers(handlers);
      assert.equal(handlers.length, newHandlers.length);
      assert.deepEqual(handlers, newHandlers);
    });

    it('accepts multiple arguments', function() {
      var handlers = [1, 2, 3];
      var newHandlers = activity.setOutputHandlers(1, 2, 3);
      assert.equal(handlers.length, newHandlers.length);
      assert.deepEqual(handlers, newHandlers);
    });
  });

  describe('addOutputHandler', function() {
    it('adds a new handler to the end of the handlers array', function() {
      var handlers = activity.setOutputHandlers([sinon.spy()]);
      assert.equal(handlers.length, 1);

      var newHandler = function() {};
      activity.addOutputHandler(newHandler);
      assert.equal(handlers.length, 2);
      assert.equal(handlers[1], newHandler);
    });
  });

  describe('setStartFormatter', function() {
    it('overwrites previous start formatter', function() {
      activity.setOutputHandlers(sinon.spy());

      var formatter = sinon.spy();
      activity.setStartFormatter(formatter);

      var message = 'Happy Birthday Dearie';
      activity.start(message);

      var firstCall = formatter.firstCall;
      assert.equal(firstCall.args.length, 1);
      assert.deepEqual(Object.keys(firstCall.args[0]), [
        'id',
        'message',
        'timestamps'
      ]);

      assert.equal(firstCall.args[0].timestamps.length, 1);
    });
  });

  describe('setEndFormatter', function() {
    it('overwrites previous end formatter', function() {
      activity.setOutputHandlers(sinon.spy());

      var formatter = sinon.spy();
      activity.setEndFormatter(formatter);

      var message = 'Happy Birthday Dearie';
      activity.end(activity.start(message));

      var firstCall = formatter.firstCall;
      assert.equal(firstCall.args.length, 1);
      assert.deepEqual(Object.keys(firstCall.args[0]), [
        'id',
        'message',
        'timestamps'
      ]);

      assert.equal(firstCall.args[0].timestamps.length, 2);
      var timestamps = firstCall.args[0].timestamps;
      assert(timestamps[1] >= timestamps[1]);
    });
  });
});
