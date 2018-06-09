import React from "react";
import expect from "expect";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { Profile } from "../src/app/components/Profile";

Enzyme.configure({ adapter: new Adapter() });

describe("Component: Profile", () => {
    it("renders without crashing", () => {
        const wrapper = shallow(<Profile loadPosts={() => {return {}}} loadUserInfo={()=>{return {}}}/>);
        expect(wrapper.length).toEqual(1);
    });

    it("renders correctly", () => {
        const wrapper = shallow(<Profile loadPosts={() => {return {}}} loadUserInfo={()=>{return {}}}/>);
        expect(wrapper).toMatchSnapshot();
    });

});