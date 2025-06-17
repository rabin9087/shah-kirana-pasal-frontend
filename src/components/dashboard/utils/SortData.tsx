// utils/sort.ts
import { IUser } from "@/types/index";

export type SortKey = "name" | "createdAt";

export const sortUsers = (users: IUser[], key: SortKey): IUser[] => {
    return [...users].sort((a, b) => {
        if (key === "name") {
            return `${a.fName} ${a.lName}`.localeCompare(`${b.fName} ${b.lName}`);
        } else if (key === "createdAt") {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
    });
};
