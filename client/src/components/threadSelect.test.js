import React from 'react';
import { mount } from 'enzyme';
import ThreadSelect from './threadSelect';
import { BrowserRouter, BrowserRouter as Router, Link } from "react-router-dom"; 

describe('<ThreadSelect/ >', () => {

  
//StepID: S401
  it('matches snapshot', () => {
    const wrapper = mount(<BrowserRouter><ThreadSelect /></BrowserRouter>);
    expect(wrapper).toMatchSnapshot();
  });


});
