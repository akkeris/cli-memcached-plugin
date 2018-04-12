'use strict'

function print_stats(appkit, args) {
  console.assert(args.app, 'No app was specified.');
  console.assert(args.ADDON, 'An addon id was not specified (see aka addons -a ' + args.app);
  appkit.api.post(null, '/apps/' + args.app + '/addons/' + args.ADDON + '/actions/stats', appkit.terminal.print);
}

function flush_cache(appkit, args) {
  console.assert(args.app, 'No app was specified.');
  console.assert(args.ADDON, 'An addon id was not specified (see aka addons -a ' + args.app);
  appkit.api.post(null, '/apps/' + args.app + '/addons/' + args.ADDON + '/actions/flush', appkit.terminal.print);
}

module.exports = {
	init:function(appkit){
    let apps_options = {
      'app':{
        'alias':'a',
        'demand':true,
        'string':true,
        'description':'The app memcached is installed on on.'
      }
    };
    appkit.args.command('memcached <ADDON>','print out stats from the specified memcached', apps_options, print_stats.bind(null, appkit));
    appkit.args.command('memcached:flush <ADDON>','flushes the cache from the specified memcached', apps_options, flush_cache.bind(null, appkit));
	},
	update:function(){},
	group:'memcached',
	help:'flush cache and get stats from memcached.',
	primary:true
};
