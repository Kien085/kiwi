import React from "react";
import expect from "expect";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { Circle } from "../src/app/components/Circle";
import ListItem from "material-ui/List/ListItem";

Enzyme.configure({ adapter: new Adapter() });

describe("Component: Circle", () => {
    it("renders without crashing", () => {
        const wrapper = shallow(<Circle circle={{name: "friend"}} openSetting={true}/>);
        expect(wrapper.length).toEqual(1);
    });

    it("renders correctly", () => {
        const wrapper = shallow(<Circle circle={{name: "friend"}} openSetting={true}/>);
        expect(wrapper).toMatchSnapshot();
    });

    it("has correct default state for open", () => {
        const wrapper = shallow(<Circle circle={{name: "friend"}} openSetting={true}/>);
        expect(wrapper.state().open).toEqual(false);
    });

    it("has correct default state for open", () => {
        const wrapper = shallow(<Circle circle={{name: "friend"}} openSetting={true}/>);
        expect(wrapper.state().disabledSave).toEqual(false);
    });

    it("has correct state for circleName", () => {
        const wrapper = shallow(<Circle circle={{name: "friend"}} openSetting={true}/>);
        expect(wrapper.state().circleName).toEqual('friend');
    });

    it("has a ListItem that inherits its state correctly", () => {
        const wrapper = shallow(<Circle circle={{name: "friend"}} openSetting={true}/>);
        expect(wrapper.find('ListItem').first().props().open).toEqual(wrapper.state().open);
    });

    it("has a Dialog that inherits its props correctly", () => {
        const wrapper = shallow(<Circle circle={{name: "friend"}} openSetting={true}/>);
        expect(wrapper.find('Dialog').first().props().open).toEqual(true);
    });

});

