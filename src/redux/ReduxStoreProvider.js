import { jsx as _jsx } from "react/jsx-runtime";
import { Provider } from "react-redux";
import store from "src/redux/store";
export default function ReduxStoreProvider({ children }) {
    return (_jsx(Provider, { store: store, children: children }));
}
