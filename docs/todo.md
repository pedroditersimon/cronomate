


## Generales
- [ ] Al cerrar la app, todos los timers se hacen stop y se guarda en local storage.
- [ ] Implementar Toast de Sonner para errores y mensajes.
- [ ] Unificar los ticks de useTimer para solo tener un timeout cada 1s y que todos usen ese. 
- [ ] Si el container no tiene el mouse adentro, el opacity del border es menor.


#### Vista jornada
- [ ] Timer de jornada (todayTimer).
    - [x] Boton de `play` y `stop`.
    - [x] Al dar stop al Timer de jornada, todas las actividad corriendo se hacen stop.
    - [x] Al darle play a otra actividad el timer jornada, tambien se da a play.
    - [x] Al darle a play al timer jornada, registrar una pausa desde el endTime a now.
    - [ ] Barra de progreso con tiempo transcurrido.
    - [ ] Hacerlo clickeable y te desbliegue un rango de inicio a fin.
    - [x] Actualizar el endtime cada segundo si esta corriedno, o almenos al correr una actividad
    - [x] Mostrar el tiempo transcurrido total en el timer.
- [ ] Placeholder de actividad para crear nuevas.
    - [ ] Al hacer focus, desplegar un record vacio configurable
    - [x] Si no tiene endTime, la actividad se crea corriendo.
    - [ ] Si el record tiene valores ingresados, no vuelve a contraerse.
- [ ] Actividad "Sin registrar"
    - [ ] Se puede asignar a otra Actividad con un menu.
    - [ ] Se puede asignar a otra Actividad con arrastre.
- [ ] Las actividades se ordenan por startTime
- [ ] Animacion al ordenar actividades
- [ ] El activity de pausas debe estar siempre a lo ultimo
- [ ] Panel detalles de jornada.
    - [ ] Se abre en una ruedita de configuración del container del `todayActivity`.
    - [ ] Listar activities eliminadas.
    - [ ] Opción de restaurar activities eliminadas.
- [ ] Oculta las activities eliminadas **luego** de la animacion de tachado.
- [ ] Hacer un div con overflow scroll para las actividades, sin incluir el activityCreator.
- [ ] Poner en rojo el borde si esta corriendo el timer.
- [ ] Implementar una notificación visual (texto con ícono y animación en el contenedor) que indique cuándo se realiza un guardado explícito (no automáticos).
- [ ] Corte automático al finalizar la jornada laboral, si se establece. el auto-stop puede modificarse en la config del "Today".
- [ ] Cinco minutos antes, mostrar una advertencia en pantalla con un sonido de alerta, dando la opción de cancelar el auto-stop.



#### Actividad (Activity)
- [ ] Botón que enlace con una tarea en ClickUp (o cualquier link).
- [ ] Como regla, una actividad no puede tener 2 Record corriendo al mismo tiempo.
- [ ] Ocultar/Contraer el listado de Records.
- [ ] Animacion al ordenar tareas
- [ ] Panel de detalles:
    - [ ] Se abre al cliquear un activity.
    - [ ] Muestra y deja editar informacion relacionada.
    - [ ] Listar entradas eliminadas.
    - [ ] Opción de restaurar entradas eliminadas.
- [ ] Eliminar activities.
    - [ ] Crear el botón en la interfaz de usuario.
    - [ ] Marcar como `eliminadas` en lugar de borrarlas.
    - [ ] Aparecen dentro de un panel en la jornada.
- [ ] Oculta las entradas eliminadas luego de la animacion de tachado.
- [ ] Ocultar las actividades que no tienen entradas o todas estan eliminadas.
- [ ] al crear una actividad con el mismo nombre de una existe, agrega una entrada a la existente.
- [ ] Agregar un pequeño gap entre el titulo y el tiempo transcurrido.


#### Entradas (Record)
- [ ] Eliminar entradas:
    - [x] Crear el botón en la interfaz de usuario.
    - [x] Marcar como `eliminadas` en lugar de borrarlas.
    - [ ] Aparecen dentro de un panel en el activity.



#### Input de hora (TimeInput)
- [ ] No se actualiza si se esta haciendo focus.
- [ ] Palabras clave como "ahora", "ya" y "now" que establezcan el tiempo a ahora.
- [ ] Al hacer focus desplegar un pequeño calendario con el mes, botones para ir al mes anterior y un boton de hoy y ayer para establecer el dia. _(ver librería `cally`)_


#### Vista Historial.
- [x] Agregar link en el sidebar
- [x] Diseñar pagina.
- [ ] Listar registros.
- [ ] Si se cliquean mostrar el registro en modo readOnly.


#### Sidebar
- [x] Panel con botones de cada seccion.
    - [ ] Es contraible.
- [ ] Vista jornada.
- [ ] Vista Historial de jornadas.
- [ ] Resumen Dayli.
- [ ] Resumen semanal/mensual.
- [ ] Notas personales.
- [ ] Configuracion.
    - [ ] Jornada y descansos.
    - [ ] Personalizacion visual (estilos).


#### Recomendaciones
- [ ] Poder configurar formato de TimeInput si 24 (H:MM am/pm) o 12 (HH:MM) horas.
- [ ] Agregar un diccionario de palabras clave de uso diario, como 'daily', 'spike', 'deploy'. se agregan con tab y tiene correccion si escribiste medio mal

#### Bugs
- [ ] Al crear una nueva actividad con el placeholder, corre pero no se actualiza el timer.


#### Estilos
- [ ] Implementar un slice de temas y colores, que tenga diferentes temas como dark, light y variantes. Ademas que este se utilize a traves de un hook que contenga un useEffect para re-renderizar el componente si el tema cambia.




## Tareas Completadas
<details>
  <summary>Ver tareas completadas</summary>


## Generales
- [x] Implementar Redux.
- [x] Renombrar ActivityEntry por Record.
- [x] Hacer utilidades que centralicen la logica al manejar listas de Records, Actividades, etc.
- [x] Propiedad `readOnly` que evita toda edicion en componentenes
- [x] Guardar el estado de todayActivities en el localstorage
- [x] Actualizar el `useTimer` al instante al retomar el focus de la página.
- [x] Inlcuir la fecha de guardado en el `SaveObjectType`.
- [x] Inlcuir la fecha y hora en el objeto `TodayActivitiesState`.
- [x] No incluir en el calculo de elapsedTime las actividades y los records eliminados.
- [x] Renombrar el objeto de jornada por `workSession` y para today es `todayWorkSession`

#### Vista jornada
- [x] Listado de actividades y records con su timer.
- [x] Guardar en el estado today el timer de jornada.
- [x] Mover todayActivities a una carpeta como "bloques" o "sections"
- [x] Las pausas se pueden editar.
- [x] Hacer un componente separado para visualizar un `workSession` y luego utilizrlo por debajo de la vista de jornada.
- [x] El titulo debe ser la fecha de creacion, y si es hoy ponerle como 'hoy'

#### Actividad (Activity)
- [x] funciones de `play` y `stop`.
- [x] Las pausas se registran como nuevas entradas.
- [x] Si se da a play, buscar Record con endTime menor a 1-2 minutos de now y continuarla.
- [x] Las entradas se ordenan por startTime
- [x] El `esc` cancela la edicion del titulo y lo devuelve al estado original.

#### Entradas (Record)
- [x] input de hora inicio y fin, que que acepte cualquier formato (15.30, 5:24pm, 00-48am).
- [x] El Record deja de correr si se confirma un cambio en TimeInput, excepto que siga siendo now.

</details>