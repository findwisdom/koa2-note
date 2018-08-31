# Mongoose模块

Mongoose是在node.js异步环境下对mongodb进行便捷操作的对象模型工具。本文将详细介绍如何使用Mongoose来操作MongoDB

详细内容请参考[官方文档](http://mongoosejs.com/)

### 概述
Mongoose是NodeJS的驱动，不能作为其他语言的驱动。Mongoose有两个特点

* 1、通过关系型数据库的思想来设计非关系型数据库
* 2、基于mongodb驱动，简化操作

![moogose_0](/assets/gitbook/moogose_0.jpg)

Mongooose中，有三个比较重要的概念，分别是Schema、Model、Entity。它们的关系是：Schema生成Model，Model创造Document，Model和Document都可对数据库操作造成影响，但Model比Document更具操作性

`Schema`用于定义数据库的结构。类似创建表时的数据定义(不仅仅可以定义文档的结构和属性，还可以定义文档的实例方法、静态模型方法、复合索引等)，每个Schema会映射到mongodb中的一个collection，Schema不具备操作数据库的能力

`Model`是由Schema编译而成的构造器，具有抽象属性和行为，可以对数据库进行增删查改。Model的每一个实例（instance）就是一个文档document

`Document`是由Model创建的实体，它的操作也会影响数据库

### 安装 Mongoose 模块

```
npm install --save mysql

```

### 连接数据库

#### [connect()]

使用require()方法在项目中包含mongoose后，接下来使用connect()方法连接到MongoDB数据库

```js

mongoose.connect('mongodb://localhost/db1');

```

如果还需要传递用户名、密码，则可以使用如下方式

```js

mongoose.connect('mongodb://username:password@host:port/database?options...');

```

connect()方法还接受一个选项对象options，该对象将传递给底层驱动程序。这里所包含的所有选项优先于连接字符串中传递的选项

```js

mongoose.connect(uri, options);

```
可用选项如下所示

```

db            -数据库设置
 server        -服务器设置
 replset       -副本集设置
 user          -用户名
 pass          -密码
 auth          -鉴权选项
 mongos        -连接多个数据库
 promiseLibrary

```

```js

var options = {
  db: { native_parser: true },
  server: { poolSize: 5 },
  replset: { rs_name: 'myReplicaSetName' },
  user: 'myUserName',
  pass: 'myPassword'
}
mongoose.connect(uri, options);

```
如果要连接多个数据库，只需要设置多个url以,隔开，同时设置mongos为true

```js

mongoose.connect('urlA,urlB,...', {
   mongos : true
})

```
connect()函数还接受一个回调参数

```js
mongoose.connect(uri, options, function(error) {

});
```

执行下列代码后，控制台输出“连接成功”

```js
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/test", function(err) {
    if(err){
        console.log('连接失败');
    }else{
        console.log('连接成功');
    }
});

```

#### [disconnect()]

```js
mongoose.disconnect()

```

使用disconnect()方法可以断开连接

```js
var mongoose = require('mongoose');
mongoose.connect("mongodb://u1:123456@localhost/db1", function(err) {
    if(err){
        console.log('连接失败');
    }else{
        console.log('连接成功');
    }
});
setTimeout(function(){
    mongoose.disconnect(function(){
        console.log("断开连接");
    })
}, 2000);

```

### Schema

Schema主要用于定义MongoDB中集合Collection里文档document的结构。　　

定义Schema非常简单，指定字段名和类型即可，支持的类型包括以下8种。

```
String      字符串
Number      数字
Date        日期
Buffer      二进制
Boolean     布尔值
Mixed       混合类型
ObjectId    对象ID
Array       数组

```

通过mongoose.Schema来调用Schema，然后使用new方法来创建schema对象

```js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mySchema = new Schema({
  title:  String,
  author: String,
  body:   String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs:  Number
  }
});

```

* [注意]创建Schema对象时，声明字段类型有两种方法，一种是首字母大写的字段类型，另一种是引号包含的小写字段类型

```js

var mySchema = new Schema({title:String, author:String});
//或者
var mySchema = new Schema({title:'string', author:'string'});

```

如果需要在Schema定义后添加其他字段，可以使用add()方法

```js

var MySchema = new Schema;

MySchema.add({ name: 'string', color: 'string', price: 'number' });

```

#### [timestamps]

在schema中设置timestamps为true，schema映射的文档document会自动添加createdAt和updatedAt这两个字段，代表创建时间和更新时间

```js

var UserSchema = new Schema(
  {...},
  { timestamps: true }
);

```

#### [_id]

每一个文档document都会被mongoose添加一个不重复的_id，_id的数据类型不是字符串，而是ObjectID类型。如果在查询语句中要使用_id，则需要使用findById语句，而不能使用find或findOne语句

### Model

模型Model是根据Schema编译出的构造器，或者称为类，通过Model可以实例化出文档对象document.

文档document的创建和检索都需要通过模型Model来处理.

#### [model()]

```js

mongoose.model()

```

使用model()方法，将Schema编译为Model。model()方法的第一个参数是模型名称

* [注意]一定要将model()方法的第一个参数和其返回值设置为相同的值，否则会出现不可预知的结果

Mongoose会将集合名称设置为模型名称的小写版。如果名称的最后一个字符是字母，则会变成复数；如果名称的最后一个字符是数字，则不变；如果模型名称为"MyModel"，则集合名称为"mymodels"；如果模型名称为"Model1"，则集合名称为"model1"

```js

var schema = new mongoose.Schema({ num:Number, name: String, size: String});
var MyModel = mongoose.model('MyModel', schema);

```

#### [实例化文档document]

通过对原型Model1使用new方法，实例化出文档document对象

```js

var mongoose = require('mongoose');
mongoose.connect("mongodb://u1:123456@localhost/db1", function(err) {
    if(err){
        console.log('连接失败');
    }else{
        console.log('连接成功');
        var schema = new mongoose.Schema({ num:Number, name: String, size: String});
        var MyModel = mongoose.model('MyModel', schema);
        var doc1 = new MyModel({ size: 'small' });
        console.log(doc1.size);//'small'
    }
});

```

#### [文档保存]

通过new Model1()创建的文档doc1，必须通过save()方法，才能将创建的文档保存到数据库的集合中，集合名称为模型名称的小写复数版

回调函数是可选项，第一个参数为err，第二个参数为保存的文档对象

```js
save(function (err, doc) {})
```
```js
var mongoose = require('mongoose');
mongoose.connect("mongodb://u1:123456@localhost/db1", function(err) {
    if(!err){
        var schema = new mongoose.Schema({ num:Number, name: String, size: String });
        var MyModel = mongoose.model('MyModel', schema);
        var doc1 = new MyModel({ size: 'small' });
        doc1.save(function (err,doc) {
        //{ __v: 0, size: 'small', _id: 5970daba61162662b45a24a1 }
          console.log(doc);
        })
    }
});

```

由下图所示，db1数据库中的集合名称为mymodels，里面有一个{size:"small"}的文档

![moogose_1](/assets/gitbook/moogose_1.png)


