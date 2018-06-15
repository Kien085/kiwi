import React from "react";
import expect from "expect";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import AdPost from "../src/app/components/AdPost";
import { shallow } from "enzyme"; 
import renderer from "react-test-renderer";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";


Enzyme.configure({ adapter: new Adapter() });

describe("Component: AdPost", () => {
    it("renders without crashing", () => {
        const wrapper = shallow(<AdPost />);
        expect(wrapper.length).toEqual(1);
    });    

    it("renders correctly", () => {
      const component = renderer.create(
          <MuiThemeProvider>
              <AdPost image="src/public/images/postAds/yourAdHere.jpg"/>
          </MuiThemeProvider>
      );
      let tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("receives a proper string in image", () => {
        const wrapper = Enzyme.mount(<MuiThemeProvider><AdPost image="src/public/images/postAds/yourAdHere.jpg" /></MuiThemeProvider>);
        expect(
            typeof(wrapper.childAt(0).prop("image")) === "string"
        ).toEqual(true);
    });

    it("receives the correct string in image", () => {
        const wrapper = Enzyme.mount(<MuiThemeProvider><AdPost image="src/public/images/postAds/yourAdHere.jpg" /></MuiThemeProvider>);
        expect(
            String(wrapper.childAt(0).prop("image")) === "src/public/images/postAds/yourAdHere.jpg"
        ).toEqual(true);
    });

    it("has correct default state type for image", () => {
        const wrapper = Enzyme.mount(<MuiThemeProvider><AdPost/></MuiThemeProvider>);
        expect(
            typeof(wrapper.childAt(0).prop("image")) === "undefined"
        ).toEqual(true);
    });

    it("has correct default state for image", () => {
        const wrapper = Enzyme.mount(<MuiThemeProvider><AdPost/></MuiThemeProvider>);
        expect(
            String(wrapper.childAt(0).prop("image")) === "undefined"
        ).toEqual(true);
    });
});

