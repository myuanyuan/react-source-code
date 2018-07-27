### react 源码学习笔记
#### 准备工作
刚开始没有看老师给的[文档](https://www.yuque.com/ant-h5/react/xmb111),傻乎乎的下载了react-16，死活找不到源码入口，感谢老师的整理；
从文档里的准备工作可以知道我们要从最早的稳定版v0.3.0学起，通过git命令切换版本。
```
$ git clone https://github.com/facebook/react.git
$ git checkout 0.3-stable
$ git checkout v0.3.0
```
由于老师的文档已经非常清晰了，我就不再赘述，只是记录一下自己在学习过程中不理解的地方；

#### React.createClass
##### createClass 使用

```javascript
var ExampleApplication = React.createClass({
    getInitialState() {
        return {}
    }, 
    
    componentWillMount() {
    },
    
    componentDidMount() {
    },
    
    render: function() {
        return <div>hello world</div>
    }
});
React.renderComponent(
  ExampleApplication({elapsed: new Date().getTime() - start}),
  document.getElementById('container')
);
```

##### createClass 源码

```javascript
createClass: function (spec) {
    var Constructor = function (initialProps, children) {
      this.construct(initialProps, children);
    };
    // Constructor 的原形指向 ReactCompositeComponentBase 的实例 
    // 相当于完全删除了 Constructor.prototype 对象原先的值,赋予一个新值
    // 即所有 Constructor 的实例可以继承 ReactCompositeComponentBase
    // 此时 Constructor.prototype.constructor 是指向 ReactCompositeComponentBase 的
    Constructor.prototype = new ReactCompositeComponentBase();
    // 把 Constructor 的原型的 constructor 重新指向 Constructor 否则会导致继承链的紊乱
    Constructor.prototype.constructor = Constructor;
    mixSpecIntoComponent(Constructor, spec);
    // invariant 断言
    invariant(
      Constructor.prototype.render, // 这里的render是ReactCompositeComponentBase的render
      'createClass(...): Class specification must implement a `render` method.'
    );
    var ConvenienceConstructor = function (props, children) {
      // 返回 Constructor 的实例
      return new Constructor(props, children);
    };
    // ConvenienceConstructor 上添加一个 componentConstructor 属性指向 Constructor
    ConvenienceConstructor.componentConstructor = Constructor;
    // 给 ConvenienceConstructor 的 originalSpec 赋值
    ConvenienceConstructor.originalSpec = spec;
    // 返回 ConvenienceConstructor 
    // 并且注意 每一个 ConvenienceConstructor 的返回的Constructor都是一个新的实例
    return ConvenienceConstructor;
}
// 所以createClass生成的是一个类组件 

construct: function (initialProps, children) {
    this.props = initialProps || {};
    if (typeof children !== 'undefined') {
        this.props.children = children;
    }
    // Record the component responsible for creating this component.
    this.props[OWNER] = ReactCurrentOwner.current;
    // All components start unmounted.
    this._lifeCycleState = ComponentLifeCycle.UNMOUNTED;
}
```
##### renderComponent 使用

renderComponent(component, container)负责将一个component实例渲染到给定的container中。
```javascript
React.renderComponent(
  ExampleApplication({elapsed: new Date().getTime() - start}),
  document.getElementById('container')
);
```

##### renderComponent 源码

```javascript
  // 获取根结点id
  function getReactRootID(container) {
    return container.firstChild && container.firstChild.id;
  },
  // 滚动条监听
  scrollMonitor: function(container, renderCallback) {
    renderCallback();
  },
  getReactRootIDFromNodeID: function(id) {
    var regexResult = /\.reactRoot\[[^\]]+\]/.exec(id);
    return regexResult && regexResult[0];
  },
  // 注册组件id
  registerContainer: function(container) {
    var reactRootID = getReactRootID(container);
    // 这里判断reactRootID是判断没有关联组件的这个container是否有id属性
    if (reactRootID) {
      // 如果container有id，则通过getReactRootIDFromNodeID判断是否是reactRoot
      // If one exists, make sure it is a valid "reactRoot" ID.
      reactRootID = ReactInstanceHandles.getReactRootIDFromNodeID(reactRootID);
    }
    if (!reactRootID) {
      // 如果不是根节点则进行创建
      // No valid "reactRoot" ID found, create one.
      reactRootID = ReactInstanceHandles.getReactRootID(
        globalMountPointCounter++
      );
    }
    containersByReactRootID[reactRootID] = container;
    return reactRootID;
  },
  renderComponent: function(nextComponent, container) {
    // 先判断与该container关联的Component是否存在
    var prevComponent = instanceByReactRootID[getReactRootID(container)];
    // 如果与该container关联的 Component 存在,直接替换props后返回该 Component
    if (prevComponent) {  
      var nextProps = nextComponent.props;
      // 保持滚动条不变   **这里不懂怎么保持滚动条不变的**
      ReactMount.scrollMonitor(container, function() {
        prevComponent.replaceProps(nextProps);
      });
      return prevComponent;
    }
    // 挂载事件
    ReactMount.prepareTopLevelEvents(ReactEventTopLevelCallback);
    // 如果与该container关联的 Component 不存在, 注册组件id并记录在instanceByReactRootID中
    var reactRootID = ReactMount.registerContainer(container);
    instanceByReactRootID[reactRootID] = nextComponent;
    nextComponent.mountComponentIntoNode(reactRootID, container);
    return nextComponent;
  }

```
##### mountComponentIntoNode 使用 todo

```javascript
nextComponent.mountComponentIntoNode(reactRootID, container);
```

##### mountComponentIntoNode 源码

```javascript
mountComponentIntoNode: function(rootID, container) {
      var transaction = ReactComponent.ReactReconcileTransaction.getPooled();
      transaction.perform(
        this._mountComponentIntoNode,
        this,
        rootID,
        container,
        transaction
      );
      ReactComponent.ReactReconcileTransaction.release(transaction);
    },
```


Recently tired, the workload is not heavy, but I am always very tired.
We haven't been connected for a week.
/*
 * @Author: beth.miao 
 * @Date: 2018-07-27 16:59:50 
 * @Last Modified by: beth.miao
 * @Last Modified time: 2018-07-27 19:26:37
 */