import React from "react";
import expect from "expect";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { Notify } from "../src/app/components/Notify";

Enzyme.configure({ adapter: new Adapter() });

describe("Component: Notify", () => {
    it("renders without crashing", () => {
        const wrapper = shallow(<Notify/>);
        expect(wrapper.length).toEqual(1);
    });

    it("renders correctly", () => {
        const wrapper = shallow(<Notify/>);
        expect(wrapper).toMatchSnapshot();
    });

});