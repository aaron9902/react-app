import React from 'react';
import { mount } from 'enzyme';
import Users from './usermanagement/Users';
import { BrowserRouter, BrowserRouter as Router, Link } from "react-router-dom"; 

describe('<Users/ >', () => {

  
//StepID: S500
  it('matches snapshot', () => {
    const wrapper = mount(<BrowserRouter><Users /></BrowserRouter>);
    expect(wrapper).toMatchSnapshot();
  });


});
