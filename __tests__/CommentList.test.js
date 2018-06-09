import React from "react";
import expect from "expect";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { CommentList } from "../src/app/components/CommentList";

Enzyme.configure({ adapter: new Adapter() });

describe("Component: CommentList", () => {
    it("renders without crashing", () => {
        const wrapper = shallow(<CommentList/>);
        expect(wrapper.length).toEqual(1);
    });

    it("renders correctly", () => {
        const wrapper = shallow(<CommentList/>);
        expect(wrapper).toMatchSnapshot();
    });

});

