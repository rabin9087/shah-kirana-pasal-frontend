import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SettingsState = {
  language: "en" | "ne";
  darkMode: boolean;
  notifications: boolean;
  theme: string; // HSL value for primary color
};

const initialState: SettingsState = {
  language: "en",
  darkMode: false,
  notifications: true,
  theme: "215 90% 47%", // default theme (Blue)
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

      if (state.darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    toggleNotifications: (state) => {
      state.notifications = !state.notifications;
    },
    setToggleTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;

      // Update light mode primary
      document.documentElement.style.setProperty("--primary", action.payload);

      // Optional: update dark mode primary if dark mode is active
      if (state.darkMode) {
        // Example: make dark mode primary slightly darker
        const darkPrimary = action.payload; // you can tweak HSL for dark variant
        document.documentElement.style.setProperty("--primary", darkPrimary);
      }
    },
  },
});

export const { setLanguage, toggleDarkMode, toggleNotifications, setToggleTheme } =
  settingsSlice.actions;
export default settingsSlice.reducer;
