/*
 * Generated on 2015-05-01
 * generator-assemble v0.5.0
 * https://github.com/assemble/generator-assemble
 *
 * Copyright (c) 2015 Hariadi Hinta
 * Licensed under the MIT license.
 */

'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// '<%= config.src %>/templates/pages/{,*/}*.hbs'
// use this if you want to match all subfolders:
// '<%= config.src %>/templates/pages/**/*.hbs'

module.exports = function (grunt) {

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({

    config: {
      src: 'src',
      dist: 'dist'
    },

    watch: {
      assemble: {
        files: ['<%= config.src %>/{content,data,templates}/{,*/}*.{md,hbs,yml}'],
        tasks: ['assemble']
      },
      sass: {
        files: ['<%= config.src %>/templates/assets/css/**/*.{scss,sass}'],
        tasks: ['sass']
      },
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep:dev', 'copy_assets:dev']
      },
      js: {
        files: ['<%= config.src %>/templates/assets/js/**/*.js'],
        tasks: ['newer:copy:js']
      },
      img: {
        files: ['<%= config.src %>/templates/assets/img/**/*.{png,jpg,jpeg,gif,webp,svg}'],
        tasks: ['newer:copy:img']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.dist %>/{,*/}*.html',
          '<%= config.dist %>/assets/{,*/}*.css',
          '<%= config.dist %>/assets/{,*/}*.js',
          '<%= config.dist %>/assets/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: true,
          base: [
            '<%= config.dist %>'
          ]
        }
      }
    },

    assemble: {
      pages: {
        options: {
          flatten: true,
          assets: '<%= config.dist %>/assets',
          layout: '<%= config.src %>/templates/layouts/default.hbs',
          data: '<%= config.src %>/data/*.{json,yml}',
          partials: '<%= config.src %>/templates/partials/*.hbs',
          plugins: ['assemble-contrib-permalinks', 'assemble-contrib-sitemap'],
        },
        files: {
          '<%= config.dist %>/': ['<%= config.src %>/templates/pages/*.hbs']
        }
      }
    },

    copy: {
      //bootstrap: {
      //  expand: true,
      //  cwd: 'bower_components/bootstrap/dist/',
      //  src: '**',
      //  dest: '<%= config.dist %>/assets/'
      //},
      //theme: {
      //  expand: true,
      //  cwd: 'src/assets/',
      //  src: '**',
      //  dest: '<%= config.dist %>/assets/css/'
      //}
      bower: {
        expand: true,
        cwd: '<%= config.src %>/bower_components/',
        src: '**',
        dest: '<%= config.dist %>/bower_components/'
      },
      js: {
        expand: true,
        cwd: '<%= config.src %>/templates/',
        src: '**/*.js',
        dest: '<%= config.dist %>'
      },
      img: {
        expand: true,
        cwd: '<%= config.src %>/templates/',
        src: '**/*.{png,jpg,jpeg,gif,webp,svg}',
        dest: '<%= config.dist %>'
      }
    },
    sass: {
      options: {
        includePaths: [
          'src/bower_components/flat-ui-sass/vendor/assets/stylesheets'
        ]
      },
      dev: {
        files: {'dist/assets/css/main.css': 'src/templates/assets/css/main.scss'}
      },
      temp: {
        files: {'.temp/assets/css/main.css': 'src/templates/assets/css/main.scss'}
      }
    },

    wiredep: {
      scss: {
        src: ['src/templates/assets/css/main.scss']
      },
      dev: {
        ignorePath: /\.\.\/\.\.\//,
        src: ['src/templates/layouts/default.hbs'],
      },
      dist: {
        src: ['src/templates/layouts/default.hbs'],
      },

    },

    useminPrepare: {
      html: '<%= config.src %>/templates/layouts/default.hbs',
      options: {
        dest: '<%= config.dist %>',
        staging: '.temp',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },
    usemin: {
      html: ['<%= config.dist %>/**/*.html'],
      css: ['<%= config.dist %>/assets/**/*.css'],
      options: {
        assetsDirs: ['<%= config.dist %>']
      }
    },
    cssmin: {
      options: {
        noRebase: true
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.dist %>',
          src: ['*.html'],
          dest: '<%= config.dist %>'
        }]
      }
    },


    // Before generating any new files,
    // remove any previously-created files.
    clean: ['<%= config.dist %>/**/*']

  });

  grunt.loadNpmTasks('assemble');

  grunt.registerTask('start_server', [
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['dist', 'start_server']);
    }

    grunt.task.run(['dev', 'start_server']);
  });

  grunt.registerTask('build', [
    'clean',
    'newer:copy:bower',
    'sass',
    'wiredep:dev',
    'assemble'
  ]);

  grunt.registerTask('copy_assets:dev', [
    'newer:copy:js', 'newer:copy:img', 'newer:copy:bower'
  ])
  grunt.registerTask('copy_assets:dist', [
    'newer:copy:img'
  ])

  grunt.registerTask('dev', [
    'clean',
    'wiredep:dev',
    'wiredep:scss',
    'sass:dev',
    'copy_assets:dev',
    'assemble'
  ]);

  grunt.registerTask('dist', [
    'clean',
    'wiredep:dist',
    'wiredep:scss',
    'sass:temp',
    'useminPrepare',
    'concat',
    'copy_assets:dist',
    'assemble',
    'cssmin',
    'uglify',
    'usemin',
    'htmlmin',
  ]);
  grunt.registerTask('default', [
    'server'
  ]);

};
