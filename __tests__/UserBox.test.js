import React from "react";
import expect from "expect";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { UserBox } from "../src/app/components/UserBox";

Enzyme.configure({ adapter: new Adapter() });

describe("Component: UserBox", () => {
    it("renders without crashing", () => {
        const wrapper = shallow(<UserBox user={{fullName: "John Doe"}}/>);
        expect(wrapper.length).toEqual(1);
    });

    it("renders correctly", () => {
        const wrapper = shallow(<UserBox user={{fullName: "John Doe"}}/>);
        expect(wrapper).toMatchSnapshot();
    });

});