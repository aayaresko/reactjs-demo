import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import LoginForm from '../../components/User/Login';
import {
    setToken,
    sendRequest,
    removeResponseError,
    requestWasSuccessful,
    createResponseError,
    setContentIsLoading
} from '../../actions';
import { setData } from '../../actions/user';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.handleFacebookError = this.handleFacebookError.bind(this);
        this.handleFacebookResponse = this.handleFacebookResponse.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = {
            username: '',
            password: '',
            userId: '',
            email: '',
            accessToken: ''
        };
    }

    componentDidMount() {
        this.props.dispatch(removeResponseError());
    }

    handleFacebookResponse(data) {
        let profile = data.profile;
        let tokenDetail = data.tokenDetail;

        this.setState({
            userId: profile.id,
            email: profile.email,
            accessToken: tokenDetail.accessToken
        });

        this.handleFacebookLogin();
    }

    handleFacebookError(error) {
        this.props.dispatch(createResponseError(error));
    }

    handleInputChange(event) {
        let target = event.target;
        let value = target.value;
        let name = target.id;

        this.setState({
            [name]: value
        });
    }

    handleLogin(url, data) {
        this.props.dispatch(setContentIsLoading(true));

        sendRequest(this.props, url, 'POST', data)
            .then(container => {
                // we need to prevent eternal loop...
                if (container.error === 401) {
                    container.error = <FormattedMessage id="app_validation_401"/>;
                }

                this.props.dispatch(container);
                this.props.dispatch(setContentIsLoading(false));

                if (requestWasSuccessful(container)) {
                    let content = container.content;

                    if (content.token) {
                        this.props.dispatch(setToken(content.token));
                        this.props.dispatch(setData(content.data));
                    }

                    this.props.history.push('/');
                }
            });

        return false;
    }

    handleFacebookLogin() {
        let formData = {
            facebook_login_form: {
                user_id: this.state.userId,
                email: this.state.email,
                access_token: this.state.accessToken
            }
        };

        return this.handleLogin('security/facebook/login', formData);
    }

    handleSubmit(event) {
        event.preventDefault();

        let formData = {
            '_username': this.state.username,
            '_password': this.state.password
        };

        return this.handleLogin('security/login/check', formData);
    }

    render() {
        return (
            <div className="row">
                <LoginForm
                    onFacebookResponse={this.handleFacebookResponse}
                    onFacebookError={this.handleFacebookError}
                    onInputChange={this.handleInputChange}
                    onSubmit={this.handleSubmit}
                    username={this.state.username}
                    password={this.state.password}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        app: state.app,
    }
}

export default connect(mapStateToProps)(Login);

