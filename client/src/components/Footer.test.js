import React from 'react';
import { mount } from 'enzyme';
import Footer from './Footer';
import { BrowserRouter, BrowserRouter as Router, Link } from "react-router-dom"; 

describe('<Footer/ >', () => {

  
//StepID: S201
  it('matches snapshot', () => {
    const wrapper = mount(<BrowserRouter><Footer /></BrowserRouter>);
    expect(wrapper).toMatchSnapshot();
  });

});
