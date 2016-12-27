var subroutines = {
    moveToMinCPU: function(creep, destination) {
        creep.moveTo(destination, {
            noPathFinding: true
        });
        // Perform pathfinding only if we have enough CPU
        if (Game.cpu.tickLimit - Game.cpu.getUsed() > 20) {
            creep.moveTo(destination);
        }
    },
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
                this.moveToMinCPU(creep,closestContainer);
            }
        } else {
            var toHarvest = creep.room.find(FIND_SOURCES)[0];
            var closestSource = creep.pos.findClosestByRange(toHarvest);
            if (creep.harvest(toHarvest) == ERR_NOT_IN_RANGE) {
                this.moveToMinCPU(creep,toHarvest);
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
                this.moveToMinCPU(creep,closestContainer);
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
                    this.moveToMinCPU(creep,targets[0]);
                }
            }
        }
    },
    harvestEnergy: function(creep, source) {
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
          this.moveToMinCPU(creep, source);
      }
    },
    repairClosest: function(creep, threshold) {
      // repair things
      var thingsToRepair = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
              return structure.hits < (structure.hitsMax * threshold);
          }
      });
      if (thingsToRepair.length > 0) {
          var closest = creep.pos.findClosestByRange(thingsToRepair);
          if (creep.repair(closest) == ERR_NOT_IN_RANGE) {
              subroutines.moveToMinCPU(creep, closest);
          }
      }
    },
    checkRenew: function(creep) {
      var needsRenew = false;
      if (creep.ticksToLive < 100) {
        needsRenew = true;
        creep.say('renewing');
        var closestSpawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
        if (closestSpawn.renewCreep(creep) == ERR_NOT_IN_RANGE) {
          this.moveToMinCPU(creep, closestSpawn);
        }
      }
      return needsRenew;
    }
};
module.exports = subroutines;
