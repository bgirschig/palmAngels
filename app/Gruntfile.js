module.exports = function(grunt){


	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			options: {
				dateFormat: function(time) {
					grunt.log.writeln('grunt is waiting for updates...');
				},
			},
			css: {
				files: 'source/stylus/*.styl',
				tasks: ['stylus'],
				options: {
					livereload: true
				},
			},
			copy:{
				files: 'source/index.html',
				tasks:['copy'],
				options:{
					livereload: true
				}
			},
			js: {
				files: ['source/coffee/*.coffee'],
				tasks: ['coffee'],
				options: {
					livereload: false
				},
			},
		},

		stylus: {
			options: { compress: true, paths: ['source/stylus/*.styl'] },
			compile: {
				files: { '../build/style/main.css' : 'source/stylus/*.styl' },
			},
		},

		coffee: {
			compile: {
				files: {
					'../build/script/main.js' : 'source/coffee/*.coffee',
					// '../build/script/bookBrowser.js' : 'source/coffee/bookBrowser.coffee'
				},
			},
		},

		copy: {
		  main: {
		    files: [
		      {
		      	src: ['source/index.html'],
		      	dest: '../build/index.html',
		      	filter: 'isFile'
		      },
		      {
		      	src: ['assets/bookImages/*.png', 'assets/videos/vid*.mp4', 'assets/videos/fallback*.png'],
		      	dest: '../build/',
		      	filter: 'isFile'
		      },
		    ]
		  }
		}
	});

	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['watch']);

};