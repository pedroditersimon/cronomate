SI CAMBIASTE LAS INTERFACES: Incrementa la versión de la app y agrega una función de conversión en sessionStorageVersionConverter para convertir las propiedades al cargar los objetos con la interfaz vieja.  
Por ejemplo, si cambiaste "enabled" por "isEnabled", detecta la versión del guardado y la actual y haz la conversion.

ver la organzacion por github proejcts, quiza pueda tener un kanban o algo parecido en el repo

Formato 9am/pm para los TimeInput. Se configura en los ajustes de la app (no jornada)
El formato se puede pasar como prop opcionalmente, sinó lo toma de la config.
Así podría seguir funcionando el TimeInputMinutes

Unificar los update de los running activities con un unico tick en el worksession.
hacer dos funciones, una para actualizar el timer (ya esta) y otra para update de los running.
despues se puede, o llamar a las dos por separado o hacer una "and" que contenga las dos

El startTime y end de configuracion, no cambia si se la borra muchas veces.

Si el endTime de la joranda esta configurado para hacer stop automaticamente.
No pasará si no estas en la app, ya que los ticks no se actualizan.

Renombrar worksession por simplemente session

las actividades no registradas no debe tener en cuenta tiempo futuro.
Por ejemplo si ponemos fin de jornada para mas adelante y todavia es temprano.

si poner un endoverride alas 13, pero tu actividad termino mas adelante como a las 13.10.
ese 10min, no se muestra en el timer de arriba

Para el activiyCreator, hacer un componente desde cero, ya que tiene cosas que no van como el boton de borrado.

las rows de la tabla de actividaes se pueden arrastrar y organizar

columna de nombre de proyecto.

Hacer una vista de recuento del mes, con graficos y recuento de horas.
como para comparar en la hoja del laburo

Al establecer que se termine la joranada al llegar a la hora de fin,
si le das a play nuevamente (porque queres seguir trabajando), te lo corta todo el tiempo

Si pones un fin de joranda, se calcula "no categirzada" de toda la jornada futurua.
Esta bien para saber cuanto tiempo te queda, pero no esta bien represntado como "no categorizada"

Por defecto, manetner las actividades colapsadas (cerradas) para no mostrar tanta info.
Si la actividad esta colapsada, no mostrar el horizontal separator

Agregar sonidos a los toasts de sonner, un sonido para success, otr para error etc.

## Generales

-   [x] Al cerrar la app, todos los timers se hacen stop y se guarda en local storage.
-   [x] Unificar los ticks de useTimer para solo tener un timeout cada 1s y que todos usen ese.
-   [ ] Hacer el tipico layout de activity y record que los envuelve, para reutilizarlo en otro lados.
-   [x] Implementar imports absolutos.
-   [-] El toaster se ve por debajo del modal dialog
-   [x] Mover las funciones fuera del componente workSession, moverlo a el servicio.
-   [x] Guardar los session en un SavedObjectType.
-   [x] Eliminar propiedad 'maxDurationMinutes' del timer de jornada, se calcula con el 'endTimeOverride'.
-   [ ] Que se pueda transferir los datos entre aplicaciones en diferentes dominios
-   [x] Hacer una carpeta para mocks dentro de las features.
-   [x] Icono de signo de pregunta en los formFields que salga un tooltip mostrando el hint.

#### Vista jornada

-   [ ] Timer de jornada (todayTimer).
    -   [x] Boton de `play` y `stop`.
    -   [x] Al dar stop al Timer de jornada, todas las actividad corriendo se hacen stop.
    -   [x] Al darle play a otra actividad el timer jornada, tambien se da a play.
    -   [x] Al darle a play al timer jornada, registrar una pausa desde el endTime a now.
    -   [x] Barra de progreso con tiempo transcurrido.
    -   [ ] Hacerlo clickeable y te desbliegue un rango de inicio a fin.
    -   [x] Actualizar el endtime cada segundo si esta corriedno, o almenos al correr una actividad
    -   [x] Mostrar el tiempo transcurrido total en el timer.
-   [x] Placeholder de actividad para crear nuevas.
    -   [x] Al hacer focus, desplegar un record vacio configurable
    -   [x] Si no tiene endTime, la actividad se crea corriendo.
    -   [x] Si el record tiene valores ingresados, no vuelve a contraerse.
-   [ ] Actividad "Sin registrar"
    -   [ ] Se puede asignar a otra Actividad con un menu.
    -   [ ] Se puede asignar a otra Actividad con arrastre.
-   [ ] Las actividades se ordenan por startTime
-   [ ] Animacion al ordenar actividades
-   [ ] El activity de pausas debe estar siempre a lo ultimo
-   [x] Panel ajustes de jornada.
    -   [x] Se abre en una ruedita de configuración del container del `todayActivity`.
    -   [x] Listar activities eliminadas.
    -   [x] Opción de restaurar activities eliminadas.
    -   [x] Toggle para auto-stop, unicamente para este today.
    -   [x] TimeInput para inicio y fin de jornada.
    -   [x] Guardar los ajustes en localStorage, y cargar siempre esos.
    -   [x] Aplicar configuracion en el workSession.
-   [ ] Oculta las **activities** eliminadas **luego** de la animacion de tachado.
-   [-] Hacer un div con overflow scroll para las actividades, sin incluir el activityCreator.
-   [x] Implementar una notificación visual (texto con ícono y animación en el contenedor) que indique cuándo se realiza un guardado explícito (no automáticos).
-   [x] Stop-timer automático al finalizar la jornada laboral, si se establece. el auto-stop puede modificarse en la config del "Today".
-   [ ] Cinco minutos antes del auto-stop, mostrar una advertencia en pantalla con un sonido de alerta, dando la opción de cancelar el auto-stop.
-   [ ] El inicio de la primer tarea que creas de un session sera el inicio de la joranda, Solo al principio.
-   [x] Opciones de today settings en orden de frecuencia de uso
-   [x] Persistir el override de inicio y fin. Persiste la que pongas sino, se borra en cada nueva jornada.
    -   [x] Agregar una config en slice.
    -   [x] Agregar una checkbox para activar esta feature.
-   [x] Al crear una nueva actividad, se haga stop de todas y se de play solo a esa.
-   [x] Agilizar crear actividades, al tipear en el teclado, te lo escribe en el placeholder
-   [x] En duracion de los settings de joranda, poner el mismo formato de (14h 22m) las activities
-   [x] Bug: Al crear primera actividad, aparece una pausa ???.
-   [ ] Enves de mostrar todas las actividades archivadas de una, que el boton de expandir enreliadad sea mostrar. y cada actividad maneje su propio isExpanded

#### Vista tabla

-   [x] Agregar opcion para visualizar la vista en los WorkSessionSettings
-   [x] Abrir un modal.
-   [x] Boton para copiar al portapales.
-   [x] Se puede seleccionar a mano y hacer ctrl+c y funciona igual.
-   [x] Se lista las actividades
-   [P] El elapsedTime se puede configurar como unidad hora, minuto o formato hh:mm
-   [x] Boton para cerrar la vista.
-   [x] Redondear el tiempo para arriba a 2 digitos despues del cero
-   [x] toggle para incluir "Pausas".
-   [x] toggle para incluir "Sin actividad".
-   [ ] Filtrar Actividades archivadas o que su duracion total sea 0

#### Actividad (Activity)

-   [ ] Botón que enlace con una tarea en ClickUp (o cualquier link).
-   [ ] Como regla, una actividad no puede tener 2 Record corriendo al mismo tiempo.
-   [ ] Animacion al ordenar tareas
-   [ ] Panel de detalles:
    -   [ ] Se abre al cliquear un activity.
    -   [ ] Muestra y deja editar informacion relacionada.
        -   [ ] Titulo
    -   [ ] Listar entradas eliminadas.
    -   [ ] Opción de restaurar entradas eliminadas.
    -   [ ] Eliminar activities.
        -   [ ] Crear el botón en el panel de detalles.
        -   [ ] Marcar como `eliminadas` en lugar de borrarlas.
        -   [ ] Aparecen dentro de un panel en la jornada.
-   [ ] Oculta las **entradas** eliminadas **luego** de la animacion de tachado.
-   [ ] Ocultar las actividades que no tienen entradas o todas estan eliminadas.
-   [ ] al crear una actividad con el mismo nombre de una existe, agrega una entrada a la existente.
-   [ ] Agregar un pequeño gap entre el titulo y el tiempo transcurrido.
-   [ ] En actividad "sin registrar, debe funcionar con el endDate del session timer unicamente con el tiempo pasado o now.
-   [x] Cambiar titulo y descripcion de "unrecordedActivity" a una mas adecuada.
-   [x] Agregar propiedad "isCollapsed" en el objeto de Activity, asi este estado se puede guardar y controlar desde los padres del componente.

#### Entradas (Record)

-   [ ] Eliminar entradas:
    -   [x] Crear el botón en la interfaz de usuario.
    -   [x] Marcar como `eliminadas` en lugar de borrarlas.
    -   [ ] Aparecen dentro de un panel en el activity.

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
-   [ ] Boton para descargar el historial en un .json

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
-   [ ] Agregar un space-btween para enviar Historial y Ajustes al piso.

#### Recomendaciones

-   [ ] Poder configurar formato de TimeInput si 24 (H:MM am/pm) o 12 (HH:MM) horas.
-   [ ] Agregar un diccionario de palabras clave de uso diario, como 'daily', 'spike', 'deploy'. se agregan con tab y tiene correccion si escribiste medio mal

#### Bugs

-   [ ] Al crear una nueva actividad, corre pero no se actualiza el timer.
-   [ ] Verificar que las nuevas actividades se estén creando correctamente, ya que al crear una actividad no aparece, pero tras crear una segunda, esta sí se muestra.

#### Estilos

-   [ ] Implementar un slice de temas y colores, que tenga diferentes temas como dark, light y variantes. Ademas que este se utilize a traves de un hook que contenga un useEffect para re-renderizar el componente si el tema cambia.
-   [ ] Ajustar todos los colores de texto, bg border, etc. A colores primario, secundario, etc.
-   [ ] Ver de poner el ContainerTopbar como sticky, que quede en el top del container.

## Tareas Completadas

<details>
  <summary>Ver tareas completadas</summary>

## Generales

-   [x] Implementar Redux.
-   [x] Renombrar ActivityEntry por Record.
-   [x] Hacer utilidades que centralicen la logica al manejar listas de Records, Actividades, etc.
-   [x] Propiedad `readOnly` que evita toda edicion en componentenes
-   [x] Guardar el estado de todayActivities en el localstorage
-   [x] Actualizar el `useTimer` al instante al retomar el focus de la página.
-   [x] Inlcuir la fecha de guardado en el `SaveObjectType`.
-   [x] Inlcuir la fecha y hora en el objeto `TodayActivitiesState`.
-   [x] No incluir en el calculo de elapsedTime las actividades y los records eliminados.
-   [x] Renombrar el objeto de jornada por `workSession` y para today es `todayWorkSession`
-   [x] Si el container no tiene el mouse adentro, el opacity del border es menor.
-   [x] Guardar automaticamente si se navega a otra pathname
-   [x] Implementar Toast de Sonner para errores y mensajes.

#### Vista jornada

-   [x] Listado de actividades y records con su timer.
-   [x] Guardar en el estado today el timer de jornada.
-   [x] Mover todayActivities a una carpeta como "bloques" o "sections"
-   [x] Las pausas se pueden editar.
-   [x] Hacer un componente separado para visualizar un `workSession` y luego utilizrlo por debajo de la vista de jornada.
-   [x] El titulo debe ser la fecha de creacion, y si es hoy ponerle como 'hoy'
-   [x] Poner en rojo el borde si esta corriendo el timer.
-   [x] Pasar el today en history cuando se monta el today y el dia no es today.
-   [x] Guardar el todaySession en history y restaurar uno nuevo.

#### Actividad (Activity)

-   [x] funciones de `play` y `stop`.
-   [x] Las pausas se registran como nuevas entradas.
-   [x] Si se da a play, buscar Record con endTime menor a 1-2 minutos de now y continuarla.
-   [x] Las entradas se ordenan por startTime
-   [x] El `esc` cancela la edicion del titulo y lo devuelve al estado original.
-   [x] Ocultar/Contraer el listado de Records.

#### Entradas (Record)

-   [x] input de hora inicio y fin, que que acepte cualquier formato (15.30, 5:24pm, 00-48am).
-   [x] El Record deja de correr si se confirma un cambio en TimeInput, excepto que siga siendo now.

#### Vista Historial.

-   [x] Agregar link en el sidebar
-   [x] Diseñar pagina.
-   [x] Listar registros.
-   [x] Si se cliquean mostrar el registro en modo readOnly.

</details>
