
## Todo
- [x] Implementar Redux.
- [x] Renombrar ActivityEntry por Record.


#### Vista jornada
- [ ] Timer jornada.
- [x] Listado de actividades y records con su timer.
- [ ] Placeholder de actividad para crear nuevas.
- [ ] Actividad "Sin registrar"
    - [ ] Se puede asignar a otra Actividad con un menu.
    - [ ] Se puede asignar a otra Actividad con arrastre.


#### Actividad (Activity)
- [ ] funciones de `play`, `pause` y `stop`.
- [ ] Botón que enlace con una tarea en ClickUp (o cualquier link).
- [ ] Las pausas se registran como nuevas entradas.


#### Entradas (Record)
- [x] input de hora inicio y fin, que que acepte cualquier formato (15.30, 5:24pm, 00-48am).
- [ ] El Record deja de correr si se confirma un TimeInput.


#### input de hora (TimeInput)
- [ ] No se actualiza si se esta haciendo focus.
- [ ] Palabras clave como "ahora", "ya" y "now" que establezcan el tiempo a ahora
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