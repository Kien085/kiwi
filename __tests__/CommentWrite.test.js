import React from "react";
import expect from "expect";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { CommentWrite } from "../src/app/components/CommentWrite";

Enzyme.configure({ adapter: new Adapter() });

describe("Component: CommentWrite", () => {
    it("renders without crashing", () => {
        const wrapper = shallow(<CommentWrite/>);
        expect(wrapper.length).toEqual(1);
    });

    it("renders correctly", () => {
        const wrapper = shallow(<CommentWrite/>);
        expect(wrapper).toMatchSnapshot();
    });

    it("has correct default state for inputValue", () => {
        const wrapper = shallow(<CommentWrite/>);
        expect(wrapper.state().inputValue).toEqual('');
    });

});

