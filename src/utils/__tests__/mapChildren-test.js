/**
 * @emails react-core
 * @jsx React.DOM
 */

"use strict";

describe('mapChildren', function() {

  var React;
  var ReactTestUtils;

  var mapChildren;
  var reactComponentExpect;

  var Wrap;

  beforeEach(function() {
    React = require('React');
    ReactTestUtils = require('ReactTestUtils');

    mapChildren = require('mapChildren');
    reactComponentExpect = require('reactComponentExpect');

    Wrap = React.createClass({
      render: function() {
        return (
          <div>
            {mapChildren(this.props.children, this.props.mapFn, this)}
          </div>
        );
      }
    });

    this.addMatchers({
      toHaveKeys: function(expected) {
        if (this.actual.length != expected.length) {
          return false;
        }
        return this.actual.every(function(component, index) {
          return component._key === expected[index];
        }, this);
      }
    });
  });


  it('should support identity for simple', function() {
    var mapFn = jasmine.createSpy().andCallFake(function (kid, key, index) {
      return kid;
    });

    var simpleKid = <span key="simple" />;

    var instance = <Wrap mapFn={mapFn}>{simpleKid}</Wrap>;
    ReactTestUtils.renderIntoDocument(instance);

    var rendered = reactComponentExpect(instance)
      .expectRenderedChild()
      .instance();

    expect(mapFn).toHaveBeenCalledWith(simpleKid, 'simple', 0);
    expect(rendered.props.children[0]).toBe(simpleKid);
    expect(rendered.props.children).toHaveKeys(['simple']);
  });

  it('should pass key to returned component', function() {
    var mapFn = function (kid, key, index) {
      return <div>{kid}</div>;
    };

    var simpleKid = <span key="simple" />;

    var instance = <Wrap mapFn={mapFn}>{simpleKid}</Wrap>;
    ReactTestUtils.renderIntoDocument(instance);

    var rendered = reactComponentExpect(instance)
      .expectRenderedChild()
      .instance();

    expect(rendered.props.children[0]).not.toBe(simpleKid);
    expect(rendered.props.children[0].props.children[0]).toBe(simpleKid);
    expect(rendered.props.children).toHaveKeys(['simple']);
    expect(rendered.props.children[0].props.children).toHaveKeys(['simple']);
  });

  it('should be called for each child', function() {
    var mapFn = jasmine.createSpy().andCallFake(function (kid, key, index) {
      return <div>{kid}</div>;
    });

    var kidOne = <div key="one" />;
    var kidTwo = <div key="two" />;
    var kidThree = <div key="three" />;

    var instance = ReactTestUtils.renderIntoDocument(
      <Wrap mapFn={mapFn}>
        {kidOne}
        {null}
        {kidTwo}
        {null}
        {kidThree}
      </Wrap>
    );

    var rendered = reactComponentExpect(instance)
      .expectRenderedChild()
      .instance();

    expect(mapFn.calls.length).toBe(3);
    expect(mapFn).toHaveBeenCalledWith(kidOne, 'one', 0);
    expect(mapFn).toHaveBeenCalledWith(kidTwo, 'two', 1);
    expect(mapFn).toHaveBeenCalledWith(kidThree, 'three', 2);
    expect(rendered.props.children).not.toEqual(instance.props.children);
    expect(rendered.props.children).toHaveKeys(['one', 'two', 'three']);
  });
});
