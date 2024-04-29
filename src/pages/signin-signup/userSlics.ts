import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    user: {}
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setAUser: (state, {payload}) => {
            state.user = payload
        }
    }
})

const {actions, reducer} = userSlice
export const {setAUser} = actions

export default reducer