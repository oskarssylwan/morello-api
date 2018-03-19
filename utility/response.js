module.exports = (message, data, success=true) => ({
  success,
  message,
  body: data
});
