/**
 * Converts an object with different measures of time into 
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

/**
 * Turns an object that lists parent nodes and their children into a tree
 */
module.exports.Treeify = function(relations)
{
  Object.keys(relations).forEach(key=>_Treeify(key, relations, relations));
  return relations;
};

module.exports.PostOrder = function(obj, rootname)
{
  var arr = [];

  Object.keys(obj).forEach(
    key =>
    {
      arr = arr.concat(module.exports.PostOrder(obj[key], key));
      
      if (rootname)
      {
        arr.push({parent: rootname, child: key});
      }
    }
  );

  return arr;
};

const _Treeify = function(key, subtree, relations)
{
  if (!subtree[key]) return;
  Object.keys(subtree[key]).forEach(
    subkey =>
    {
      if (!subtree[key]) return;
      if (relations[subkey])
      {
        subtree[key][subkey] = relations[subkey];
        delete relations[subkey];
        _Treeify(subkey, subtree[key], relations);
      }
    });
};