import React from "react";
import expect from "expect";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { Signup } from "../src/app/components/Signup";

Enzyme.configure({ adapter: new Adapter() });

describe("Component: Signup", () => {
    it("renders without crashing", () => {
        const wrapper = shallow(<Signup/>);
        expect(wrapper.length).toEqual(1);
    });

    it("renders correctly", () => {
        const wrapper = shallow(<Signup/>);
        expect(wrapper).toMatchSnapshot();
    });

});