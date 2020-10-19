import {createStackNavigator } from 'react-navigation-stack'
import {createAppContainer} from 'react-navigation'
import Login from '../components/loginActivity/Login'
import SignUp from '../components/loginActivity/SignUp'
import Signdesign from "../components/Signdesign"
import Login1 from "../components/Login1"


const screen={
    LoginScreen:{
        screen:Login1
    },
     NewSignUp:{
        screen:Signdesign
    },
    Login:{
        screen:Login
    },
    SignUp:{
        screen :SignUp
    }
   
}


const HomeStack=createStackNavigator(screen)

export default createAppContainer(HomeStack);