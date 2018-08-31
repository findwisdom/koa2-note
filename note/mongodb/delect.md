# Mongoose 文档删除

有三种方法用于文档删除

```js
remove()
findOneAndRemove()
findByIdAndRemove()

```

#### [remove()]

remove有两种形式，一种是文档的remove()方法，一种是Model的remove()方法

下面介绍Model的remove()方法，该方法的第一个参数conditions为查询条件，第二个参数回调函数的形式如下function(err){}

```js
model.remove(conditions, [callback])

```

![moogose_11](/assets/gitbook/moogose_11.png)

删除数据库中名称包括'30'的数据

```js
temp.remove({name:/30/},function(err){})

```
![moogose_12](/assets/gitbook/moogose_12.png)

* [注意]remove()方法中的回调函数不能省略，否则数据不会被删除。当然，可以使用exec()方法来简写代码

```js
temp.remove({name:/30/}).exec()

```

下面介绍文档的remove()方法，该方法的参数回调函数的形式如下function(err,doc){}

```js
document.remove([callback])

```

删除数据库中名称包含'huo'的数据

* [注意]文档的remove()方法的回调函数参数可以省略

```js
temp.find({name:/huo/},function(err,doc){
    doc.forEach(function(item,index,arr){
        item.remove(function(err,doc){
            //{ _id: 5971f93be6f98ec60e3dc86c, name: 'huochai', age: 30 }
            //{ _id: 5971f93be6f98ec60e3dc86e, name: 'huo', age: 60 }
            console.log(doc);
        })
    })
})

```

#### [findOneAndRemove()]

model的remove()会删除符合条件的所有数据，如果只删除符合条件的第一条数据，则可以使用model的findOneAndRemove()方法

```js
Model.findOneAndRemove(conditions, [options], [callback])

```
集合temps现有数据如下

![moogose_13](/assets/gitbook/moogose_13.png)

现在删除第一个年龄小于20的数据

```js
temp.findOneAndRemove({age:{$lt:20}},function(err,doc){
    //{ _id: 5972d3f3e6f98ec60e3dc873, name: 'wang', age: 18 }
    console.log(doc);
})

```

![moogose_14](/assets/gitbook/moogose_14.png)

与model的remove()方法相同，回调函数不能省略，否则数据不会被删除。当然，可以使用exec()方法来简写代码

```js
temp.findOneAndRemove({age:{$lt:20}}).exec()
```

#### [findByIdAndRemove()]

```js
Model.findByIdAndRemove(id, [options], [callback])
```
![moogose_15](/assets/gitbook/moogose_15.png)

删除第0个元素

```js
var aIDArr = [];
temp.find(function(err,docs){
    docs.forEach(function(item,index,arr){
        aIDArr.push(item._id);
    })
    temp.findByIdAndRemove(aIDArr[0],function(err,doc){
        //{ _id: 5972d754e6f98ec60e3dc882, name: 'huochai', age: 27 }
        console.log(doc);
    })
})
```

![moogose_16](/assets/gitbook/moogose_16.png)

类似的，该方法也不能省略回调函数，否则数据不会被删除。当然，可以使用exec()方法来简写代码

```js
var aIDArr = [];
temp.find(function(err,docs){
    docs.forEach(function(item,index,arr){
        aIDArr.push(item._id);
    })
    temp.findByIdAndRemove(aIDArr[0]).exec()
})
```

![moogose_17](/assets/gitbook/moogose_17.png)
