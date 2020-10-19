import {createStore} from 'redux'
import reducers from './allReducers'

const store=createStore(reducers)

export default store