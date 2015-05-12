module.exports = function(grunt) {

  var globalConfig = {
      src: 'src/main/webapp',
      tomcatTheme: '/Applications/liferay-developer-studio/liferay-portal-6.2-ee-sp10/tomcat-7.0.42/webapps/lry-theme',
      pkg: grunt.file.readJSON('package.json')
  };

  grunt.initConfig({

    globalConfig: globalConfig,

    pkg: globalConfig.pkg,

    /**
     * Concatenates and minifies all JavaScript files into global.min.js
     * Also creates a global variable 'buildVersion' to be used in error loggging and auditing
     * 
     */

    uglify: {
      options: {
          sourceMap: true,
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
              '<%= grunt.template.today("yyyy-mm-dd") %> */ buildVersion = "<%= pkg.version %>";'
      },
      build: {
          src: '<%= globalConfig.src  %>/js/modules/**/*.js',
          dest: '<%= globalConfig.src  %>/js/global.min.js'
      }
    },

    /**
     *  Dev configuration appends version number to all javascript and image embeds to break client cache on version updates.
     *  
     *  Watch configuration is used to update a header in custom.css in order to trigger liferay to recompile 
     *  sass on css updates
     * 
     */

    cachebreaker: {
      dev: {
        options: {
            match: ['.svg', '.png', '.js'],
            replacement: function() {
                return globalConfig.pkg.version.replace(/\.|-/g, '_');
            }
        },
        files: {
          src: [
            '<%= globalConfig.src  %>/css/_variables.scss', 
            '<%= globalConfig.src  %>/templates/portal_normal.ftl'
            ]
        }
      },
      watch: {
        options: {
            match: ['.png'],
            replacement: function() {
                return globalConfig.pkg.version.replace(/\.|-/g, '_');
            }
        },
        files: {
          src: ['<%= globalConfig.src  %>/css/custom.css']
        }
      }
    },

    /**
     * Builds and optimizes SVG sprites based on individual SVGs located in svg-raw
     * Also outputs a sass file for background positioning
     * 
     */
    
    svg_sprite: {
      spriteCSS: {
        src: ['<%= globalConfig.src  %>/images/raw-svgs/**/*.svg'],
        dest: '<%= globalConfig.src  %>/images',       
        options        : {
          mode         : {
            css        : {     
              layout   : 'vertical',
              bust     : false,
              render   : {
                scss   : true,
              }
            }
          },
          shape             : {
            spacing         : {         
                padding     : 10,
            },
          },
        }
      }
    },

    /**
     * Used in the watch task to synchronize updated files from the src home directory to the tomcat 
     * server directory
     * 
     */

    sync: {
      main: {
        files: [{
          expand: true,
          cwd: "<%= globalConfig.src  %>",
          src: ["**"],
          dest: "<%= globalConfig.tomcatTheme  %>",
          pretend: true, 
          verbose: true 
        }]
      }
    },

    /**
     * Running grunt watch from the command line will allow frontend developers to see live changes
     * Installing the livereload plugin in the browser will autorefresh on file updates
     * 
     */

    watch: {
      css: {
          files: ["<%= globalConfig.src  %>/**"],
          tasks: ["cachebreaker:watch", "sync"],
          options: {
            livereload: true,
          }
      }
    }
  });

  // Load the plugins.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-cache-breaker');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-svg-sprite');
  grunt.loadNpmTasks('grunt-sync');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'cachebreaker:dev']);
};
