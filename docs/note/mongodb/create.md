# Mongoose 文档新增

文档新增有三种方法，一种是使用上面介绍过的文档的save()方法，另一种是使用模型model的create()方法，最后一种是模型model的insertMany()方法

#### [save()]

* [注意]回调函数可以省略

```js

save([options], [options.safe], [options.validateBeforeSave], [fn])

```
新建{age:10,name:'save'}文档，并保存

```js

var mongoose = require('mongoose');
mongoose.connect("mongodb://u1:123456@localhost/db1", function(err) {
    if(!err){
        var schema = new mongoose.Schema({ age:Number, name: String});
        var temp = mongoose.model('temp', schema);
        //使用链式写法
        new temp({age:10,name:'save'}).save(function(err,doc){
            //[ { _id: 59720bc0d2b1125cbcd60b3f, age: 10, name: 'save', __v: 0 } ]
            console.log(doc);
        });
    }
});
```
#### [create()]

使用save()方法，需要先实例化为文档，再使用save()方法保存文档。而create()方法，则直接在模型Model上操作，并且可以同时新增多个文档

```js

Model.create(doc(s), [callback])

```

新增{name:"xiaowang"}，{name:"xiaoli"}这两个文档

```js

var mongoose = require('mongoose');
mongoose.connect("mongodb://u1:123456@localhost/db1", function(err) {
    if(!err){
        var schema = new mongoose.Schema({ age:Number, name: String});
        var temp = mongoose.model('temp', schema);
        temp.create({name:"xiaowang"},{name:"xiaoli"},function(err,doc1,doc2){
            //{ __v: 0, name: 'xiaowang', _id: 59720d83ad8a953f5cd04664 }
            console.log(doc1);
            //{ __v: 0, name: 'xiaoli', _id: 59720d83ad8a953f5cd04665 }
            console.log(doc2);
        });
    }
});

```

#### [insertMany()]

```js

Model.insertMany(doc(s), [options], [callback])

```

新增{name:"a"}，{name:"b"}这两个文档

```js

var mongoose = require('mongoose');
mongoose.connect("mongodb://u1:123456@localhost/db1", function(err) {
    if(!err){
        var schema = new mongoose.Schema({ age:Number, name: String});
        var temp = mongoose.model('temp', schema);
        temp.insertMany([{name:"a"},{name:"b"}],function(err,docs){
            //[ { __v: 0, name: 'a', _id: 59720ea1bbf5792af824b30c },
            //{ __v: 0, name: 'b', _id: 59720ea1bbf5792af824b30d } ]
            console.log(docs);
        });

    }
});

```



