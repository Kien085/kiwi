import React from "react";
import expect from "expect";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { EditProfile } from "../src/app/components/EditProfile";

Enzyme.configure({ adapter: new Adapter() });

describe("Component: EditProfile", () => {
    it("renders without crashing", () => {
        const wrapper = shallow(<EditProfile info={{}} open={true}/>);
        expect(wrapper.length).toEqual(1);
    });

    it("renders correctly", () => {
        const wrapper = shallow(<EditProfile info={{}} open={true}/>);
        expect(wrapper).toMatchSnapshot();
    });

    it("has correct default state for isSmall", () => {
        const wrapper = shallow(<EditProfile info={{}} open={true}/>);
        expect(wrapper.state().isSmall).toEqual(false);
    });

    it("has correct default state for tagLineInput", () => {
        const wrapper = shallow(<EditProfile info={{}} open={true}/>);
        expect(wrapper.state().tagLineInput).toEqual('');
    });

    it("has correct default state for fullNameInput", () => {
        const wrapper = shallow(<EditProfile info={{}} open={true}/>);
        expect(wrapper.state().fullNameInput).toEqual('');
    });

    it("has correct default state for fullNameInputError", () => {
        const wrapper = shallow(<EditProfile info={{}} open={true}/>);
        expect(wrapper.state().fullNameInputError).toEqual('');
    });

    it("has correct default state for banner", () => {
        const wrapper = shallow(<EditProfile info={{}} open={true}/>);
        expect(wrapper.state().banner).toEqual("https://firebasestorage.googleapis.com/v0/b/open-social-33d92.appspot.com/o/images%2F751145a1-9488-46fd-a97e-04018665a6d3.JPG?alt=media&token=1a1d5e21-5101-450e-9054-ea4a20e06c57");
    });

    it("has correct default state for avatar", () => {
        const wrapper = shallow(<EditProfile info={{}} open={true}/>);
        expect(wrapper.state().avatar).toEqual('');
    });

    it("has correct default state for openBanner", () => {
        const wrapper = shallow(<EditProfile info={{}} open={true}/>);
        expect(wrapper.state().openBanner).toEqual(false);
    });

    it("has correct default state for openAvatar", () => {
        const wrapper = shallow(<EditProfile info={{}} open={true}/>);
        expect(wrapper.state().openAvatar).toEqual(false);
    });

});

