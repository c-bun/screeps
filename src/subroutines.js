var subroutines = {
    withdrawEnergy: function(creep) {
        var containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
            filter: (i) => {
                return i.structureType == STRUCTURE_CONTAINER &&
                    i.store[RESOURCE_ENERGY] > 0;
            }
        });

        if (containersWithEnergy.length > 0) {
            var closestContainer = creep.pos.findClosestByRange(containersWithEnergy);
            if (creep.withdraw(closestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestContainer);
            }
        } else {
            var toHarvest = creep.room.find(FIND_SOURCES)[0];
            var closestSource = creep.pos.findClosestByRange(toHarvest);
            if (creep.harvest(toHarvest) == ERR_NOT_IN_RANGE) {
                creep.moveTo(toHarvest);
            }
        }
    },
    depositEnergy: function(creep) {
        // Defaults to containers, then to spawns and extensions.
        var containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
            filter: (i) => {
                return i.structureType == STRUCTURE_CONTAINER &&
                    i.store[RESOURCE_ENERGY] < 2000;
            }
        });
        if (containersWithEnergy.length > 0) {
            var closestContainer = creep.pos.findClosestByRange(containersWithEnergy);
            if (creep.transfer(closestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestContainer);
            }
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType ==
                            STRUCTURE_EXTENSION || structure.structureType ==
                            STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
    }
};
module.exports = subroutines;
