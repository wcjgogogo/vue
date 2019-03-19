//由于webpack基于node进行构建，所以，webpack的配置文件中，任何合法的node代码都是支持的
var path=require('path')
var htmlWebpackPlugin=require('html-webpack-plugin')
//当以命令行形式运行webpack或webpack-dev-server的时候，工具会发现，我们并没有提供要打包的文件的入口和出口文件，此时，他会检查项目根目录中的配置文件，并读取这个文件
module.exports={
    entry:path.join(__dirname,'./src/main.js'),
    output:{
        path:path.join(__dirname,'./dist'),
        filename:'bundle.js'
    },
    plugins:[
        new htmlWebpackPlugin({
            template:path.join(__dirname,'./src/index.html'),
            filename:'index.html'
        })
    ],
    module:{
        rules:[
            {test:/\.css$/,use:['style-loader','css-loader']},
            {test:/\.less$/,use:['style-loader','css-loader','less-loader']},
            {test:/\.scss$/,use:['style-loader','css-loader','sass-loader']},
            {test:/\.(jpg|png|gif)$/,use:'url-loader?limit=131983&name=[hash:8]-[name].[ext]'},
            //limit给定的值，是图片的大小，单位是byte
            {test:/\.(ttf|eot|svg|woff|woff2)$/,use:'url-loader'},//处理字体文件的loader对象
            {test:/\.js$/,use:'babel-loader',exclude:/node_module/},//配置babel
            {test:/\.vue$/,use:'vue-loader'}
        ]
    },
    resolve:{
        alias:{//修改vue被导入时候的包的路径
             //"vue$":"vue/dist/vue.js"
        }
    }
}
