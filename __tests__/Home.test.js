import React from "react";
import expect from "expect";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { Home } from "../src/app/components/Home";

Enzyme.configure({ adapter: new Adapter() });

describe("Component: Home", () => {
    it("renders without crashing", () => {
        const wrapper = shallow(<Home/>);
        expect(wrapper.length).toEqual(1);
    });

    it("renders correctly", () => {
        const wrapper = shallow(<Home/>);
        expect(wrapper).toMatchSnapshot();
    });

});

