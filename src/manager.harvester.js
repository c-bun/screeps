var roleHarvester = require('role.harvester');
var managerHarvester = {
    /** @param {HarvesterCount} harvesterCount **/
    manage: function(harvesterCount, currentRoom) {

        var sources = currentRoom.find(FIND_SOURCES);
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');

        // compile dictionary of sources and coverage.
        var sourceAssignments = {};
        for (var i in sources) {
          var source = sources[i];
          sourceAssignments[source.id] = 0;
          ////console.log(source.id, ' ',sourceAssignments[source.id]);
        }
        for (var i in harvesters) {
          var harvester = harvesters[i];
          sourceAssignments[harvester.memory.sourceId] ++;
          ////console.log(harvester.memory.sourceId, ' ',sourceAssignments[harvester.memory.sourceId]);
        }

        // check number of harvesters
        if (harvesters.length < harvesterCount) {
            // spawn harvesters
            var newName = Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], undefined, {
                role: 'harvester'
            });
        }

        // allocate harvesters to sources if not done so.
        for (var name in harvesters) {
            var harvester = harvesters[name];
            if (!harvester.memory.sourceId) {
                for (var source in sourceAssignments) {
                  if (sourceAssignments[source] < harvesters.length / sources.length) {
                    harvester.memory.sourceId = source;
                    sourceAssignments[source] ++;
                    break;
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
