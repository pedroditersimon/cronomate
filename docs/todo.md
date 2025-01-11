
## Generales
- [ ] Al cerrar la app, todos los timers se hacen stop y se guarda en local storage.
- [ ] Guardar el estado de todayActivities en el localstorage


#### Vista jornada
- [ ] Timer de jornada (todayTimer).
    - [x] Boton de `play` y `stop`.
    - [x] Al dar stop al Timer de jornada, todas las actividad corriendo se hacen stop.
    - [x] Al darle play a otra actividad el timer jornada, tambien se da a play.
    - [x] Al darle a play al timer jornada, registrar una pausa desde el endTime a now.
    - [ ] Barra de progreso con tiempo transcurrido.
    - [ ] Hacerlo clickeable y te desbliegue un rango de inicio a fin.
    - [ ] Actualizar el endtime cada segundo si esta corriedno, o almenos al correr una ctividad
- [ ] Placeholder de actividad para crear nuevas.
    - [ ] Al hacer focus, desplegar un record vacio configurable
    - [x] Si el endTime se confirma vacio, la actividad se crea corriendo.
    - [ ] Si se presiona el boton de run, inevitablemente la actividad se crea corriendo.
    - [ ] Si el record tiene valores ingresados, no vuelve a ocultarse.
- [ ] Actividad "Sin registrar"
    - [ ] Se puede asignar a otra Actividad con un menu.
    - [ ] Se puede asignar a otra Actividad con arrastre.
- [ ] Las actividades se ordenan por startTime
- [ ] Animacion al ordenar actividades


#### Actividad (Activity)
- [ ] Botón que enlace con una tarea en ClickUp (o cualquier link).
- [ ] Eliminar las entradas.
- [ ] Como regla, una actividad no puede tener 2 Record corriendo al mismo tiempo.
- [ ] Ocultar/Contraer el listado de Records.
- [ ] Animacion al ordenar tareas


#### Entradas (Record)
- [ ] Boton para eliminar entrada

#### Input de hora (TimeInput)
- [ ] No se actualiza si se esta haciendo focus.
- [ ] Palabras clave como "ahora", "ya" y "now" que establezcan el tiempo a ahora.
- [ ] Al hacer focus desplegar un pequeño calendario con el mes, botones para ir al mes anterior y un boton de hoy y ayer para establecer el dia. _(ver librería `cally`)_


#### Sidebar
- [ ] Panel con botones de cada seccion.
    - [ ] Es contraible.
- [ ] Vista jornada.
- [ ] Resumen Dayli.
- [ ] Resumen semanal/mensual.
- [ ] Notas personales.
- [ ] Configuracion.
    - [ ] Jornada y descansos.
    - [ ] Personalizacion visual (estilos).


#### Recomendaciones
- [ ] Crear una tarea con el mismo nombre de una existe, agrega una entrada a la existente.
- [ ] Poder configurar formato de TimeInput si 24 (H:MM am/pm) o 12 (HH:MM) horas.


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


#### Vista jornada
- [x] Listado de actividades y records con su timer.
- [x] Guardar en el estado today el timer de jornada.
- [x] Mover todayActivities a una carpeta como "bloques" o "sections"


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