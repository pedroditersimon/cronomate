
## Todo
- [x] Implementar Redux.
- [x] Renombrar ActivityEntry por Record.


#### Vista jornada
- [ ] Timer jornada.
    - [ ] Funciones de `play` y `stop`.
- [x] Listado de actividades y records con su timer.
- [ ] Placeholder de actividad para crear nuevas.
- [ ] Actividad "Sin registrar"
    - [ ] Se puede asignar a otra Actividad con un menu.
    - [ ] Se puede asignar a otra Actividad con arrastre.


#### Actividad (Activity)
- [ ] funciones de `play` y `stop`.
- [ ] Botón que enlace con una tarea en ClickUp (o cualquier link).
- [ ] Las pausas se registran como nuevas entradas.
- [ ] Eliminar las entradas 
- [ ] Como regla, una actividad no puede tener 2 Record corriendo al mismo tiempo.
- [ ] Si se da a play, buscar Record con endTime menor a 1-2 minutos de now y continuarla.

#### Entradas (Record)
- [x] input de hora inicio y fin, que que acepte cualquier formato (15.30, 5:24pm, 00-48am).
- [ ] El Record deja de correr si se confirma un TimeInput.
- [ ] Boton para eliminar entrada

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


#### Bugs
- [ ] Al crear una nueva actividad, corre pero no se actualiza el timer.


#### Estilos
- [ ] Implementar un slice de temas y colores, que tenga diferentes temas como dark, light y variantes. Ademas que este se utilize a traves de un hook que contenga un useEffect para re-renderizar el componente si el tema cambia.