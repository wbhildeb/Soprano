/**
 * 
 */
module.exports.ToMilliseconds = function(time)
{
  if (!time) return null;

  if (!time.days) time.days = 0;
  if (!time.hours) time.hours = 0;
  if (!time.minutes) time.minutes = 0;
  if (!time.seconds) time.seconds = 0;
  if (!time.milliseconds) time.milliseconds = 0;

  time.hours += time.days * 24;
  time.minutes += time.hours * 60;
  time.seconds += time.minutes * 60;
  time.milliseconds += time.seconds * 1000;
  
  return time.milliseconds;
};