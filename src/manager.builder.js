var roleBuilder = require('role.builder');
var roomLevels = require('roomLevels');
var managerBuilder = {

    manage: function(roomLevel) {
      var levelNumber = roomLevels[roomLevel].number.builder;
      var levelConfig = roomLevels[roomLevel].config.builder;
        // check number of builders
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        if (builders.length < levelNumber) {
            // spawn builders
            var newName = Game.spawns['Spawn1'].createCreep(levelConfig, undefined, {
                role: 'builder'
            });
        }
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.role == 'builder') {
              // make a decision about renewal here depending on age of builder?
                roleBuilder.run(creep);
            }
        }
    }
};

module.exports = managerBuilder;
