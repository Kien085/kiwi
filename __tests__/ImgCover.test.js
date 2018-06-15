import React from "react";
import expect from "expect";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { ImgCover } from "../src/app/components/ImgCover";

Enzyme.configure({ adapter: new Adapter() });

describe("Component: ImgCover", () => {
    it("renders without crashing", () => {
        const wrapper = shallow(<ImgCover/>);
        expect(wrapper.length).toEqual(1);
    });

    it("renders correctly", () => {
        const wrapper = shallow(<ImgCover/>);
        expect(wrapper).toMatchSnapshot();
    });

});

