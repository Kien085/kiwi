import React from "react";
import expect from "expect";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { Comment } from "../src/app/components/Comment";

Enzyme.configure({ adapter: new Adapter() });

describe("Component: Comment", () => {
    it("renders without crashing", () => {
        const wrapper = shallow(<Comment comment={{text: 'example text'}} isCommentOwner={true}/>);
        expect(wrapper.length).toEqual(1);
    });

    it("renders correctly", () => {
        const wrapper = shallow(<Comment comment={{text: 'example text'}} isCommentOwner={true}/>);
        expect(wrapper).toMatchSnapshot();
    });

    it("has correct state for text", () => {
        const wrapper = shallow(<Comment comment={{text: 'example text'}} isCommentOwner={true}/>);
        expect(wrapper.state().text).toEqual('example text');
    });

    it("has correct state for initialText", () => {
        const wrapper = shallow(<Comment comment={{text: 'example text'}} isCommentOwner={true}/>);
        expect(wrapper.state().initialText).toEqual('example text');
    });

    it("has correct default state for editDisabled", () => {
        const wrapper = shallow(<Comment comment={{text: 'example text'}} isCommentOwner={true}/>);
        expect(wrapper.state().editDisabled).toEqual(true);
    });

    it("has correct default state for isPostOwner", () => {
        const wrapper = shallow(<Comment comment={{text: 'example text'}} isCommentOwner={true}/>);
        expect(wrapper.state().isPostOwner).toEqual('');
    });

});

