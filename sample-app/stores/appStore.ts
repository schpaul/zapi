import { APIRequest, APIResponse, AppData, ParamLine } from "@/lib/definitions";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAppStore = create<AppData>()(
  persist(
    (set) => ({
      login: async (client: string, user: string, password: string) => {
        const token = btoa(user + ":" + password);

        const methodParam: ParamLine = { name: "I_USERNAME", data: user };

        const apiRequest: APIRequest = {
          classname: "ZCL_APP_SAMPLE",
          method: "GET_USER_DATA",
          paramtab: [methodParam],
        };

        const jsonRequest = JSON.stringify(apiRequest);
        try {
          const res = await fetch(
            "/api?client=" +
              client +
              "&request=" +
              jsonRequest +
              "&token=" +
              token
          );

          const data = await res.json();
          const resData: APIResponse = data;

          set({
            userPassBase64str: token,
            client: client,
            firstName: resData.data[0].value.firstname,
            lastName: resData.data[0].value.lastname,
            email: resData.data[0].value.eMail,
          });
        } catch (error) {
          console.log("Error in Login ", error);
          throw error;
        }
      },

      logout: () => {
        set({
          userPassBase64str: undefined,
          client: undefined,
          firstName: undefined,
          lastName: undefined,
          email: undefined,
        });
      },
    }),
    { name: "app-data" }
  )
);
