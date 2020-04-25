
module.exports = class TreeService
{
  static Treeify (relations)
  {
    Object.keys(relations).forEach(key=>_Treeify(key, relations, relations));
    return relations;
  }

  static PostOrder(obj, rootname)
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
  }
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
