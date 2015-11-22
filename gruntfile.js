module.exports = function (grunt) {

    grunt.initConfig({
        uglify: {
            my_target: {
                options: {
                    mangle: false,
                    sourceMap: true,
                },
                files: {
                    'public/app.js': ['src/js/app.js', 'src/**/*.js']
                },
            }
        },
        less: {
            development: {
                options: {
                    paths: ["src/less"]
                },
                files: {
                    "public/style.css": "src/less/style.less"
                }
            },
            production: {
                options: {
                    paths: ["src/less"],
                    plugins: [
                        new(require('less-plugin-autoprefix'))({
                            browsers: ["last 2 versions"]
                        })
                    ],
                    modifyVars: {
                        //imgPath: '"http://mycdn.com/path/to/images"',
                        //bgColor: 'red'
                    }
                },
                files: {
                    "public/style.css": "src/less/style.less"
                }
            }
        },
        bower: {
            install: {
                options: {
                    targetDir: './public/lib',
                    layout: 'byType',
                    install: true,
                    verbose: false,
                    cleanTargetDir: false,
                    cleanBowerDir: false,
                    bowerOptions: {}
                }
            }
        },
        watch: {
            scripts: {
                files: ['src/js/*.js'],
                tasks: ['uglify']
            },
            styleSheets: {
                files: ['src/less/*.less'],
                tasks: ['less']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-task');

    grunt.registerTask('default', ['bower', 'less', 'uglify']);

};