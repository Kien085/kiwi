import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { blue500 } from 'material-ui/styles/colors';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import SvgHome from 'material-ui/svg-icons/action/home';
import SvgPeople from 'material-ui/svg-icons/social/people';
import EventListener, { withOptions } from 'react-event-listener';

// - Import components
import UserAvatar from './UserAvatar';
import Notify from './Notify';

// - Import actions
import * as globalActions from '../actions/globalActions';
import * as authorizeActions from '../actions/authorizeActions';

export class HomeHeader extends Component {

    /**
     * Component constructor
     * @param  {object} props is an object properties of component
     */
    constructor(props) {
        super(props);

        this.state = {
            // User avatar popover is open if true
            openAvatarMenu: false,

            // Show header title or not (true/false)
            showTitle: true,
            
            // If true notification menu will be open
            openNotifyMenu: false
        };
    }

    /**
     * Handle close notification menu 
     * 
     * @memberof HomeHeader
     */
    handleCloseNotify = () => {
        this.setState({ openNotifyMenu: false });
    }


    // On click toggle sidebar
    onToggleSidebar = () => {
        if (this.props.sidebarStatus) {
            this.props.sidebar(false);
        } 
        
        else {
            this.props.sidebar(true);
        }
    }

    /**
     * Handle notification touch 
     * 
     * @memberof HomeHeader
     */
    handleNotifyTouchTap = (event) => {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            openNotifyMenu: true,
            anchorEl: event.currentTarget
        });
    }

    /**
     * Handle touch on user avatar for popover
     * 
     * @memberof HomeHeader
     */
    handleAvatarTouchTap = (event) => {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            openAvatarMenu: true,
            anchorEl: event.currentTarget
        });
    }

    /**
     * Handle logout user
     * 
     * @memberof HomeHeader
     */
    handleLogout = () => {
        this.props.logout();
    }

    /**
     * Handle close popover
     * 
     * @memberof HomeHeader
     */
    handleRequestClose = () => {
        this.setState({ openAvatarMenu: false });
    };


    /**
     * Handle resize event for window to manipulate home header status
     * @param  {event} evt is the event is passed by winodw resize event
     */
    handleResize = (evt) => {
        const width = window.innerWidth;

        if (width >= 600 && !this.state.showTitle) {
            this.setState({ showTitle: true });
        }

        else if (width < 600 && this.state.showTitle) {
            this.setState({ showTitle: false });
        }
    }

    componentDidMount = () => {
        this.handleResize();
    }

    render() {
        const styles = {
            toolbarStyle: {     
                background: 'linear-gradient(90deg, #5B86E5, #36D1DC)',
                transition: "all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms",
                boxSizing: "border-box",
                fontFamily: "Roboto, sans-serif",
                position: "fixed",
                zIndex: "1101",
                width: "100%",
                top: "0px",
                boxShadow: '0 1px 8px rgba(0,0,0,.3)',
                overflowX: 'scroll'
            },
            avatarStyle: {
                margin: 5,
                cursor: 'pointer'
            },
            flatButtonStyle: {
                // Changes the minimum width of this component based on the state of title visibility
                minWidth: this.state.showTitle ? "80px" : "30px"
            }
        };

        return (
            <Toolbar style={styles.toolbarStyle}>
                <EventListener
                    target="window"
                    onResize={this.handleResize}
                    onKeyUp={this.handleKeyUp}
                />

                {/* Left side */}
                <ToolbarGroup firstChild={true}>
                <div style={{ marginLeft: '30px', marginRight: '30px' }}>
                        <FlatButton onClick={this.props.homePage} style={styles.flatButtonStyle}>
                            <svg  style={{position: "absolute", top: "2px", left: "0px"}} width="31" height="30" xmlns="http://www.w3.org/2000/svg"><path d="M13.279.046c0 .038-.054.046-.302.046-.206 0-.32.014-.362.043-.037.026-.175.048-.35.056-.229.01-.293.024-.317.065-.022.04-.073.052-.228.052-.156 0-.199.01-.199.047 0 .035-.04.046-.185.046-.137 0-.191.012-.204.046-.012.032-.063.046-.165.046-.1 0-.171.02-.225.062a.346.346 0 0 1-.22.062c-.105 0-.141.011-.141.046 0 .034-.036.046-.137.046-.083 0-.147.017-.162.042-.014.022-.08.05-.146.06-.067.01-.134.04-.148.067-.015.026-.068.047-.119.047-.053 0-.099.02-.11.046-.01.03-.058.046-.133.046-.066 0-.133.02-.155.047a.157.157 0 0 1-.107.046.294.294 0 0 0-.148.061.287.287 0 0 1-.139.062.147.147 0 0 0-.1.046.14.14 0 0 1-.093.047.17.17 0 0 0-.102.046.325.325 0 0 1-.141.066c-.052.01-.095.038-.095.06 0 .028-.034.043-.093.043-.055 0-.1.02-.111.047-.01.026-.057.046-.108.046-.05 0-.098.02-.107.044-.01.025-.058.053-.107.064-.05.011-.09.04-.09.064s-.026.044-.059.044c-.032 0-.066.02-.076.046-.01.025-.053.046-.095.046-.046 0-.078.018-.078.043 0 .024-.047.051-.108.063-.065.012-.108.038-.108.065 0 .025-.028.045-.062.045s-.062.02-.062.046c0 .03-.03.046-.092.046s-.092.016-.092.047c0 .025-.021.046-.047.046-.025 0-.074.028-.108.061-.034.034-.082.062-.108.062a.046.046 0 0 0-.046.046c0 .03-.029.047-.077.047a.147.147 0 0 0-.115.061c-.021.034-.056.062-.077.062-.022 0-.039.02-.039.046a.047.047 0 0 1-.047.046.076.076 0 0 0-.065.047c-.01.025-.044.046-.076.046s-.107.048-.169.108a.498.498 0 0 1-.139.108c-.015 0-.028.02-.028.046 0 .025-.02.048-.046.05-.087.007-.097.012-.151.065-.03.03-.067.054-.083.054-.015 0-.028.021-.028.047 0 .025-.021.046-.047.046a.046.046 0 0 0-.046.046c0 .026-.015.046-.034.046-.047 0-.18.13-.181.178 0 .02-.015.038-.033.038-.04 0-.222.126-.254.177a.092.092 0 0 1-.07.039.046.046 0 0 0-.044.046c0 .026-.021.046-.047.046a.046.046 0 0 0-.046.047c0 .025-.015.046-.034.046-.047 0-.18.13-.181.177 0 .021-.017.039-.036.039-.042 0-.273.236-.273.278 0 .017-.02.03-.046.03s-.046.018-.046.04c0 .023-.048.081-.106.13-.059.049-.1.099-.093.11.008.013-.02.05-.063.084s-.077.075-.077.092-.021.039-.047.048a.076.076 0 0 0-.046.065c0 .026-.02.047-.046.047a.046.046 0 0 0-.046.047c0 .025-.014.046-.03.046-.036 0-.186.147-.186.183 0 .014-.021.034-.046.044-.026.01-.047.051-.047.092 0 .049-.021.08-.061.09-.034.01-.062.039-.062.066 0 .027-.02.049-.046.049a.047.047 0 0 0-.046.047c0 .026-.021.055-.047.065-.026.01-.046.056-.046.107 0 .05-.015.09-.034.09-.04 0-.18.126-.181.163 0 .014-.022.046-.047.072a.174.174 0 0 0-.046.106c0 .032-.019.059-.041.059-.023 0-.075.069-.116.153-.04.084-.092.153-.113.154-.022 0-.038.04-.038.093 0 .06-.022.102-.062.124-.034.018-.062.047-.062.065 0 .018-.02.053-.046.078a.174.174 0 0 0-.046.106c0 .033-.021.06-.046.06-.028 0-.047.028-.047.07a.197.197 0 0 1-.054.122c-.133.128-.162.172-.162.25 0 .052-.016.081-.046.081s-.046.031-.046.094c0 .052-.02.1-.043.11-.024.01-.053.052-.064.095a.312.312 0 0 1-.064.123.188.188 0 0 0-.045.117c0 .04-.02.08-.046.09-.027.01-.046.056-.046.11 0 .052-.013.094-.028.094-.015 0-.049.054-.076.12a.42.42 0 0 1-.08.141c-.018.01-.032.068-.032.126 0 .074-.014.106-.046.106-.034 0-.047.036-.047.138 0 .106-.014.145-.061.17a.128.128 0 0 0-.062.111c0 .043-.02.1-.046.125-.025.025-.046.099-.046.164 0 .076-.017.124-.047.135-.031.013-.046.062-.046.16 0 .077-.012.134-.027.124-.044-.027-.084.05-.093.183a.353.353 0 0 1-.052.172c-.025.028-.044.114-.044.205 0 .11-.013.161-.046.174-.034.013-.046.066-.046.202 0 .134-.013.191-.048.211-.03.017-.055.092-.067.21-.01.1-.037.2-.06.223-.027.028-.041.127-.042.308 0 .187-.015.286-.046.328-.033.043-.045.144-.045.362 0 .237-.01.302-.043.302-.072 0-.077.121-.071 1.798.005 1.512.01 1.632.06 1.668.045.033.054.09.054.335 0 .221.011.306.046.341.035.035.046.12.046.342 0 .235.01.3.046.314.031.012.047.06.047.146 0 .172.029.266.08.266.031 0 .043.045.043.167 0 .185.023.273.065.247.015-.01.027.066.027.168 0 .123.016.2.047.23a.226.226 0 0 1 .046.139c0 .123.028.19.08.19.031 0 .043.043.043.154 0 .116.012.154.046.154.032 0 .047.032.047.102 0 .056.02.129.045.162a.284.284 0 0 1 .046.143c0 .052.025.097.063.117.047.025.061.065.061.17 0 .102.013.138.047.138.03 0 .046.03.046.087 0 .047.02.113.045.146a.238.238 0 0 1 .046.114c.001.03.03.082.063.116a.23.23 0 0 1 .062.14c0 .042.02.085.046.095.025.01.046.05.046.088 0 .038.02.086.044.107a.27.27 0 0 1 .065.127c.01.05.04.09.063.09.03 0 .044.035.044.108 0 .075.014.108.046.108.031 0 .046.03.046.093 0 .055.02.101.047.111.025.01.046.034.046.054 0 .02.028.052.062.074.034.02.061.066.061.1 0 .035.021.07.047.08.025.01.046.048.046.085 0 .037.024.09.054.12.13.125.162.17.162.233 0 .039.019.067.046.067.028 0 .046.029.046.075 0 .041.018.093.04.115.022.023.05.065.061.095.011.03.042.054.068.054.03 0 .047.029.047.078 0 .043.02.086.046.096.025.01.046.03.046.044 0 .036.15.183.187.183.016 0 .03.027.03.06 0 .032.02.08.045.105.026.025.047.058.047.071 0 .037.141.165.181.165.019 0 .034.04.034.089 0 .05.02.097.047.107.025.01.046.039.046.065 0 .026.02.047.046.047.025 0 .046.022.046.049 0 .027.028.056.062.065.034.01.062.035.062.059 0 .023.02.043.046.043.025 0 .046.02.046.046 0 .025.018.046.039.046s.053.031.07.07c.018.038.05.065.072.06.022-.004.032.004.023.019-.02.031.114.222.182.26.025.014.046.046.046.07 0 .025.02.045.046.045.025 0 .046.021.046.046 0 .026.02.047.046.047s.047.02.047.046c0 .025.02.046.046.046.025 0 .046.022.046.05 0 .026.028.056.062.064.034.01.061.036.061.06 0 .023.014.042.03.042.038 0 .186.148.186.186 0 .016.02.03.043.03.024 0 .051.02.06.046.01.025.04.046.066.046.026 0 .047.02.047.043 0 .04.105.093.164.083.014-.002.016.011.005.03-.012.019.007.04.044.05.035.01.064.036.064.06 0 .023.014.042.03.042.038 0 .186.149.186.187 0 .016.021.03.046.03.026 0 .047.02.047.045 0 .026.027.047.061.047s.062.02.062.043c0 .025.04.053.09.064.05.01.097.04.107.064.01.025.038.044.064.044.026 0 .047.021.047.047 0 .025.022.046.047.046.026 0 .055.02.065.044.009.024.057.058.106.075.05.018.09.046.09.064 0 .018.021.033.047.033.025 0 .046.017.046.039 0 .038.061.079.223.147.047.02.085.055.085.079s.022.043.047.043c.026 0 .056.02.065.046.01.027.056.046.107.046.057 0 .09.017.09.044 0 .024.04.053.09.064.049.01.097.04.106.064.01.024.037.044.061.044s.052.021.062.047c.01.025.05.046.088.046.04 0 .088.027.11.061.02.034.066.062.1.062.035 0 .07.02.08.046.01.026.045.047.078.047s.053.012.043.027c-.02.032.052.065.14.065.032 0 .059.02.059.045 0 .027.043.053.106.065.058.01.113.039.122.063.009.023.057.043.107.043.051 0 .097.02.108.046.01.025.053.046.096.046.044 0 .087.021.097.047.01.025.034.046.053.046.02 0 .088.027.151.061a.524.524 0 0 0 .164.062c.026 0 .07.02.095.046a.21.21 0 0 0 .13.047c.045 0 .106.027.135.061.035.04.091.062.162.062.069 0 .116.017.127.046.011.028.058.046.12.046.06 0 .108.018.118.047.011.029.059.046.127.046s.132.023.17.061a.245.245 0 0 0 .167.062c.064 0 .111.018.122.046.012.032.062.047.158.047.097 0 .147.014.159.046.013.034.066.046.2.046.14 0 .195.014.243.062.044.045.102.061.212.061.106 0 .156.014.169.047.013.034.066.046.2.046s.187.012.2.046c.014.037.08.046.316.046.246 0 .305.01.337.053.03.042.102.055.358.065.229.01.326.025.344.055.039.068 2.796.064 2.796-.004 0-.026.02-.078.043-.116a.669.669 0 0 0 .064-.207 1.86 1.86 0 0 1 .077-.293c.03-.084.065-.23.078-.323.012-.094.041-.217.065-.274a.727.727 0 0 0 .043-.231c0-.07.027-.224.061-.343.034-.119.062-.3.062-.402 0-.102.021-.268.047-.368.026-.1.06-.418.075-.707.016-.29.045-.763.066-1.052.029-.409.029-.641 0-1.048-.02-.288-.05-.782-.065-1.098a5.856 5.856 0 0 0-.076-.754 1.845 1.845 0 0 1-.048-.38c0-.112-.028-.305-.061-.431a1.852 1.852 0 0 1-.061-.374c0-.08-.02-.193-.045-.251a1.256 1.256 0 0 1-.064-.274 3.383 3.383 0 0 0-.077-.383 9.13 9.13 0 0 1-.183-.774.962.962 0 0 0-.063-.228.928.928 0 0 1-.061-.227 1.72 1.72 0 0 0-.058-.25 3.943 3.943 0 0 1-.155-.524.727.727 0 0 0-.059-.185 4.415 4.415 0 0 1-.205-.57 7.46 7.46 0 0 0-.124-.355 4.926 4.926 0 0 1-.107-.308 1.064 1.064 0 0 0-.075-.185.425.425 0 0 1-.05-.158.153.153 0 0 0-.046-.104c-.026-.022-.046-.06-.046-.086a.658.658 0 0 0-.058-.173c-.032-.07-.096-.217-.142-.327-.113-.267-.245-.57-.37-.848-.14-.308-.583-1.19-.606-1.205-.035-.021-.301.075-.371.134-.029.024-.061.102-.073.172-.011.07-.069.267-.127.437-.059.17-.121.364-.14.431a.561.561 0 0 1-.075.172.195.195 0 0 0-.042.108c0 .033-.028.101-.062.152a.365.365 0 0 0-.061.143.13.13 0 0 1-.044.086.235.235 0 0 0-.06.106c-.034.132-.25.49-.312.514l-.162.061c-.1.038-.217.23-.268.442-.034.147-.178.266-.32.266-.225 0-.451.307-.488.663a3.033 3.033 0 0 1-.25.76c-.046.077-.068.086-.25.094l-.2.01-.068.215c-.038.119-.09.299-.115.4-.14.573-.231.664-.56.56-.206-.065-.231-.053-.32.144-.04.088-.086.18-.101.206a1.18 1.18 0 0 0-.06.123c-.131.321-.356.66-.5.754-.175.114-.345-.096-.439-.54a1.78 1.78 0 0 0-.064-.25 2.2 2.2 0 0 1-.045-.335 5.426 5.426 0 0 0-.078-.545c-.076-.358-.08-2.496-.005-2.667.028-.064.065-.195.083-.29.032-.173.227-.614.351-.796.089-.13.614-.647 1.054-1.037.903-.802 1.188-1.126.826-.938a4.414 4.414 0 0 1-.287.126c-.11.045-.26.108-.332.14a.738.738 0 0 1-.17.059.55.55 0 0 0-.154.062.551.551 0 0 1-.153.061c-.036 0-.276.087-.47.17-.267.114-.756.139-.851.043l-.065-.064.075-.082c.197-.214.204-.313.022-.313-.142 0-.225.046-.386.216-.154.162-.213.207-.615.467-.36.233-.617.265-.83.102a.386.386 0 0 0-.14-.076c-.046 0-.577.27-.653.332-.177.145-.305-.133-.163-.354.13-.2.072-.52-.075-.415a.755.755 0 0 1-.127.068 4.243 4.243 0 0 0-.339.158c-.025.014-.08.042-.123.06-.042.02-.133.059-.2.089l-.324.138c-.11.045-.24.102-.289.127-.135.068-.605.092-.682.034-.059-.045-.06-.05-.007-.196a.905.905 0 0 0 .053-.218c0-.038.047-.204.105-.37l.143-.409c.02-.06.062-.163.093-.231.03-.068.064-.144.074-.17.01-.025.073-.143.14-.262l.18-.323c.083-.149.221-.31.517-.607a2.37 2.37 0 0 1 .629-.47c.322-.178 1.07-.49 1.27-.53.08-.016.184-.05.231-.074a.517.517 0 0 1 .2-.046.646.646 0 0 0 .2-.035 2.27 2.27 0 0 1 .349-.074 4.59 4.59 0 0 0 .385-.072 1.08 1.08 0 0 1 .224-.034c.055 0 .1-.014.1-.031s-.032-.031-.07-.031a.271.271 0 0 1-.132-.043.78.78 0 0 0-.193-.079c-.454-.122-.047-.427.576-.432.333-.002.436-.139.226-.299-.126-.096-.189-.108-1.077-.214-.212-.025-.256-.195-.052-.197.035 0 .095-.034.134-.075l.07-.075-.118-.06a1.136 1.136 0 0 0-.341-.077 1.092 1.092 0 0 1-.288-.053 1.16 1.16 0 0 0-.302-.052c-.32-.024-.776-.14-.814-.208-.03-.052-.022-.136.022-.24.027-.064-.51-.078-.878-.023-.875.131-1.224-.189-.374-.343.378-.07.23-.146-.35-.183-1.26-.08-1.769-.214-1.57-.412a.28.28 0 0 1 .115-.064 2.24 2.24 0 0 1 .592-.078c.135-.002.316-.016.4-.032.085-.016.32-.044.524-.063.204-.018.448-.052.542-.076.094-.024.26-.044.37-.044.109 0 .31-.028.445-.061.135-.034.337-.062.447-.062.11 0 .263-.02.34-.043.078-.024.265-.053.417-.064.151-.012.386-.041.522-.065.895-.161 2.86-.169 3.406-.014.11.031.258.066.329.077.07.012.154.04.185.064a.266.266 0 0 0 .134.044c.043 0 .13.029.193.063a.53.53 0 0 0 .16.061c.025 0 .098.026.162.058l.286.142c.378.187.74.447 1.038.746.157.158.23.211.25.185.052-.07.192-.382.192-.43a.15.15 0 0 1 .04-.09.347.347 0 0 0 .065-.133.413.413 0 0 1 .052-.127c.016-.02.093-.159.17-.309.118-.227.508-.852.566-.905a8.135 8.135 0 0 1 .77-.967c.36-.38.828-.825.99-.942.092-.068.188-.143.214-.167.096-.091.741-.564.91-.668a2.72 2.72 0 0 0 .212-.138c.095-.084.452-.322.635-.423.076-.043.187-.106.246-.141.236-.14.96-.5 1.004-.5a.575.575 0 0 0 .168-.061.559.559 0 0 1 .187-.062.5.5 0 0 0 .163-.044c.053-.025.194-.058.313-.075.118-.016.27-.045.339-.063.151-.04.838-.04 1.048-.001.085.016.24.041.344.056.327.048.329.065.034.337-.332.307-.46.443-.439.464.011.01.348.02.75.02.4 0 .754.013.784.027.065.031.06.14-.009.173l-.185.085-.28.127a.823.823 0 0 1-.186.066.23.23 0 0 0-.102.047.25.25 0 0 1-.128.045.155.155 0 0 0-.105.046c-.022.025-.052.046-.068.046-.053 0-.528.212-1.073.478-.3.147-.352.177-.524.308-.093.072-.2.146-.237.165-.038.02-.135.093-.216.162l-.228.192c-.497.415-.689.616-.711.744-.013.07.07.09.537.124.464.034.436.095-.298.65-.411.31-.433.325-.496.356a3.116 3.116 0 0 0-.185.106c-.068.04-.16.09-.205.108-.151.06-.127.183.036.183.077 0 .182.14.162.216-.009.034-.115.148-.236.252a8.29 8.29 0 0 0-.25.224 8.78 8.78 0 0 1-.293.252c-.144.12-.317.273-.385.34l-.122.119.113.01a.73.73 0 0 0 .23-.027c.169-.052 1.445-.074 1.751-.03.136.02.427.053.648.076.22.022.44.056.487.075a.777.777 0 0 0 .232.034c.08 0 .225.028.321.062.097.034.214.062.26.062.08 0 .443.107.688.202.06.023.166.057.238.075.07.018.138.046.148.063.01.016.049.03.086.03.038 0 .12.027.183.061.064.034.14.062.171.062s.083.02.116.045c.033.025.08.046.106.047.076.001.756.355 1.002.521a.825.825 0 0 0 .166.096c.014 0 .05.028.08.062.031.034.069.061.085.061.043 0 .305.185.412.29.052.053.213.203.357.334.144.13.302.297.352.37.049.072.107.15.128.172.02.023.038.053.038.067 0 .014.049.1.108.19.06.09.108.182.108.204a.3.3 0 0 0 .05.116c.17.26.04.662-.215.661-.206 0-.87-.269-1.222-.494a.948.948 0 0 0-.123-.06 2.404 2.404 0 0 1-.216-.111 34.886 34.886 0 0 0-1.073-.55c-.188-.09-.467-.06-.508.052-.053.142.327.578.502.578.015 0 .065.035.11.077.046.043.11.077.14.077.06 0 .078.046.03.075-.014.01-.094-.004-.176-.029a1.168 1.168 0 0 0-.274-.046.54.54 0 0 1-.205-.043.874.874 0 0 0-.216-.065.667.667 0 0 1-.202-.064.31.31 0 0 0-.14-.044.278.278 0 0 1-.131-.04c-.197-.134-1.431-.407-1.48-.328-.008.012.164.202.382.42.218.219.406.428.418.465.053.167-.144.253-.346.15a.855.855 0 0 0-.193-.062c-.06-.01-.227-.07-.37-.13a3.883 3.883 0 0 0-.353-.134 2.919 2.919 0 0 1-.431-.173 1.18 1.18 0 0 0-.185-.063.537.537 0 0 1-.154-.063.251.251 0 0 0-.117-.042.528.528 0 0 1-.17-.058c-.432-.22-.848-.278-.72-.1.048.068.159.275.159.297 0 .05-.151.066-.278.03a2.493 2.493 0 0 0-.38-.057 2.45 2.45 0 0 1-.402-.066c-.203-.059-1.076-.08-1.13-.026-.026.026.04.095.266.275.4.318 1.672 1.59 1.94 1.94.117.153.253.32.302.37.194.202.71 1.026.927 1.48.172.36.204.438.204.499 0 .031.02.087.045.122a.593.593 0 0 1 .066.2.684.684 0 0 0 .06.196c.02.034.046.143.057.242.01.1.035.21.054.246.1.185.086 1.35-.02 1.763-.202.78-.506.86-.58.15a1.305 1.305 0 0 0-.066-.297.765.765 0 0 1-.048-.245.558.558 0 0 0-.042-.212.863.863 0 0 1-.064-.2c-.02-.108-.088-.267-.219-.51-.171-.315-.426-.407-.453-.163-.022.193-.057.22-.174.133-.053-.039-.096-.081-.096-.095 0-.013-.06-.118-.134-.233a4.646 4.646 0 0 1-.155-.255 2.808 2.808 0 0 0-.097-.17 2.239 2.239 0 0 1-.107-.195 2.412 2.412 0 0 0-.134-.232c-.22-.344-.267-.42-.267-.436 0-.047-.168-.262-.206-.262-.023 0-.1.029-.169.064-.215.11-.302.028-.506-.48-.224-.56-.48-.938-.76-1.125a11.841 11.841 0 0 1-.893-.705c-.13-.116-.165-.063-.075.114l.112.236c.039.085.082.175.096.2.051.095.267.544.318.663.079.184.127.293.2.45a.755.755 0 0 1 .064.19c0 .025.021.064.047.085.025.021.046.07.046.107 0 .038.025.103.057.143.03.04.064.101.074.135.01.034.068.18.13.324.063.144.127.306.143.361.016.055.043.107.06.117.016.01.029.05.029.087 0 .037.028.12.062.183s.061.14.061.17.02.082.043.115c.023.034.052.11.064.17.013.058.042.138.066.175.024.038.043.09.043.115 0 .026.033.12.073.21.081.18.164.413.206.58.015.06.048.15.074.2.026.05.048.126.048.17 0 .043.02.106.045.139a.302.302 0 0 1 .046.152c0 .051.03.145.063.208a.532.532 0 0 1 .062.201c0 .047.02.114.043.148a.574.574 0 0 1 .066.184c.012.067.037.15.054.184.034.065.157.513.21.77.018.083.052.19.076.237a.526.526 0 0 1 .044.201c0 .064.02.156.046.204a.882.882 0 0 1 .063.247c.01.087.037.208.06.267.022.06.055.191.072.293.04.231.086.44.179.83.04.167.073.347.074.4 0 .053.028.214.06.358a2.5 2.5 0 0 1 .062.433c0 .093.02.246.043.339.023.092.051.334.062.538.012.203.036.425.056.493.023.082.039.672.047 1.765.013 1.805.008 1.765.193 1.58.048-.048.103-.062.243-.062.134 0 .187-.012.2-.046.012-.032.062-.046.158-.046.097 0 .146-.015.159-.047.01-.028.057-.046.122-.046a.245.245 0 0 0 .166-.062.246.246 0 0 1 .17-.061c.07 0 .116-.017.127-.046.011-.029.058-.047.12-.047.061 0 .108-.018.118-.046.012-.029.059-.046.127-.046.071 0 .128-.022.162-.062a.204.204 0 0 1 .137-.061.21.21 0 0 0 .13-.047.162.162 0 0 1 .094-.046c.027 0 .1-.028.164-.062a.562.562 0 0 1 .15-.061c.02 0 .044-.021.054-.046.01-.026.053-.047.096-.047.044 0 .087-.02.097-.046.01-.026.056-.046.108-.046.05 0 .098-.02.107-.043.009-.024.064-.053.122-.063.063-.012.106-.038.106-.065 0-.025.027-.045.059-.045.087 0 .159-.033.14-.065-.01-.015.01-.027.042-.027.034 0 .069-.021.078-.047.01-.025.046-.046.08-.046.035 0 .08-.028.101-.062a.144.144 0 0 1 .11-.061c.038 0 .078-.021.088-.046.01-.026.037-.047.061-.047.025 0 .052-.02.061-.044.01-.024.058-.053.107-.064.05-.011.09-.04.09-.064 0-.027.033-.044.09-.044.05 0 .096-.02.106-.046a.076.076 0 0 1 .065-.046c.026 0 .047-.02.047-.043 0-.024.039-.06.085-.08.163-.067.224-.108.224-.146 0-.022.02-.04.046-.04.025 0 .046-.014.046-.032 0-.018.04-.046.09-.064.05-.017.098-.05.107-.075a.074.074 0 0 1 .064-.044c.026 0 .047-.02.047-.046s.022-.047.048-.047c.026 0 .055-.02.064-.044.01-.024.057-.053.107-.064.05-.01.09-.04.09-.064s.027-.043.061-.043c.035 0 .062-.02.062-.047 0-.025.02-.046.046-.046s.047-.013.047-.03c0-.037.148-.186.186-.186.016 0 .03-.019.03-.042 0-.024.028-.05.064-.06.037-.01.056-.031.044-.05-.011-.019-.01-.032.005-.03.059.01.164-.044.164-.083 0-.024.021-.043.047-.043s.055-.02.065-.046c.01-.026.037-.046.06-.046.024 0 .044-.014.044-.03 0-.038.148-.186.186-.186.016 0 .03-.02.03-.043 0-.023.027-.05.061-.059.034-.008.062-.038.062-.065 0-.027.02-.049.046-.049.025 0 .046-.02.046-.046s.02-.046.046-.046.047-.021.047-.047c0-.025.02-.046.046-.046.025 0 .046-.02.046-.045 0-.024.02-.056.046-.07.067-.038.201-.229.182-.26-.01-.015.001-.023.023-.019.022.005.054-.022.071-.06.018-.039.05-.07.07-.07.022 0 .04-.02.04-.046s.02-.046.046-.046c.025 0 .046-.02.046-.043 0-.024.028-.05.062-.059.034-.009.061-.038.061-.065 0-.027.021-.05.047-.05a.047.047 0 0 0 .046-.046c0-.026.02-.056.046-.065.026-.01.046-.056.046-.107 0-.05.016-.09.035-.09.04 0 .18-.127.18-.164 0-.013.022-.046.047-.071a.174.174 0 0 0 .047-.106c0-.032.013-.06.03-.06.035 0 .185-.146.185-.182 0-.015.021-.034.047-.044.025-.01.046-.053.046-.096 0-.05.017-.078.047-.078.026 0 .056-.024.068-.054a.324.324 0 0 1 .06-.095.189.189 0 0 0 .04-.115c0-.046.018-.075.047-.075.03 0 .046-.03.046-.092 0-.06.016-.093.044-.093.025 0 .053-.026.063-.059.01-.032.04-.066.064-.076.025-.01.045-.05.045-.092 0-.041.02-.083.046-.092.026-.01.046-.046.046-.08 0-.035.028-.08.062-.101.034-.022.062-.055.062-.074 0-.02.02-.044.046-.054.027-.01.046-.056.046-.11 0-.063.016-.094.046-.094.033 0 .047-.033.047-.108 0-.073.014-.108.043-.108.025 0 .053-.04.064-.09a.27.27 0 0 1 .064-.127.156.156 0 0 0 .044-.107c0-.039.021-.078.047-.088.025-.01.046-.053.046-.096a.23.23 0 0 1 .062-.14c.034-.033.062-.085.062-.115s.022-.08.047-.114a.284.284 0 0 0 .045-.146c0-.057.016-.087.046-.087.034 0 .046-.036.046-.137 0-.106.014-.146.062-.171.038-.02.062-.065.063-.117 0-.046.02-.11.046-.143a.316.316 0 0 0 .045-.162c0-.07.015-.102.046-.102.035 0 .046-.038.046-.154 0-.111.012-.154.043-.154.053 0 .08-.067.08-.19 0-.05.022-.113.047-.138.03-.031.046-.108.046-.231 0-.102.013-.177.028-.168.042.026.065-.062.065-.247 0-.122.011-.167.042-.167.052 0 .08-.094.08-.266 0-.085.017-.134.047-.146.037-.014.047-.079.047-.314 0-.222.011-.307.046-.342.034-.035.046-.12.046-.341 0-.245.01-.302.054-.335.05-.036.054-.156.06-1.668.006-1.677.001-1.798-.071-1.798-.034 0-.043-.065-.043-.302 0-.218-.013-.319-.045-.362-.032-.042-.046-.141-.046-.328-.001-.18-.015-.28-.043-.308-.022-.023-.05-.124-.06-.224-.012-.117-.035-.192-.066-.209-.035-.02-.048-.077-.048-.211 0-.136-.012-.19-.046-.202-.033-.013-.047-.064-.047-.174 0-.091-.018-.177-.043-.205a.353.353 0 0 1-.052-.172c-.01-.132-.049-.21-.093-.183-.015.01-.028-.047-.028-.124 0-.098-.014-.147-.046-.16-.03-.011-.046-.059-.046-.135 0-.065-.02-.139-.046-.164a.201.201 0 0 1-.046-.125.128.128 0 0 0-.062-.11c-.048-.026-.062-.065-.062-.171 0-.102-.012-.138-.046-.138-.032 0-.046-.032-.046-.106 0-.058-.015-.115-.032-.126a.42.42 0 0 1-.08-.14c-.027-.067-.061-.121-.077-.121-.015 0-.027-.042-.027-.094 0-.054-.02-.1-.046-.11-.026-.01-.047-.05-.047-.09 0-.04-.02-.092-.044-.117a.312.312 0 0 1-.065-.123c-.01-.043-.039-.086-.063-.095-.024-.01-.043-.058-.043-.11 0-.063-.016-.094-.047-.094-.03 0-.046-.03-.046-.085a.218.218 0 0 0-.054-.138c-.13-.125-.162-.171-.162-.234 0-.039-.019-.067-.046-.067-.025 0-.046-.026-.046-.06 0-.032-.02-.08-.046-.105-.026-.025-.047-.06-.047-.078 0-.018-.027-.047-.061-.065-.04-.022-.062-.065-.062-.124 0-.052-.016-.092-.038-.092-.038-.001-.167-.24-.154-.285.004-.013-.02-.023-.054-.023-.04 0-.062-.02-.062-.06 0-.032-.02-.08-.046-.105-.026-.026-.047-.058-.047-.072 0-.037-.141-.164-.181-.164-.019 0-.034-.04-.034-.089 0-.05-.02-.097-.047-.107a.076.076 0 0 1-.046-.065c0-.026-.019-.047-.042-.047-.024 0-.05-.028-.06-.062-.008-.034-.037-.061-.065-.061-.032 0-.049-.027-.049-.078 0-.043-.02-.086-.046-.096-.025-.01-.046-.03-.046-.044 0-.036-.15-.183-.186-.183-.017 0-.03-.02-.03-.046a.046.046 0 0 0-.046-.047.047.047 0 0 1-.046-.047.076.076 0 0 0-.047-.065c-.025-.01-.046-.031-.046-.048s-.035-.058-.077-.092c-.043-.033-.071-.07-.064-.083.008-.012-.034-.062-.092-.11-.058-.05-.106-.108-.106-.13 0-.023-.02-.041-.046-.041s-.046-.013-.046-.03c0-.042-.231-.278-.273-.278-.02 0-.036-.018-.036-.039 0-.047-.134-.177-.181-.177-.019 0-.034-.02-.034-.046a.046.046 0 0 0-.047-.047.046.046 0 0 1-.046-.046.046.046 0 0 0-.045-.046.092.092 0 0 1-.069-.039c-.033-.05-.214-.177-.255-.177-.017 0-.032-.017-.032-.038 0-.047-.134-.178-.181-.178-.02 0-.034-.02-.034-.046a.046.046 0 0 0-.047-.046.046.046 0 0 1-.046-.046c0-.026-.013-.047-.029-.047-.015 0-.052-.024-.082-.054-.054-.053-.064-.058-.151-.065a.051.051 0 0 1-.046-.05c0-.026-.013-.046-.028-.046a.498.498 0 0 1-.14-.108c-.06-.06-.137-.108-.169-.108-.031 0-.065-.021-.075-.046a.076.076 0 0 0-.065-.047.047.047 0 0 1-.047-.046c0-.025-.018-.046-.04-.046-.02 0-.055-.028-.076-.062a.147.147 0 0 0-.116-.061c-.047 0-.077-.018-.077-.047a.046.046 0 0 0-.046-.046c-.025 0-.074-.028-.108-.062-.034-.033-.082-.061-.108-.061a.046.046 0 0 1-.046-.046c0-.031-.03-.047-.092-.047s-.093-.015-.093-.046c0-.026-.027-.046-.061-.046s-.062-.02-.062-.045c0-.027-.043-.053-.108-.065-.062-.012-.108-.039-.108-.063 0-.025-.032-.043-.078-.043-.043 0-.086-.02-.096-.046-.01-.026-.044-.046-.076-.046s-.058-.02-.058-.044c0-.024-.04-.053-.09-.064-.05-.01-.098-.04-.107-.064-.01-.024-.057-.044-.107-.044-.052 0-.098-.02-.108-.046-.01-.027-.057-.047-.111-.047-.059 0-.094-.015-.094-.042 0-.023-.042-.05-.094-.061a.325.325 0 0 1-.14-.066.17.17 0 0 0-.103-.046.14.14 0 0 1-.094-.047.147.147 0 0 0-.1-.046.287.287 0 0 1-.138-.062.294.294 0 0 0-.148-.061.157.157 0 0 1-.107-.046c-.022-.027-.09-.047-.155-.047-.075 0-.123-.016-.134-.046-.011-.029-.058-.046-.127-.046-.072 0-.108-.015-.108-.043 0-.044-.09-.08-.205-.08-.037 0-.074-.021-.084-.047-.012-.031-.062-.046-.157-.046-.104 0-.14-.012-.14-.046 0-.035-.036-.046-.142-.046a.346.346 0 0 1-.22-.062c-.053-.042-.125-.062-.225-.062-.102 0-.152-.014-.164-.046-.013-.034-.067-.046-.204-.046-.145 0-.186-.01-.186-.046 0-.037-.042-.047-.199-.047-.154 0-.205-.011-.228-.052-.023-.041-.088-.055-.317-.065-.175-.008-.312-.03-.35-.056-.04-.03-.156-.043-.361-.043-.248 0-.302-.008-.302-.046 0-.04-.212-.046-1.726-.046s-1.726.006-1.726.046" fill="#FFF"/></svg>
                            {this.state.showTitle && <div style={{display: "inline-block", color: '#fff', fontWeight: "500", fontSize: "28px", marginLeft: "25px"}}>asis</div>}
                        </FlatButton>
                    </div>
                    <div>
                    <FlatButton onClick={this.props.homePage} style={styles.flatButtonStyle}>
                            <svg style={{position: "absolute", top: "7px", left: "0px"}} width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M4.102 0h11.796c1.426 0 1.943.149 2.465.427.521.28.93.689 1.21 1.21.278.522.427 1.039.427 2.465v11.796c0 1.426-.149 1.943-.427 2.465-.28.521-.689.93-1.21 1.21-.522.278-1.039.427-2.465.427H4.102c-1.426 0-1.943-.149-2.465-.427a2.908 2.908 0 0 1-1.21-1.21C.15 17.841 0 17.324 0 15.898V4.102C0 2.676.149 2.16.427 1.637c.28-.521.689-.93 1.21-1.21C2.159.15 2.676 0 4.102 0zm-.518 2.813c-.428 0-.584.044-.74.128a.872.872 0 0 0-.363.363c-.084.156-.128.311-.128.74v1.913c0 .428.044.583.128.74.084.156.207.279.363.362.156.084.312.128.74.128H5.24c.428 0 .583-.044.74-.128a.872.872 0 0 0 .362-.363c.084-.156.129-.311.129-.74V4.044c0-.428-.045-.583-.129-.74a.872.872 0 0 0-.363-.362c-.156-.084-.311-.128-.74-.128H3.585zm4.767 2.5c-.142 0-.194.014-.246.042a.29.29 0 0 0-.121.121c-.028.052-.043.104-.043.247v.43c0 .142.015.194.043.246a.29.29 0 0 0 .12.12c.053.029.105.043.247.043h4.474c.143 0 .194-.014.247-.042a.29.29 0 0 0 .12-.121c.028-.052.043-.104.043-.247v-.43c0-.142-.015-.194-.042-.246a.29.29 0 0 0-.121-.12c-.053-.029-.104-.043-.247-.043H8.351zm0-2.188c-.142 0-.194.015-.246.043a.29.29 0 0 0-.121.12c-.028.053-.043.105-.043.247v.43c0 .142.015.194.043.246a.29.29 0 0 0 .12.121c.053.028.105.043.247.043h8.592c.142 0 .194-.015.246-.043a.29.29 0 0 0 .121-.12c.028-.053.043-.105.043-.247v-.43c0-.142-.015-.194-.043-.246a.29.29 0 0 0-.12-.121c-.053-.028-.105-.043-.247-.043H8.35zM3.584 9.063c-.428 0-.584.044-.74.128a.872.872 0 0 0-.363.363c-.084.156-.128.311-.128.74v6.288c0 .428.044.583.128.74.084.156.207.279.363.362.156.084.312.128.74.128h12.832c.428 0 .584-.044.74-.128a.872.872 0 0 0 .363-.363c.084-.156.128-.311.128-.74v-6.288c0-.428-.044-.583-.128-.74a.872.872 0 0 0-.363-.362c-.156-.084-.312-.129-.74-.129H3.584z" fill="#fff"/></svg>
                            {this.state.showTitle && <div style={{display: "inline-block", color: '#fff', fontWeight: "500", fontSize: "14px", paddingLeft: "12px"}}>Feed</div>}
                        </FlatButton>
                    </div>
                    <div>
                        <FlatButton style={styles.flatButtonStyle}>
                            <NavLink to={`/${this.props.uid}`}>
                                <svg style={{position: "absolute", top: "7px", left: "0px"}} width="17" height="17" xmlns="http://www.w3.org/2000/svg"><path d="M8.404 8.87a4.435 4.435 0 1 1 0-8.87 4.435 4.435 0 0 1 0 8.87zm8.422 8.064H.182c-1.203-3.61 3.787-6.451 8.222-6.451s9.614 2.862 8.422 6.45z" fill="#fff"/></svg>
                                {this.state.showTitle && <div style={{display: "inline-block", color: '#fff', fontWeight: "500", fontSize: "14px", paddingLeft: "12px"}}> Profile</div>}
                            </NavLink>
                        </FlatButton>
                    </div>
                    <div>
                        <FlatButton onClick={this.props.people} style={styles.flatButtonStyle}>
                            <SvgPeople  style={{color: "#fff", position: "absolute", top: "4px", left: "0px"}}/>
                            {this.state.showTitle && <div style={{display: "inline-block", color: '#fff', fontWeight: "500", fontSize: "14px", paddingLeft: "24px"}}>People</div>}
                        </FlatButton>
                    </div>
                </ToolbarGroup>
                <ToolbarGroup lastChild={true}>
                    <div className="homeHeader__right">
                        <IconButton tooltip="Notifications" onTouchTap={this.handleNotifyTouchTap}>
                            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M8 20c1.1 0 2-.9 2-2H6a2 2 0 0 0 2 2zm6-6V9c0-3.07-1.64-5.64-4.5-6.32V2C9.5 1.17 8.83.5 8 .5S6.5 1.17 6.5 2v.68C3.63 3.36 2 5.92 2 9v5l-2 2v1h16v-1l-2-2z" fill="rgba(255, 255, 255, 0.87)"/>
                                {this.props.notifyCount > 0 && 
                                    <circle cx="14" cy="6" r="6" fill="red"></circle>
                                }
                            </svg>
                        </IconButton>

                        <Notify open={this.state.openNotifyMenu} anchorEl={this.state.anchorEl} onRequestClose={this.handleCloseNotify} />

                        {/* User avatar*/}
                        <UserAvatar
                            onTouchTap={this.handleAvatarTouchTap}
                            fullName={this.props.fullName}
                            fileName={this.props.avatar}
                            size={32}
                            style={styles.avatarStyle}
                        />
                        <Popover
                            open={this.state.openAvatarMenu}
                            anchorEl={this.state.anchorEl}
                            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                            onRequestClose={this.handleRequestClose}
                        >
                            <Menu>
                                {/* <NavLink to='/settings'><MenuItem primaryText="Settings" style={{ color: "rgb(117, 117, 117)" }} /></NavLink> */}
                                <MenuItem primaryText="Log Out" style={{ color: 'red' }} onClick={this.handleLogout.bind(this)} />
                            </Menu>
                        </Popover>
                    </div>
                </ToolbarGroup>
            </Toolbar>
        )
    }
}

// - Map dispatch to props
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        logout: () => {
            dispatch(authorizeActions.dbLogout());
        },
        homePage: () => {
            dispatch(push("/"));
        },
        people: () => {
            dispatch(push("/people"));
        }
    }
}

// - Map state to props
const mapStateToProps = (state, ownProps) => {

    let notifyCount = state.notify.userNotifies
        ? Object
            .keys(state.notify.userNotifies)
            .filter((key) => !state.notify.userNotifies[key].isSeen).length
        : 0
    return {
        avatar: state.user.info && state.user.info[state.authorize.uid] ? state.user.info[state.authorize.uid].avatar : '',
        fullName: state.user.info && state.user.info[state.authorize.uid] ? state.user.info[state.authorize.uid].fullName : '',
        title: state.global.headerTitle,
        notifyCount
    }
}

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader)
