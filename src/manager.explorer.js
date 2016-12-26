var roleExplorer = require('role.explorer');
var managerExplorer = {
    /** @param {ExplorerCount} explorerCount **/
    manage: function(explorerCount) {
        // check number of explorers
        var explorers = _.filter(Game.creeps, (creep) => creep.memory.role == 'explorer');
        if (explorers.length < explorerCount) {
            // spawn explorers
            var newName = Game.spawns['Spawn1'].createCreep([CLAIM, CLAIM, MOVE, MOVE], undefined, {
                role: 'explorer'
            });
            console.log('Spawning new explorer: ' + newName);
        }
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.role == 'explorer') {
                roleExplorer.run(creep);
            }
        }
    }
};

module.exports = managerExplorer;
