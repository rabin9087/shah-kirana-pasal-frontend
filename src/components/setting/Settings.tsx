import { useAppDispatch, useAppSelector } from "@/hooks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toggleDarkMode, toggleNotifications, setLanguage, setToggleTheme } from "@/redux/setting.slice";
import { Switch } from "@/components/ui/switch";
import Layout from "../layout/Layout";
import { useEffect } from "react";
import { themeColors } from "@/theme";

const Settings = () => {
    const dispatch = useAppDispatch();
    const { language, darkMode, notifications, theme } = useAppSelector((state) => state.settings);

    
    useEffect(() => {
        const selectedTheme = themeColors.find((t) => t.value === theme);
        if (selectedTheme) {
            // Set primary color for light mode
            document.documentElement.style.setProperty("--primary", selectedTheme.value);

            // Optional: dark mode adjustment if needed
            if (darkMode) {
                // Example: slightly adjust lightness for dark mode
                document.documentElement.style.setProperty("--primary", selectedTheme.value);
            }
        }
    }, [darkMode, theme]);

    return (
        <Layout title="Settings">
            <div className="max-w-md mx-auto mt-8 my-4">
                <Card>
                    <CardHeader className="my-2">
                        <CardTitle>Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Language Selection */}
                        <div className="flex justify-between items-center">
                            <span>{language === "en" ? "Language Change" : "भाषा परिवर्तन"}</span>
                            <Select
                                value={language}
                                onValueChange={(value) => dispatch(setLanguage(value as "en" | "ne"))}
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Select Language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="ne">नेपाली</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Dark Mode Toggle */}
                        <div className="flex justify-between items-center">
                            <span>Dark Mode</span>
                            <Switch
                                checked={darkMode}
                                onCheckedChange={() => dispatch(toggleDarkMode())}
                            />
                        </div>

                        {/* Notifications Toggle */}
                        <div className="flex justify-between items-center">
                            <span>Notifications</span>
                            <Switch
                                checked={notifications}
                                onCheckedChange={() => dispatch(toggleNotifications())}
                            />
                        </div>

                        {/* Theme Color Selection */}
                        <div className="flex flex-col gap-2">
                            <span>{language === "en" ? "Theme Change" : "विषयवस्तु परिवर्तन"}</span>
                            <div className="flex flex-wrap gap-3">
                                {themeColors.map((color) => {
                                    const isActive = theme === color.value;
                                    return (
                                        <button
                                            key={color.value}
                                            className={`w-10 h-10 rounded-full shadow hover:scale-110 transition-transform border-4 ${isActive ? "border-black" : "border-gray-300"
                                                }`}
                                            style={{ backgroundColor: `hsl(${color.value})` }}
                                            onClick={() => dispatch(setToggleTheme(color.value))}
                                            title={color.name}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default Settings;
