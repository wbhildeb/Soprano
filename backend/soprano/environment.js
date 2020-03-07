
const production = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod';

const basePage = production ?
  'http://www.walk-site.herokuapp.com' :
  'http://localhost';

const config = production ?
  require('../../environments/soprano.prod.json') :
  require('../../environments/soprano.json');

const resolvePath = function(path)
{
  return basePage + path;
};

module.exports = {
  production,
  basePage,
  resolvePath,
  spotify: config.spotify,
  firebase: config.firebase
};