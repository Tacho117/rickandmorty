// Patrón obligatorio de Module Federation: el import dinámico crea una pausa asíncrona
// para que webpack negocie las librerías compartidas (react, react-dom, react-router-dom)
// ANTES de ejecutar el código de la app. Sin esto aparece el error "Shared module is not available for eager consumption".
import('./bootstrap');
