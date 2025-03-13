import { useAppDispatch, useAppSelector } from "@/hooks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toggleDarkMode, toggleNotifications, setLanguage } from "@/redux/setting.slice";
import { Switch } from "@radix-ui/react-switch";
import Layout from "../layout/Layout";

const Settings = () => {
    const dispatch = useAppDispatch();
    const { language, darkMode, notifications } = useAppSelector((state) => state.settings);

    return (
        <Layout title="">
            <div className="max-w-md mx-auto mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Language Selection */}
                    <div className="flex justify-between items-center">
                            <span>{language === "en" ? "Language Change" : "भाषा परिवर्तन"}</span>
                        <Select value={language} onValueChange={(value) => dispatch(setLanguage(value as "en" | "ne"))}>
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
                        <Switch checked={darkMode} onCheckedChange={() => dispatch(toggleDarkMode())} />
                    </div>

                    {/* Notifications Toggle */}
                    <div className="flex justify-between items-center">
                        <span>Notifications</span>
                        <Switch checked={notifications} onCheckedChange={() => dispatch(toggleNotifications())} />
                    </div>
                </CardContent>
            </Card>
        </div>
        </Layout>
    );
};

export default Settings;
