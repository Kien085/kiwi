import React from "react";
import expect from "expect";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { PostWrite } from "../src/app/components/PostWrite";

Enzyme.configure({ adapter: new Adapter() });

describe("Component: PostWrite", () => {
    it("renders without crashing", () => {
        const wrapper = shallow(<PostWrite open={true}/>);
        expect(wrapper.length).toEqual(1);
    });

    it("renders correctly", () => {
        const wrapper = shallow(<PostWrite open={true}/>);
        expect(wrapper).toMatchSnapshot();
    });

});