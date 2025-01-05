import { Provider } from "react-redux";

import store from "../redux/store";
import { ReactNode } from "react";

export default function ReduxStoreProvider({ children }: { children: ReactNode }) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
}