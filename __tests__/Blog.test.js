import React from "react";
import expect from "expect";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallow } from "enzyme"; 
import renderer from "react-test-renderer";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Blog } from "../src/app/components/Blog";
import { ListItem } from "material-ui";

Enzyme.configure({ adapter: new Adapter() });

describe("Component: Blog", () => {
    it("renders without crashing", () => {
        const wrapper = shallow(<Blog setHomeTitle={()=>{}} match={{params : ""}}/>);
        expect(wrapper.length).toEqual(1);
    });

    it("renders correctly", () => {
        const component = renderer.create(
            <MuiThemeProvider>
                <Blog setHomeTitle={()=>{}} match={{params: ""}}/>
            </MuiThemeProvider>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("has correct default state for openPostWrite", () => {
        const wrapper = Enzyme.mount(<Blog setHomeTitle={()=>{}} match={{params: ""}}/>);
        expect(
            String(wrapper.state("openPostWrite")) === "false"
         ).toEqual(true);
    });

    it("has correct state after handleOpenPostWrite", () => {
        const wrapper = Enzyme.mount(<Blog setHomeTitle={()=>{}} match={{params: ""}}/>);
        // console.log(wrapper.props());
        // wrapper.props().handleOpenPostWrite();
        // wrapper.find('ListItem').simulate('click');
        wrapper.simulate('handleOpenPostWrite');
        expect(
            String(wrapper.state("openPostWrite")) === "true"
         ).toEqual(true);
    });
});

    // it("has correct state after handleOpenPostWrite", () => {
    //     const wrapper = Enzyme.mount(<Blog setHomeTitle={()=>{}} match={{params: ""}}/>);
    //     // console.log(wrapper.props());
    //     // wrapper.props().handleOpenPostWrite();
    //     wrapper.find(ListItem).simulate(TouchTap);
    //     expect(
    //         String(wrapper.state("openPostWrite")) === "true"
    //      ).toEqual(true);
    // });

    // it("receives a proper string in image", () => {
    //     const wrapper = Enzyme.mount(<MuiThemeProvider><Blog/></MuiThemeProvider>);
    //     expect(
    //         typeof(wrapper.childAt(0).prop("image")) === "string"
    //     ).toEqual(true);
    // });

    // it("receives the correct string in image", () => {
    //     const wrapper = Enzyme.mount(<MuiThemeProvider><Blog/></MuiThemeProvider>);
    //     expect(
    //         String(wrapper.childAt(0).prop("image")) === "src/public/images/skyAds/advertise.jpg"
    //     ).toEqual(true);
    // });

    // it("has correct default state type for image", () => {
    //     const wrapper = Enzyme.mount(<MuiThemeProvider><Blog/></MuiThemeProvider>);
    //     expect(
    //         typeof(wrapper.childAt(0).prop("image")) === "undefined"
    //     ).toEqual(true);
    // });

    // it("has correct default state for image", () => {
    //     const wrapper = Enzyme.mount(<MuiThemeProvider><Blog/></MuiThemeProvider>);
    //     expect(
    //         String(wrapper.childAt(0).prop("image")) === "undefined"
    //     ).toEqual(true);
    // });
// });

