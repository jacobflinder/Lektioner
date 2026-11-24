/* Fy1 9.7: elevvyn ska vara självförklarande utan intern lärarvy. 
   Körs efter gemensamt app.js, som kopplar sina händelser vid start. 
   Lärarstöd och källgranskning finns kvar som separata projektfiler. */
(()=>{'use strict';
  document.getElementById('teacher-toggle')?.remove();
  document.getElementById('teacher-link')?.remove();
  document.querySelectorAll('.teacher-note, .source-note').forEach(node=>node.remove());
  document.body.classList.remove('teacher-on');
})();
