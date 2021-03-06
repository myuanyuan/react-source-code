/**
 * @jsx React.DOM
 * @emails react-core
 */

"use strict";

require('mock-modules');

var React = require('React');
var ReactTestUtils = require('ReactTestUtils');
var ReactTextComponent = require('ReactTextComponent');

var reactComponentExpect = require('reactComponentExpect');

var assertNodeText = function(instance, text) {
  expect(instance.getDOMNode().childNodes.length).toBe(1);
  expect(instance.getDOMNode().innerHTML).toBe('' + text);
};

var assertEmptyNode = function(instance) {
  expect(instance.getDOMNode().childNodes.length).toBe(0);
};

var assertMultiChild = function(instance, textOne, textTwo) {
  expect(instance.getDOMNode().childNodes.length).toBe(2);
  var firstTextDOMNode =
    reactComponentExpect(instance)
      .expectRenderedChildAt(0)
      .toBeTextComponent()
      .instance()
      .getDOMNode();
  expect(firstTextDOMNode.childNodes.length).toBe(textOne === '' ? 0 : 1);
  expect(firstTextDOMNode.innerHTML).toBe('' + textOne);

  var secondTextDOMNode =
    reactComponentExpect(instance)
      .expectRenderedChildAt(1)
      .toBeTextComponent()
      .instance()
      .getDOMNode();
  expect(secondTextDOMNode.childNodes.length).toBe(textTwo === '' ? 0 : 1);
  expect(secondTextDOMNode.innerHTML).toBe('' + textTwo);
};

var assertSingleChild = function(instance, text) {
  expect(instance.getDOMNode().childNodes.length).toBe(1);
  var textDOMNode =
    reactComponentExpect(instance)
      .expectRenderedChildAt(0)
      .toBeTextComponent()
      .instance()
      .getDOMNode();
  expect(textDOMNode.childNodes.length).toBe(1);
  expect(textDOMNode.innerHTML).toBe('' + text);
};

// Helpers
var renderSingleContentChild = function(text) {
  var d = ReactTestUtils.renderIntoDocument(<div content={text} />);
  return d;
};
var renderSingleTextChild = function(text) {
  var d = ReactTestUtils.renderIntoDocument(<div>{text}</div>);
  return d;
};
var renderMultipleTextChildren = function(textOne, textTwo) {
  var d = ReactTestUtils.renderIntoDocument(<div>{textOne}{textTwo}</div>);
  return d;
};

var TestCompositeComponent = React.createClass({
  render: function() {
    return (
      <div> </div>
    );
  }
});

/**
 * ReactMultiChild DOM integration test. In ReactDOM components, we make sure
 * that single children that are strings are treated as "content" which is much
 * faster to render and update.
 */
describe('ReactMultiChildText', function() {
  it('should render null as empty', function() {
    var d = renderSingleTextChild(null);
    // false should act exactly as a null child
    assertEmptyNode(d);
  });

  it('should render undefined as empty', function() {
    var d = renderSingleTextChild(undefined);
    // false should act exactly as a null child
    assertEmptyNode(d);
  });

  it('should render null as empty then switch to text node', function() {
    var d = renderSingleTextChild(null);
    // false should act exactly as a null child
    assertEmptyNode(d);
    d.replaceProps({children: 'hello'});
    assertNodeText(d, 'hello');
  });

  it('should render undefined as empty then switch to text node', function() {
    var d = renderSingleTextChild(undefined);
    // false should act exactly as a null child
    assertEmptyNode(d);
    d.replaceProps({children: 'hello'});
    assertNodeText(d, 'hello');
  });

  it('should render null as empty then switch to span children', function() {
    var d = renderSingleTextChild(null);
    // false should act exactly as a null child
    assertEmptyNode(d);
    d.replaceProps({children: ['hello', 'goodbye']});
    assertMultiChild(d, 'hello', 'goodbye');
  });

  it('should render null as empty then switch to span children', function() {
    var d = renderSingleTextChild(undefined);
    // false should act exactly as a null child
    assertEmptyNode(d);
    d.replaceProps({children: ['hello', 'goodbye']});
    assertMultiChild(d, 'hello', 'goodbye');
  });

  it('should render zero string as text node  then switch to spans', function() {
    var d = renderSingleTextChild('0');
    // false should act exactly as a null child
    assertNodeText(d, '0');
    d.replaceProps({children: ['hello', 'goodbye']});
    assertMultiChild(d, 'hello', 'goodbye');
  });

  it('should render zero number as text node  then switch to spans', function() {
    var d = renderSingleTextChild('0');
    // false should act exactly as a null child
    assertNodeText(d, 0);
    d.replaceProps({children: ['hello', 'goodbye']});
    assertMultiChild(d, 'hello', 'goodbye');
  });

  it('should render content to single text node', function() {
    var d = renderSingleContentChild('hello');
    assertNodeText(d, 'hello');
  });

  it('should render a single text child to a single text node', function() {
    var d = renderSingleTextChild('hello');
    assertNodeText(d, 'hello');
  });

  it('should render two string children to two spans', function() {
    var d = renderMultipleTextChildren('hello', 'goodbye');
    assertMultiChild(d, 'hello', 'goodbye');
  });

  it('should render false as a null child', function() {
    var d = renderMultipleTextChildren(false, 234.2);
    // false should act exactly as a null child
    assertSingleChild(d, '234.2');
  });

  it('should render true as a null child', function() {
    var d = renderMultipleTextChildren(true, 234.2);
    // false should act exactly as a null child
    assertSingleChild(d, '234.2');
  });

  it('should render true as a null child', function() {
    var d = renderMultipleTextChildren(true, 234.2);
    // false should act exactly as a null child
    assertSingleChild(d, '234.2');
  });

  it('should render one true as no children', function() {
    var d = renderSingleTextChild(true);
    assertEmptyNode(d);
  });

  it('should render one false as no children', function() {
    var d = renderSingleTextChild(false);
    assertEmptyNode(d);
  });

  it('should render empty string as no children', function() {
    var d = renderSingleTextChild('');
    assertEmptyNode(d);
  });

  it('should render two empty strings as two empty spans', function() {
    var d = renderMultipleTextChildren('', '');
    assertMultiChild(d, '', '');
  });

  it('should render empty string and string as two spans', function() {
    var d = renderMultipleTextChildren('', 'yo');
    assertMultiChild(d, '', 'yo');
  });

  it('should render child string zero as text node', function() {
    var d = renderSingleTextChild('0');
    // false should act exactly as a null child
    assertNodeText(d, '0');
  });

  it('should render child number zero as text node', function() {
    var d = renderSingleTextChild(0);
    // false should act exactly as a null child
    assertNodeText(d, '0');
  });

  it('should render content string zero as text node', function() {
    var d = renderSingleTextChild('0');
    // false should act exactly as a null child
    assertNodeText(d, '0');
  });

  it('should render content number zero as text node', function() {
    var d = renderSingleContentChild(0);
    // false should act exactly as a null child
    assertNodeText(d, '0');
  });

  it('should render zero string as string child', function() {
    var d = renderMultipleTextChildren('0', 234.2);
    // false should act exactly as a null child
    assertMultiChild(d, '0', '234.2');
  });

  it('should render zero string as string child then text node', function() {
    var d = renderMultipleTextChildren('0', 234.2);
    // false should act exactly as a null child
    assertMultiChild(d, '0', '234.2');
    d.replaceProps({content: '0'});
    assertNodeText(d, '0');
  });

 it('should render zero number as string child then text node', function() {
    var d = renderMultipleTextChildren(0, 234.2);
    // false should act exactly as a null child
    assertMultiChild(d, '0', '234.2');
    d.replaceProps({content: 0});
    // BELOW REVEALS A BUG IN JSDOM
    // assertNodeText(d, '0');  // This works in the browser.
  });

  it('should render multiple children then switch to inline', function() {
    var d = renderMultipleTextChildren('hello', 'goodbye');
    assertMultiChild(d, 'hello', 'goodbye');
    d.replaceProps({content: 'hello'});
    assertNodeText(d, 'hello');
  });

  it('should render multiple children then switch to inline child', function() {
    var d = renderMultipleTextChildren('hello', 'goodbye');
    assertMultiChild(d, 'hello', 'goodbye');
    // Even when switching from content to a single child, it should render
    // that single child as inline content.
    d.replaceProps({children: 'hello'});
    assertNodeText(d, 'hello');
  });

  it('should render inline child, then switch to text components ', function() {
    var d = renderSingleTextChild('hello');
    assertNodeText(d, 'hello');
    d.replaceProps({children: ['hello', 'goodbye']});
    assertMultiChild(d, 'hello', 'goodbye');
  });

  it('should render content, then switch to text components ', function() {
    var d = renderSingleContentChild('hello');
    assertNodeText(d, 'hello');
    d.replaceProps({children: ['hello', 'goodbye']});
    assertMultiChild(d, 'hello', 'goodbye');
  });

  it('should render inline child, then switch to composite', function() {
    var d = renderSingleTextChild('hello');
    assertNodeText(d, 'hello');
    d.replaceProps({children: <TestCompositeComponent />});
    reactComponentExpect(d)
      .expectRenderedChildAt(0)
      .toBeCompositeComponentWithType(TestCompositeComponent);
  });

  it('should throw if rendering both content and children', function() {
    expect(function() {
      ReactTestUtils.renderIntoDocument(<div content="asdf">ghjkl</div>);
    }).toThrow();
  });
});
