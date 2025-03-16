// TODO: Implementar Routing

### 1. **Definir constantes de rutas** (`app/routing/routes-config.ts`)

```typescript
export const ROUTES = {
    PUBLIC: { LOGIN: "/login", REGISTER: "/register" },
    PRIVATE: { DASHBOARD: "/dashboard", PROFILE: "/profile" },
    ERROR: { NOT_FOUND: "/404" },
} as const;
```

---

### 2. **Configurar Router principal** (`app/routing/Router.tsx`)

```tsx
const router = createBrowserRouter([
    { path: ROUTES.PUBLIC.LOGIN, element: <LoginPage /> },
    {
        path: ROUTES.PRIVATE.DASHBOARD,
        element: (
            <AuthGuard>
                <DashboardPage />
            </AuthGuard>
        ),
    },
]);

export const AppRouter = () => <RouterProvider router={router} />;
```

---

### 3. **Crear Guards** (`app/routing/AuthGuard.tsx`)

```tsx
// Redirige si NO está autenticado
export const AuthGuard = ({ children }) => {
    const isAuth = useSelector((state) => state.auth.isAuthenticated);
    return isAuth ? children : <Navigate to={ROUTES.PUBLIC.LOGIN} />;
};
```

---

### 4. **Hook de navegación** (`app/routing/navigation-helper.ts`)

```typescript
export const useAppNavigation = () => {
    const navigate = useNavigate();
    return {
        goToLogin: () => navigate(ROUTES.PUBLIC.LOGIN),
        goToDashboard: () => navigate(ROUTES.PRIVATE.DASHBOARD),
    };
};
```

---

### 5. **Integrar en App** (`app/App.tsx`)

```tsx
import { AppRouter } from "./routing/Router";

const App = () => <AppRouter />;
```

---

### 📌 **Reglas clave**

-   **Siempre usar `ROUTES`** (nunca strings literales como `"/login"`).
-   **En páginas/features**: Usar `useAppNavigation()` en lugar de `useNavigate()`.
-   **Proteger rutas privadas** con `<AuthGuard>`.

**Ejemplo de uso en una page**:

```tsx
const LoginPage = () => {
    const { goToDashboard } = useAppNavigation();

    return <Button onClick={goToDashboard}>Ir al Dashboard</Button>;
};
```
