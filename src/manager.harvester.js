var roleHarvester = require('role.harvester');
var managerHarvester = {
    /** @param {HarvesterCount} harvesterCount **/
    manage: function(harvesterCount, currentRoom) {

        var sources = currentRoom.find(FIND_SOURCES);
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        // if record of source coverage does not exist in memory, create it, else update it.
        if (!Memory.rooms[currentRoom.name].sourceCoverage) {
            Memory.rooms[currentRoom.name].sourceCoverage = {}
            for (var source in sources) {
                Memory.rooms[currentRoom.name].sourceCoverage[sources[source].id] = 0;
            }
        } else {
          for (var i in sources) {
            var source = sources[i];
            Memory.rooms[currentRoom.name].sourceCoverage[source.id] = 0;
          }
          for (var i in harvesters) {
            var harvester = harvesters[i];
            if (harvester.sourceId) {
              Memory.rooms[currentRoom.name].sourceCoverage[harvester.sourceId]++;  // NOT WORKING
            }
          }
        }

        // check number of harvesters
        if (harvesters.length < harvesterCount) {
            // spawn harvesters
            var newName = Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], undefined, {
                role: 'harvester'
            });
            console.log('Calling for new harvester: ' + newName);
        }

        // allocate harvesters to sources if not done so.
        for (var name in harvesters) {
            var harvester = harvesters[name];
            if (!harvester.memory.sourceId) {
                for (var id in Memory.rooms[currentRoom.name].sourceCoverage) {
                    var count = Memory.rooms[currentRoom.name].sourceCoverage[id];
                    //console.log('id: ', id, ' count: ', count);
                    if (count < (harvesters.length / sources.length)) {
                        harvester.memory.sourceId = id;
                        Memory.rooms[currentRoom.name].sourceCoverage[id]++;
                    }
                }
            }
        }


        // run harvesters
        for (var name in harvesters) {
            var harvester = harvesters[name];
            roleHarvester.run(harvester);
        }
    }
};

module.exports = managerHarvester;
