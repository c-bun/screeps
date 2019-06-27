module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-screeps');

	grunt.initConfig({
		screeps: {
			options: {
				email: 'colrath@gmail.com',
				password: '97tiefd4',
				branch: 'testing',
				ptr: false
			},
			dist: {
				src: ['src/*.js']
			}
		}
	});
}