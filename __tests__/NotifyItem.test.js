import React from "react";
import expect from "expect";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { NotifyItem } from "../src/app/components/NotifyItem";

Enzyme.configure({ adapter: new Adapter() });

describe("Component: NotifyItem", () => {
    it("renders without crashing", () => {
        const wrapper = shallow(<NotifyItem url={"mockURL"}/>);
        expect(wrapper.length).toEqual(1);
    });

    it("renders correctly", () => {
        const wrapper = shallow(<NotifyItem url={"mockURL"}/>);
        expect(wrapper).toMatchSnapshot();
    });

});

