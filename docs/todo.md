SI CAMBIASTE LAS INTERFACES: Incrementa la versión de la app y agrega una función de conversión en sessionStorageVersionConverter para convertir las propiedades al cargar los objetos con la interfaz vieja.  
Por ejemplo, si cambiaste "enabled" por "isEnabled", fijate la versión del guardado y la actual y haz la conversion.

#### Actividad (Activity)

-   [ ] Oculta las **entradas** eliminadas **luego** de la animacion de tachado.

#### Input de hora (TimeInput)

-   [ ] No se actualiza si se esta haciendo focus.
-   [ ] Palabras clave como "ahora", "ya" y "now" que establezcan el tiempo a ahora.
-   [ ] Al hacer focus desplegar un pequeño calendario con el mes, botones para ir al mes anterior y un boton de 'hoy' y 'ayer' para establecer el dia. _(ver librería `cally`)_

#### Vista Historial.

-   [x] Dropdown para Ordernar el historial por: fecha de creacion, duracion
-   [ ] Crear un panel de filtros comun, para SortBy y SortOrder, customizable
-   [x] Agrupar sessiones por semana pasada, mes
-   [ ] Se podria implementar una vista calendario, alternativa a la listada
-   [x] Habilitar Settings en modo readonly
-   [x] Boton para descargar el historial en un .json

#### Sidebar

-   [x] Panel con botones de cada seccion.
    -   [ ] Es contraible.
-   [x] Vista jornada.
-   [x] Vista Historial de jornadas.
-   [ ] Resumen Dayli.
-   [ ] Resumen semanal/mensual.
-   [ ] Notas personales.
-   [ ] Configuracion.
    -   [ ] Jornada y descansos.
    -   [ ] Personalizacion visual (estilos).
-   [x] Si el link no esta activo, no resaltarlo.

#### Recomendaciones

-   [ ] Poder configurar formato de TimeInput si 24 (H:MM am/pm) o 12 (HH:MM) horas.
-   [ ] Agregar un diccionario de palabras clave de uso diario, como 'daily', 'spike', 'deploy'. se agregan con tab y tiene correccion si escribiste medio mal

#### Estilos

-   [ ] Implementar un slice de temas y colores, que tenga diferentes temas como dark, light y variantes. Ademas que este se utilize a traves de un hook que contenga un useEffect para re-renderizar el componente si el tema cambia.
-   [ ] Ajustar todos los colores de texto, bg border, etc. A colores primario, secundario, etc.
-   [ ] Ver de poner el ContainerTopbar como sticky, que quede en el top del container.
