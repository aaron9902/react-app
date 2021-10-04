import React from 'react';
import { mount } from 'enzyme';
import ForumSelect from './forumSelect';
import { BrowserRouter, BrowserRouter as Router, Link } from "react-router-dom"; 

describe('<ForumSelect/ >', () => {

  
//StepID: S401
  it('matches snapshot', () => {
    const wrapper = mount(<BrowserRouter><ForumSelect /></BrowserRouter>);
    expect(wrapper).toMatchSnapshot();
  });

});
