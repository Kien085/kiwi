import React from "react";
import expect from "expect";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
// import { PostWrite } from '../src/app/components/PostWrite';
import { Blog } from "../src/app/components/Blog";
import { AdSky } from "../src/app/components/AdSky";
import { ListItem } from "material-ui";
// import store from "../src/app/store/configureStore";

Enzyme.configure({ adapter: new Adapter() });

describe("Component: Blog", () => {
    it("renders without crashing", () => {
        const wrapper = shallow(<Blog setHomeTitle={() => { }} match={{ params: "" }} />);
        expect(wrapper.length).toEqual(1);
    });

    it("renders correctly", () => {
        const component = renderer.create(
            <MuiThemeProvider>
                <Blog setHomeTitle={() => { }} match={{ params: "" }} />
            </MuiThemeProvider>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("has correct default state for disableComments", () => {
        const wrapper = Enzyme.mount(<Blog setHomeTitle={() => { }} match={{ params: "" }} />);
        expect(
            String(wrapper.state("disableComments")) === "undefined"
        ).toEqual(true);
    });

    it("has correct default state for disableSharing", () => {
        const wrapper = Enzyme.mount(<Blog setHomeTitle={() => { }} match={{ params: "" }} />);
        expect(
            String(wrapper.state("disableSharing")) === "undefined"
        ).toEqual(true);
    });

    it("has correct default state for openPostWrite", () => {
        const wrapper = Enzyme.mount(<Blog setHomeTitle={() => { }} match={{ params: "" }} />);
        expect(
            String(wrapper.state("openPostWrite")) === "false"
        ).toEqual(true);
    });

    it("has correct default state for homeTitle", () => {
        const wrapper = Enzyme.mount(<Blog setHomeTitle={() => { }} match={{ params: "" }} />);
        expect(
            String(wrapper.state("homeTitle")) === ""
        ).toEqual(true);
    });

    it("has correct default state for adSky", () => {
        const wrapper = Enzyme.mount(<Blog setHomeTitle={() => { }} match={{ params: "" }} />);
        expect(
            String(wrapper.state("adSky")) === "false"
        ).toEqual(true);
    });

    it("has correct default state for adPost", () => {
        const wrapper = Enzyme.mount(<Blog setHomeTitle={() => { }} match={{ params: "" }} />);
        expect(
            String(wrapper.state("adPost")) === "false"
        ).toEqual(true);
    });

    it("has correct default state for displaySelfAd", () => {
        const wrapper = Enzyme.mount(<Blog setHomeTitle={() => { }} match={{ params: "" }} />);
        expect(
            String(wrapper.state("displaySelfAd")) === "false"
        ).toEqual(true);
    });

    it("has correct look when skyAds are enabled", () => {
        const wrapper = Enzyme.mount(<Blog setHomeTitle={() => { }} match={{ params: "" }} />);
        wrapper.setState({ adSky: true });
        expect(wrapper.find(AdSky).length).toEqual(2);
    });

    // testing has issues with redux store and nested components
    // it("renders correctly with post writing", () => {
    //     const wrapper = Enzyme.mount(<Blog setHomeTitle={() => { }} match={{ params: "" }} displayWriting={true} tag={false} />);
    //     console.log(wrapper.state());
    //     expect(
    //         
    //     ).toEqual(true);
    // });
});

