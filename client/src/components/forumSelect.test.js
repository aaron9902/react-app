import React from 'react';
import { mount, configure } from 'enzyme';
import ForumSelect from './forumSelect';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { BrowserRouter, BrowserRouter as Router, Link } from "react-router-dom";


configure({ adapter: new Adapter() });
describe('<ForumSelect/ >', () => {


    //StepID: S401
    it('matches snapshot', () => {
        const wrapper = mount(<BrowserRouter><ForumSelect /></BrowserRouter>);
        expect(wrapper).toMatchSnapshot();
    });


});
