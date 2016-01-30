var outputHandlers = [console.log.bind(console)];

exports.get = function getOutputHandlers() {
  return outputHandlers;
};

exports.set = function setOutputHandlers() {
  var handlers = Array.prototype.slice.call(arguments, 0);
  // If an array is given as first arg make sure resulting outputHandlers
  // is flat.
  outputHandlers = handlers.reduce(function(flat, arg) {
    return flat.concat(arg);
  }, []);
  return outputHandlers;
};

exports.add = function addOutputHandler(handler) {
  outputHandlers.push(handler);
  return outputHandlers;
};
