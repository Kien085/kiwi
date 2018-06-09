import React from "react";
import expect from "expect";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { UserAvatar } from "../src/app/components/UserAvatar";

Enzyme.configure({ adapter: new Adapter() });

describe("Component: UserAvatar", () => {
    it("renders without crashing", () => {
        const wrapper = shallow(<UserAvatar/>);
        expect(wrapper.length).toEqual(1);
    });

    it("renders correctly", () => {
        const wrapper = shallow(<UserAvatar/>);
        expect(wrapper).toMatchSnapshot();
    });

});