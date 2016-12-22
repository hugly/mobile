module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    //清除build
    time: Date.now(),
    //编译less文件
    less: {
      options:{
        cleancss: true,
        Choices: 'gzip',
        paths:'style/',
        ieCompat: true,
        banner:'/*\n@ project:<%=pkg.name%>\n@ date:<%=grunt.template.today("yyyy-mm-dd")%>\n*/'
      },
      build: {
        files: {
            'style/css/main.min.css': 'style/less/main.less',
            'style/css/index.min.css': 'style/less/index.less',
            'style/css/list.min.css': 'style/less/list.less',
            'style/css/detail.min.css': 'style/less/detail.less',
            'style/css/quick.min.css': 'style/less/quick.less',
            'style/css/address.min.css': 'style/less/address.less',
            'style/css/person.min.css': 'style/less/person.less',
            'style/css/account.min.css': 'style/less/account.less',
            'style/css/merchant.min.css': 'style/less/merchant.less',
            'style/css/pay.min.css': 'style/less/pay.less',
            'style/css/footprint.min.css': 'style/less/footprint.less',
            'style/css/persongrouplist.min.css': 'style/less/persongrouplist.less',
            'style/css/valudategroup.min.css': 'style/less/valudategroup.less',
            'style/css/bindphone.min.css': 'style/less/bindphone.less',
            'style/css/myqrcode.min.css': 'style/less/myqrcode.less',
            'style/css/membershipcardadd.min.css': 'style/less/membershipcardadd.less',
            'style/css/membershiplist.min.css': 'style/less/membershiplist.less',
            'style/css/discovered.min.css': 'style/less/discovered.less',
            'style/css/activity.min.css': 'style/less/activity.less',
            'style/css/withdraw.min.css': 'style/less/withdraw.less',
            'style/css/trends.min.css': 'style/less/trends.less',
            'style/css/activi.min.css': 'style/less/activi.less',
            'style/css/prolist.min.css': 'style/less/prolist.less',
            'style/css/voucher.min.css': 'style/less/voucher.less',
            'style/css/choosetime.min.css': 'style/less/choosetime.less',
            'style/css/logistics.min.css': 'style/less/logistics.less',
            'style/css/figures.min.css': 'style/less/figures.less',
            'style/css/circul.min.css': 'style/less/circul.less',
            'style/css/activity10.min.css': 'style/less/activity10.less',
            'style/css/print.min.css': 'style/less/print.less',
            'style/css/wechatsignin.min.css': 'style/less/wechatsignin.less',
            'style/css/merchantinfo.min.css': 'style/less/merchantinfo.less',
            'style/css/offline_index.min.css': 'style/less/offline_index.less',
            'style/css/offline_usrtest.min.css': 'style/less/offline_usrtest.less',
            'style/css/offline_info.min.css': 'style/less/offline_info.less',
            'style/css/bindvouchers.min.css': 'style/less/bindvouchers.less',
            'style/css/bookdetail.min.css': 'style/less/bookdetail.less',
            'style/css/disindex.min.css': 'style/less/disindex.less',
            'style/css/discenter.min.css': 'style/less/discenter.less',
            'style/css/disdetail.min.css': 'style/less/disdetail.less',
            'style/css/dishistory.min.css': 'style/less/dishistory.less',
            'style/css/disorder.min.css': 'style/less/disorder.less',
            'style/css/disrelect.min.css': 'style/less/disrelect.less',
            'style/css/disrelectaudit.min.css': 'style/less/disrelectaudit.less',
            'style/css/disrelectrecods.min.css': 'style/less/disrelectrecods.less',
            'style/css/proflow.min.css': 'style/less/proflow.less',
            'style/css/pickflow.min.css': 'style/less/pickflow.less',
            'style/css/detailflow.min.css': 'style/less/detailflow.less',
            'style/css/completeflow.min.css': 'style/less/completeflow.less',
            'style/css/verfy.min.css': 'style/less/verfy.less',
            'style/css/christmas.min.css': 'style/less/christmas.less'
        }
      }
    },
    includereplace: {
        html: {
            src: ['main/*','personal/*','account/*','merchant/*','pay/*'],
            dest: 'dist/',
            expand: true,
            cwd: 'html'
        }
    },
      //监听端口
    connect: {
      options: {
        expand: true, 
        port: 9527,
        hostname: 'localhost', //默认就是这个值，可配置为本机某个 IP，localhost 或域名
        livereload: 3575  //声明给 watch 监听的端口
      },
      server: {
        options: {                    
          open: true, //自动打开网页 http://
          base: [
            ''  //主目录                  
          ]                
        }
      }
    },

    //监听变化
    watch: {
      livereload:{
        options: {
          expand: true, 
          spawn: false,
          open: true,
          livereload: '<%=connect.options.livereload%>'  //监听前面声明的端口  35729
        },
        files: [  //下面文件的改变就会实时刷新网页
          'html/main/*.html',
          'style/{,*/}*.{png,jpg,gif,css,less}',
          'js/{,*/}*.js'
          //'app/images/{,*/}*.{png,jpg}'
        ]
      },
      less: {
        files: '*.less',
        tasks: ['less:build'],
        options:{
          cwd: 'style/less/',
          spawn: false
        }
      }
      // ,
      // html: {
      //     files:'*.html',
      //     tasks:['includereplace:<%=action%>'],
      //     options:{
      //         cwd: 'html/',
      //         spawn: false
      //     }
      // }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-include-replace');
  grunt.loadNpmTasks('grunt-processhtml');

  //,'includereplace:html'
  grunt.registerTask('default', [ 'less:build','watch']);
  //,'connect:server'

};
