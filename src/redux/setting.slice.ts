import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SettingsState = {
    language: "en" | "ne";
    darkMode: boolean;
    notifications: boolean;
};

const initialState: SettingsState = {
    language: "en",
    darkMode: false,
    notifications: true,
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<"en" | "ne">) => {
            state.language = action.payload;
        },
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
        },
        toggleNotifications: (state) => {
            state.notifications = !state.notifications;
        },
    },
});

export const { setLanguage, toggleDarkMode, toggleNotifications } = settingsSlice.actions;
export default settingsSlice.reducer;
