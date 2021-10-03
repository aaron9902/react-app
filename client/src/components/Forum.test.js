import React from 'react';
import { mount } from 'enzyme';
import Forums from './forums';
import { BrowserRouter, BrowserRouter as Router, Link } from "react-router-dom"; 

describe('<Forums/ >', () => {
  
  it('matches snapshot', () => {
    const wrapper = mount(<BrowserRouter><Forums /></BrowserRouter>);
    expect(wrapper).toMatchSnapshot();
  });

  it('it has input', () => {
    const wrapper = mount(<BrowserRouter><Forums /></BrowserRouter>);
    let input = wrapper.findWhere(
      node => node.type() === 'input'
    );
    expect(input.exists()).toBe(true);
  });

});
