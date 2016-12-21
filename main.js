var managerHarvester = require('manager.harvesters');

module.exports.loop = function() {

    //instantiate managers for each room if rooms do not contain any
    //harvesters: pass in location and number of sources
    for (var room in Memory.rooms) {
        if (!room.managers) {
            //instantiate
            room.managers[managerHarvester] = new managerHarvester(room, 4)
        }
        for (var manager in room.managers) {
            room.managers.manager.manage();
        }
    }
    
}
