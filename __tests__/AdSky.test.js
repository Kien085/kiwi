import React from "react";
import expect from "expect";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import AdSky from "../src/app/components/AdSky";
import { shallow } from "enzyme"; 
import renderer from "react-test-renderer";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";


Enzyme.configure({ adapter: new Adapter() });

describe("Component: AdSky", () => {
    it("renders without crashing", () => {
        const wrapper = shallow(<AdSky />);
        expect(wrapper.length).toEqual(1);
    });

    it("renders correctly", () => {
        const component = renderer.create(
            <MuiThemeProvider>
                <AdSky image="src/public/images/skyAds/advertise.jpg"/>
            </MuiThemeProvider>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
      });

    it("receives a proper string in image", () => {
        const wrapper = Enzyme.mount(<AdSky image="src/public/images/skyAds/advertise.jpg" />);
        expect(
            typeof(wrapper.prop("image")) === "string"
        ).toEqual(true);
    });

    it("receives the correct string in image", () => {
        const wrapper = Enzyme.mount(<AdSky image="src/public/images/skyAds/advertise.jpg" />);
        expect(
            String(wrapper.prop("image")) === "src/public/images/skyAds/advertise.jpg"
        ).toEqual(true);
    });

    it("has correct default state type for image", () => {
        const wrapper = Enzyme.mount(<AdSky/>);
        expect(
            typeof(wrapper.prop("image")) === "undefined"
        ).toEqual(true);
    });

    it("has correct default state for image", () => {
        // console.log(process.env.API_KEY);
        // process.env.API_KEY = "hello";
        // console.log(process.env.API_KEY);
        // console.log(process.env);
        // console.log(global.process.env.API_KEY);
        const wrapper = Enzyme.mount(<AdSky/>);
        expect(
            String(wrapper.prop("image")) === "undefined"
        ).toEqual(true);
    });
});

