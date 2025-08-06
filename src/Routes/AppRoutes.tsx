
import {
    Switch,
    Route,
} from "react-router-dom";
import AuthForm from '../components/Login-Register/AuthPage';
import Accessory from '../components/subPage/accessory';
import Home from '../components/home';

function Approutes() {
    return (
        <>
            <Switch>
                <Route path="/auth">
                    <AuthForm />
                </Route>
                <Route path="/accessories">
                    <Accessory />
                </Route>

                <Route path="/" exact>
                    <Home />
                </Route>
                <Route path="*">
                    404 not found
                </Route>
            </Switch >
        </>
    );
}

export default Approutes;