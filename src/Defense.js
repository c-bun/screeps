var Tower = require('Tower')

class Defense {
	constructor(room) {
		this.room = room;
		this.towers = this.room.find(
			FIND_MY_STRUCTURES, {
				filter: {
					structureType: STRUCTURE_TOWER
				}
			});
		//this.walls
		//this.ramparts
	}
	// repairDamaged() {
	//
	// }
	// attackHostile() {
	//
	// }
	// assesThreats() {
	//
	// }
	run() {
		//var roomStatus = this.assesThreats();
		for (var name in this.towers) {
			var tower = new Tower(this.towers[name]);
			tower.run()
		}
	}
}

module.exports = Defense;
