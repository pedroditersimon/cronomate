// Importamos TypedUseSelectorHook, que es un tipo especializado para useSelector,
import { TypedUseSelectorHook, useSelector } from "react-redux";

// Importamos el tipo RootState del store. 
// Este tipo define la estructura global del estado en nuestra aplicación Redux.
import { RootState } from "src/app/states/redux/store";

// Creamos un hook personalizado llamado useTypedSelector que envuelve useSelector.
// Le indicamos que use RootState como el tipo del estado global.
// Esto garantiza que cada vez que usemos useTypedSelector, 
// TypeScript sabrá la estructura exacta del estado.
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
