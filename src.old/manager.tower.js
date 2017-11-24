var tower = require('tower');
var managerTower = {
        /** @param {TowerCount} towerCount **/
        manage: function(currentRoom) {

                    var towers = currentRoom.find(
                        FIND_MY_STRUCTURES, {
                            filter: {
                                structureType: STRUCTURE_TOWER
                            }
                        });
                    towers.forEach(t => tower.performDuties(t));
                  }
                };

                module.exports = managerTower;
