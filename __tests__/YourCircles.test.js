import React from "react";
import expect from "expect";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { YourCircles } from "../src/app/components/YourCircles";

Enzyme.configure({ adapter: new Adapter() });

describe("Component: YourCircles", () => {
    it("renders without crashing", () => {
        const wrapper = shallow(<YourCircles/>);
        expect(wrapper.length).toEqual(1);
    });

    it("renders correctly", () => {
        const wrapper = shallow(<YourCircles/>);
        expect(wrapper).toMatchSnapshot();
    });

});