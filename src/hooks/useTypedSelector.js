// Importamos TypedUseSelectorHook, que es un tipo especializado para useSelector,
import { useSelector } from "react-redux";
// Creamos un hook personalizado llamado useTypedSelector que envuelve useSelector.
// Le indicamos que use RootState como el tipo del estado global.
// Esto garantiza que cada vez que usemos useTypedSelector, 
// TypeScript sabrá la estructura exacta del estado.
export const useTypedSelector = useSelector;
