'use strict'


async function get_memcached_addon(appkit, args) {
  if(!args.ADDON || args.ADDON === "") {
      let addons = await appkit.api.get(`/apps/${args.app}/addons`)
      let memcacheds = addons.filter((addon) => addon.addon_service.name === "akkeris-memcached");
      if(memcacheds.length === 0) {
        throw new Error(`No memcached addons were found on ${args.app}`);
      } else if (memcacheds.length > 1) {
        throw new Error(`Multiple memcached addons were found on ${args.app}, specify the name or ID of which one to use.`);
      } else {
        return memcacheds[0].id
      }
    } else {
      return args.ADDON
    }
}

async function print_stats(appkit, args) {
  try {
    console.assert(args.app, 'No app was specified.');
    args.ADDON = await get_memcached_addon(appkit, args);
    appkit.terminal.print(null, (await appkit.api.post(null, `/apps/${args.app}/addons/${args.ADDON}/actions/stats`)).stats)
  } catch (e) {
    return appkit.terminal.error(e)
  }
}

async function flush_cache(appkit, args) {
  console.assert(args.app, 'No app was specified.');
  let task = null
  try {
    args.ADDON = await get_memcached_addon(appkit, args);
    task = appkit.terminal.task(`Flushing cache on ^^${args.ADDON}^^ on app **⬢ ${args.app}**`);
    task.start();
    await appkit.api.post(null, `/apps/${args.app}/addons/${args.ADDON}/actions/flush`);
    task.end('ok');
  } catch (e) {
    if(task) {
      task.end('error')
    }
    return appkit.terminal.error(e)
  }
}

async function restart_cache(appkit, args) {
  console.assert(args.app, 'No app was specified.');
  let task = null
  try {
    args.ADDON = await get_memcached_addon(appkit, args);
    task = appkit.terminal.task(`Restarting memcached ^^${args.ADDON}^^ on app **⬢ ${args.app}**`);
    task.start();
    await appkit.api.post(null, `/apps/${args.app}/addons/${args.ADDON}/actions/restart`);
    task.end('ok');
  } catch (e) {
    if(task) {
      task.end('error')
    }
    return appkit.terminal.error(e)
  }
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
    appkit.args.command('memcached [ADDON]','print out stats for memcached', apps_options, print_stats.bind(null, appkit));
    appkit.args.command('memcached:stats [ADDON]', false, apps_options, print_stats.bind(null, appkit));
    appkit.args.command('memcached:flush [ADDON]','flushes the cache from memcached', apps_options, flush_cache.bind(null, appkit));
    appkit.args.command('memcached:restart [ADDON]','restarts the memcached server', apps_options, flush_cache.bind(null, appkit));
	},
	update:function(){},
	group:'memcached',
	help:'flush cache and get stats from memcached.',
	primary:true
};
