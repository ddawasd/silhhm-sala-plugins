/**
 * Message Of The Day plugin for Haxball Headless Manager (HHM).
 * 
 * Displays a message when player joins and repeats it once in
 * every x minutes.
 */

let room = HBInit();
room.pluginSpec = {
  name: `hr/motd`,
  author: `salamini`,
  version: `1.0.0`,
  config: {
    // Message Of The Day.
    message: `Join https://discord.gg/TeJAEWu for support.`,
    // How often to display the message in minutes.
    // Set to 0 to disable displaying it repeatedly.
    interval: 10
  },
  dependencies: [`sav/cron`]
};

room.onPlayerJoin = function(player) {
  const message = room.pluginSpec.config.message;
  room.sendChat(message, player.id);
}

if (room.pluginSpec.config.interval > 0) {
  displayMessageOnceIn(
    room.pluginSpec.config.interval,
    room.pluginSpec.config.message
  );
}

function displayMessageOnceIn(interval, message) {
  room[`onCron${interval}Minutes`] = () => room.sendChat(message + interval);
}

room.onCommand0_motd = (player) => {
  const message = room.pluginSpec.config.message;
  room.sendChat(message, player.id);
}

room.onConfigSet = ({paramName, newValue, oldValue}) => {
  if (paramName === `interval`) {
    // TODO: remove this when https://github.com/saviola777/haxball-headless-manager/issues/14 solved
    if (!oldValue) oldValue = room.pluginSpec.config.interval;
    const message = room.pluginSpec.config.message;
    delete room[`onCron${oldValue}Minutes`];
    displayMessageOnceIn(newValue, message);
  }
}
