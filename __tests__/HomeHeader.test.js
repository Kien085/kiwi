import React from "react";
import expect from "expect";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { HomeHeader } from "../src/app/components/HomeHeader";

Enzyme.configure({ adapter: new Adapter() });

describe("Component: HomeHeader", () => {
    it("renders without crashing", () => {
        const wrapper = shallow(<HomeHeader/>);
        expect(wrapper.length).toEqual(1);
    });

    it("renders correctly", () => {
        const wrapper = shallow(<HomeHeader/>);
        expect(wrapper).toMatchSnapshot();
    });

});