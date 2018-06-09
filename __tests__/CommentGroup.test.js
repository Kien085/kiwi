import React from "react";
import expect from "expect";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { CommentGroup } from "../src/app/components/CommentGroup";

Enzyme.configure({ adapter: new Adapter() });

describe("Component: CommentGroup", () => {
    it("renders without crashing", () => {
        const wrapper = shallow(<CommentGroup/>);
        expect(wrapper.length).toEqual(1);
    });

    it("renders correctly", () => {
        const wrapper = shallow(<CommentGroup/>);
        expect(wrapper).toMatchSnapshot();
    });

    it("has correct default state for commentText", () => {
        const wrapper = shallow(<CommentGroup/>);
        expect(wrapper.state().commentText).toEqual('');
    });

    it("has correct default state for postDisable", () => {
        const wrapper = shallow(<CommentGroup/>);
        expect(wrapper.state().postDisable).toEqual(true);
    });

    it("has a FlatButton which inherits props correctly", () => {
        const wrapper = shallow(<CommentGroup/>);
        expect(wrapper.find('FlatButton').at(1).props().disabled).toEqual(true);
    });

});

