- agreagr registro de pausas, que no son facturables. pero te muestras las pausas que tuviste, hoy por ejemplo tengo casi 40min de pausa

Calendario librería react `cally`

## Todo
- [x] Implementar Redux.
- [x] Renombrar ActivityEntry por Record.
- [ ] Si se cierra la app, todos los timers se hacen stop y se guarda el estado en local storage.
- [x] Hacer utilidades que centralicen la logica al manejar listas de Records, Actividades, etc.
- [ ] Propiedad `readOnly` que evita toda edicion en componentenes

#### Vista jornada
- [ ] Timer jornada.
    - [x] Boton de `play` y `stop`.
    - [ ] Barra de progreso con tiempo transcurrido.
    - [ ] Hacerlo clickeable y te desbliegue un rango de inicio a fin.
    - [x] Al dar stop al timer jornada, todas las actividad corriendo se hacen stop.
    - [x] Al darle a play al timer jornada, registrar una pausa desde el endTime a now.
    - [x] Al darle play a otra actividad el timer jornada, tambien se da a play.
- [x] Listado de actividades y records con su timer.
- [ ] Placeholder de actividad para crear nuevas.
    - [ ] Al hacer focus, desplegar un record vacio configurable
    - [x] Si el endTime se confirma vacio, la actividad se crea corriendo.
    - [ ] Si se presiona el boton de run, inevitablemente la actividad se crea corriendo.
    - [ ] Si el record tiene valores ingresados, no vuelve a ocultarse.
- [ ] Actividad "Sin registrar"
    - [ ] Se puede asignar a otra Actividad con un menu.
    - [ ] Se puede asignar a otra Actividad con arrastre.
- [ ] Las actividades se ordenan por startTime
    - [ ] Animacion al ordenarlas


#### Actividad (Activity)
- [x] funciones de `play` y `stop`.
- [ ] Botón que enlace con una tarea en ClickUp (o cualquier link).
- [x] Las pausas se registran como nuevas entradas.
- [ ] Eliminar las entradas 
- [ ] Como regla, una actividad no puede tener 2 Record corriendo al mismo tiempo.
- [x] Si se da a play, buscar Record con endTime menor a 1-2 minutos de now y continuarla.
- [ ] Ocultar/Contraer el listado de Records.
- [x] Las entradas se ordenan por startTime
    - [ ] Animacion al ordenarlas
- [ ] El `esc` cancela la edicion del titulo y lo devuelve al estado original.

#### Entradas (Record)
- [x] input de hora inicio y fin, que que acepte cualquier formato (15.30, 5:24pm, 00-48am).
- [x] El Record deja de correr si se confirma un cambio en TimeInput, excepto que siga siendo now.
- [ ] Boton para eliminar entrada

#### input de hora (TimeInput)
- [ ] No se actualiza si se esta haciendo focus.
- [ ] Palabras clave como "ahora", "ya" y "now" que establezcan el tiempo a ahora.
- [ ] Al hacer focus desplegar un pequeño calendario con el mes, botones para ir al mes anterior y un boton de hoy y ayer para establecer el dia.


#### Sidebar
- [ ] Jornada y descansos.
- [ ] Resumen Dayli.
- [ ] Resumen semanal/mensual.
- [ ] Estilos.
- [ ] Notas personales.
- [ ] Configuracion.


#### Recomendaciones
- [ ] Crear una tarea con el mismo nombre de una existe, agrega una entrada a la existente.
- [ ] Poder configurar formato de TimeInput si 24 (H:MM am/pm) o 12 (HH:MM) horas.


#### Bugs
- [ ] Al crear una nueva actividad con el placeholder, corre pero no se actualiza el timer.


#### Estilos
- [ ] Implementar un slice de temas y colores, que tenga diferentes temas como dark, light y variantes. Ademas que este se utilize a traves de un hook que contenga un useEffect para re-renderizar el componente si el tema cambia.