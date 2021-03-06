import React, { useEffect, Suspense } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import * as actions from './store/actions';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';

const Checkout = React.lazy(() => {
  return import('./containers/Checkout/Checkout');
});

const Orders = React.lazy(() => {
  return import('./containers/Orders/Orders');
});

const Auth = React.lazy(() => {
  return import('./containers/Auth/Auth');
});

const App = props => {
  const { autoSignup } = props;

  useEffect(() => {
    autoSignup();
  }, [autoSignup]);

  const routes = () => {
    const { isAuth } = props;

    if (isAuth) {
      return (
        <Switch>
          <Route path="/checkout" render={(props) => <Checkout {...props} />} />
          <Route path="/orders" render={(props) => <Orders {...props} />} />
          <Route path="/logout" component={Logout} />
          <Route path="/" exact component={BurgerBuilder} />
          <Route path="/auth" render={(props) => <Auth {...props} />} />
          <Redirect to='/' />
        </Switch>
      );
    } else {
      return (
        <Switch>
          <Route path="/auth" render={(props) => <Auth {...props} />} />
          <Route path="/" exact component={BurgerBuilder} />
          <Redirect to='/' />
        </Switch>
      )
    }
  };

  return (
    <div>
      <Layout>
        <Suspense fallback={<p>Loading...</p>}>{routes()}</Suspense>
      </Layout>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuth: state.auth.token !== null
  }
};

const mapActionsToProps = {
  autoSignup: actions.authCheckState
};



export default connect(mapStateToProps, mapActionsToProps)(App);
