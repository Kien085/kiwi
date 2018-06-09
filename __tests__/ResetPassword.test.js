import React from "react";
import expect from "expect";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { ResetPassword } from "../src/app/components/ResetPassword";

Enzyme.configure({ adapter: new Adapter() });

describe("Component: ResetPassword", () => {
    it("renders without crashing", () => {
        const wrapper = shallow(<ResetPassword/>);
        expect(wrapper.length).toEqual(1);
    });

    it("renders correctly", () => {
        const wrapper = shallow(<ResetPassword/>);
        expect(wrapper).toMatchSnapshot();
    });

});