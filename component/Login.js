import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import FacebookProvider, { Login as FacebookLogin } from 'react-facebook';

function Login(props) {
    return (
        <div className="col-12">
            <div className="row text-center">
                <div className="col-4 offset-4 form-group">
                    <h1>
                        <FormattedMessage id="content_login_title"/>
                    </h1>
                </div>
            </div>
            <div className="row">
                <div className="col-4 offset-4">
                    <p className="text-center text-muted">
                        <FormattedMessage id="content_login_info"/>
                    </p>
                </div>
            </div>
            <div className="row">
                <div className="col-4 offset-4">
                    <form name="login" onSubmit={props.onSubmit}>
                        <div className="form-group">
                            <label htmlFor="username" className="form-control-label required">
                                <FormattedMessage id="content_username"/>
                            </label>
                            <input id="username" name="_username" className="form-control" value={props.username} onChange={props.onInputChange} required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="username" className="form-control-label required">
                                <FormattedMessage id="content_password"/>
                            </label>
                            <input id="password" name="_password" className="form-control" type="password" value={props.password} onChange={props.onInputChange} required/>
                        </div>
                        <div className="form-group text-left">
                            <button type="submit" className="btn btn-secondary">
                                <FormattedMessage id="app_login"/>
                            </button>
                            <FacebookProvider appId="231965137676519">
                                <FacebookLogin
                                    scope="email"
                                    onResponse={props.onFacebookResponse}
                                    onError={props.onFacebookError}>
                                    <button className="btn btn-success ml-2">
                                        <FormattedMessage id="app_login_facebook"/>
                                    </button>
                                </FacebookLogin>
                            </FacebookProvider>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;