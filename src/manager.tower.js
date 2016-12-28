var tower = require('tower');
var managerTower = {
        /** @param {TowerCount} towerCount **/
        manage: function(currentRoom) {
                for (var name in Game.creeps) {
                    var towers = currentRoom.find(
                        FIND_MY_STRUCTURES, {
                            filter: {
                                structureType: STRUCTURE_TOWER
                            }
                        });
                    towers.forEach(tower => roleTower.performDuties(tower);
                    }
                };

                module.exports = managerTower;
