# Mongoose 前后钩子及验证

### 前后钩子

前后钩子即pre()和post()方法，又称为中间件，是在执行某些操作时可以执行的函数。中间件在schema上指定，类似于静态方法或实例方法等

可以在数据库执行下列操作时，设置前后钩子

```
init
validate
save
remove
count
find
findOne
findOneAndRemove
findOneAndUpdate
insertMany
update

```

#### [pre()]

以find()方法为例，在执行find()方法之前，执行pre()方法

```js
var schema = new mongoose.Schema({ age:Number, name: String,x:Number,y:Number});
schema.pre('find',function(next){
    console.log('我是pre方法1');
    next();
});
schema.pre('find',function(next){
    console.log('我是pre方法2');
    next();
});
var temp = mongoose.model('temp', schema);
temp.find(function(err,docs){
    console.log(docs[0]);
})
/*
我是pre方法1
我是pre方法2
{ _id: 5972ed35e6f98ec60e3dc886,name: 'huochai',age: 27,x: 1,y: 2 }
*/
```

#### [post()]

post()方法并不是在执行某些操作后再去执行的方法，而在执行某些操作前最后执行的方法，post()方法里不可以使用next()

```js
var schema = new mongoose.Schema({ age:Number, name: String,x:Number,y:Number});
schema.post('find',function(docs){
    console.log('我是post方法1');
});
schema.post('find',function(docs){
    console.log('我是post方法2');
});
var temp = mongoose.model('temp', schema);
temp.find(function(err,docs){
    console.log(docs[0]);
})
/*
我是post方法1
我是post方法2
{ _id: 5972ed35e6f98ec60e3dc886,name: 'huochai',age: 27,x: 1,y: 2 }
 */
```

### 查询后处理

常用的查询后处理的方法如下所示

```
sort     排序
skip     跳过
limit    限制
select   显示字段
exect    执行
count    计数
distinct 去重

```

```js
var schema = new mongoose.Schema({ age:Number, name: String,x:Number,y:Number});
var temp = mongoose.model('temp', schema);
temp.find(function(err,docs){
    //[ { _id: 5972ed35e6f98ec60e3dc886,name: 'huochai',age: 27,x: 1,y: 2 },
    //{ _id: 5972ed35e6f98ec60e3dc887,name: 'wang',age: 18,x: 1,y: 1 },
    //{ _id: 5972ed35e6f98ec60e3dc888, name: 'huo', age: 30, x: 2, y: 1 },
    //{ _id: 5972ed35e6f98ec60e3dc889, name: 'li', age: 20, x: 2, y: 2 } ]
    console.log(docs);
})
```
#### [sort()]

按age从小到大排序

```js
temp.find().sort("age").exec(function(err,docs){
    //[ { _id: 5972ed35e6f98ec60e3dc887,name: 'wang',age: 18,x: 1,y: 1 },
    //{ _id: 5972ed35e6f98ec60e3dc889, name: 'li', age: 20, x: 2, y: 2 },
    //{ _id: 5972ed35e6f98ec60e3dc886,name: 'huochai',age: 27,x: 1,y: 2 },
    //{ _id: 5972ed35e6f98ec60e3dc888, name: 'huo', age: 30, x: 2, y: 1 } ]
    console.log(docs);
});
```
#### [skip()]

跳过1个，显示其他

```js
temp.find().skip(1).exec(function(err,docs){
    //[ { _id: 5972ed35e6f98ec60e3dc887,name: 'wang',age: 18,x: 1,y: 1 },
    //{ _id: 5972ed35e6f98ec60e3dc888, name: 'huo', age: 30, x: 2, y: 1 },
    //{ _id: 5972ed35e6f98ec60e3dc889, name: 'li', age: 20, x: 2, y: 2 } ]
    console.log(docs);
});
```

#### [limit()]

```js
temp.find().limit(2).exec(function(err,docs){
    //[ { _id: 5972ed35e6f98ec60e3dc886,name: 'huochai',age: 27,x: 1,y: 2 },
    //{ _id: 5972ed35e6f98ec60e3dc887,name: 'wang',age: 18,x: 1,y: 1 } ]
    console.log(docs);
});

```

#### [select()]

显示name、age字段，不显示_id字段

```js
temp.find().select("name age -_id").exec(function(err,docs){
    //[ { name: 'huochai', age: 27 },{ name: 'wang', age: 18 },{ name: 'huo', age: 30 },{ name: 'li', age: 20 } ]
    console.log(docs);
});
```
```js
temp.find().select({name:1, age:1, _id:0}).exec(function(err,docs){
    //[ { name: 'huochai', age: 27 },{ name: 'wang', age: 18 },{ name: 'huo', age: 30 },{ name: 'li', age: 20 } ]
    console.log(docs);
});
```

下面将以上方法结合起来使用，跳过第1个后，只显示2个数据，按照age由大到小排序，且不显示_id字段

```js
temp.find().skip(1).limit(2).sort("-age").select("-_id").exec(function(err,docs){
    //[ { name: 'huochai', age: 27, x: 1, y: 2 },
    //{ name: 'li', age: 20, x: 2, y: 2 } ]
    console.log(docs);
});
```

#### [count()]

显示集合temps中的文档数量

```js
temp.find().count(function(err,count){
    console.log(count);//4
});

```

#### [distinct()]

返回集合temps中的x的值

```js
temp.find().distinct('x',function(err,distinct){
    console.log(distinct);//[ 1, 2 ]
});

```

### 文档验证

为什么需要文档验证呢？以一个例子作为说明，schema进行如下定义

```js
var schema = new mongoose.Schema({ age:Number, name: String,x:Number,y:Number});

```

如果不进行文档验证，保存文档时，就可以不按照Schema设置的字段进行设置，分为以下几种情况

1、缺少字段的文档可以保存成功

```js
var temp = mongoose.model('temp', schema);
new temp({age:10}).save(function(err,doc){
    //{ __v: 0, age: 10, _id: 597304442b70086a1ce3cf05 }
    console.log(doc);
});

```

2、包含未设置的字段的文档也可以保存成功，未设置的字段不被保存

```js
new temp({age:100,abc:"abc"}).save(function(err,doc){
    //{ __v: 0, age: 100, _id: 5973046a2bb57565b474f48b }
    console.log(doc);
});

```

3、包含字段类型与设置不同的字段的文档也可以保存成功，不同字段类型的字段被保存为设置的字段类型

```js
new temp({age:true,name:10}).save(function(err,doc){
    //{ __v: 0, age: 1, name: '10', _id: 597304f7a926033060255366 }
    console.log(doc);
});

```

而通过文档验证，就可以避免以下几种情况发生

文档验证在SchemaType中定义，格式如下

```js
{name: {type:String, validator:value}}

```

常用验证包括以下几种

```
required: 数据必须填写
default: 默认值
validate: 自定义匹配
min: 最小值(只适用于数字)
max: 最大值(只适用于数字)
match: 正则匹配(只适用于字符串)
enum:  枚举匹配(只适用于字符串)

```

#### [required]

将age设置为必填字段，如果没有age字段，文档将不被保存，且出现错误提示

```js
var schema = new mongoose.Schema({ age:{type:Number,required:true}, name: String,x:Number,y:Number});
var temp = mongoose.model('temp', schema);
new temp({name:"abc"}).save(function(err,doc){
    //Path `age` is required.
    console.log(err.errors['age'].message);
});

```

#### [default]

设置age字段的默认值为18，如果不设置age字段，则会取默认值

```js
var schema = new mongoose.Schema({ age:{type:Number,default:18}, name:String,x:Number,y:Number});
var temp = mongoose.model('temp', schema);
new temp({name:'a'}).save(function(err,doc){
    //{ __v: 0, name: 'a', _id: 59730d2e7a751d81582210c1, age: 18 }
    console.log(doc);
});

```

#### [min | max]

将age的取值范围设置为[0,10]。如果age取值为20，文档将不被保存，且出现错误提示

```js
var schema = new mongoose.Schema({ age:{type:Number,min:0,max:10}, name: String,x:Number,y:Number});
var temp = mongoose.model('temp', schema);
new temp({age:20}).save(function(err,doc){
    //Path `age` (20) is more than maximum allowed value (10).
    console.log(err.errors['age'].message);
});

```

#### [match]

将name的match设置为必须存在'a'字符。如果name不存在'a'，文档将不被保存，且出现错误提示

```js
var schema = new mongoose.Schema({ age:Number, name:{type:String,match:/a/},x:Number,y:Number});
var temp = mongoose.model('temp', schema);
new temp({name:'bbb'}).save(function(err,doc){
    //Path `name` is invalid (bbb).
    console.log(err.errors['name'].message);
});

```

#### [enum]

将name的枚举取值设置为['a','b','c']，如果name不在枚举范围内取值，文档将不被保存，且出现错误提示

```js
var schema = new mongoose.Schema({ age:Number, name:{type:String,enum:['a','b','c']},x:Number,y:Number});
var temp = mongoose.model('temp', schema);
new temp({name:'bbb'}).save(function(err,doc){
    //`bbb` is not a valid enum value for path `name`.
    console.log(err.errors['name'].message);

});

```

#### [validate]

validate实际上是一个函数，函数的参数代表当前字段，返回true表示通过验证，返回false表示未通过验证。利用validate可以自定义任何条件。比如，定义名字name的长度必须在4个字符以上

```js
var validateLength = function(arg){
    if(arg.length > 4){
        return true;
    }
    return false;
};
var schema = new mongoose.Schema({ name:{type:String,validate:validateLength}, age:Number,x:Number,y:Number});
var temp = mongoose.model('temp', schema);
new temp({name:'abc'}).save(function(err,doc){
    //Validator failed for path `name` with value `abc`
    console.log(err.errors['name'].message);
});

```
