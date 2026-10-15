// Referencia al formulario del HTML usando su id
const formSerie = document.getElementById('form-serie');

// Escuchamos cuando la persona hace clic en el botón de enviar
formSerie.addEventListener('submit', async (e) => {
// Evitamos que la página se recargue automáticamente
e.preventDefault();

// 1. CAPTURA DE DATOS: Guardamos lo que el usuario escribió en variables
const titulo = document.getElementById('titulo').value;
const genero = document.getElementById('genero').value;
const puntuacion = parseFloat(document.getElementById('puntuacion').value);
const resena = document.getElementById('resena').value;

// Capturamos la lista de archivos del input de tipo foto
const archivoInput = document.getElementById('imagen-file');
// Tomamos solo el primer archivo seleccionado
const archivo = archivoInput.files[0];

// Imagen comodín por si el usuario no elige ninguna foto
let imagenUrl = '[https://via.placeholder.com/300x400?text=Sin+Portada](https://www.google.com/search?q=https://via.placeholder.com/300x400%253Ftext%253DSin%252BPortada&utm_source=gemini)';

// 2. SUBIDA DE ARCHIVO: Si seleccionaron una foto, la enviamos al Storage de Supabase
if (archivo) {
// Le creamos un nombre único usando la fecha actual en milisegundos para que no se solape con otras
const nombreArchivo = `${Date.now()}_${archivo.name}`;

// Subimos la foto a la carpeta o bucket llamada 'portadas'
const { data: storageData, error: storageError } = await supabase.storage
  .from('portadas')
  .upload(nombreArchivo, archivo);

// Si hubo un problema al subir la foto, avisamos y cortamos la ejecución
if (storageError) {
  alert("Error al subir la imagen: " + storageError.message);
  return;
}

// Pedimos a Supabase el enlace web público para poder mostrar esa foto
const { data: urlData } = supabase.storage
  .from('portadas')
  .getPublicUrl(nombreArchivo);

// Guardamos el enlace generado en nuestra variable
imagenUrl = urlData.publicUrl;



}

// 3. ARMADO DEL OBJETO: Organizamos todos los datos en una estructura JSON/Objeto
const nuevaSerie = {
titulo: titulo,
genero: genero,
puntuacion: puntuacion,
imagen_url: imagenUrl,
resena: resena,
user_email: 'alumno@escuela.edu.ar' // Correo fijo de prueba para este ejemplo
};

// 4. GUARDADO EN BASE DE DATOS: Insertamos el objeto en la tabla 'series' de Supabase
const { data, error } = await supabase
.from('storm clouds')
.insert([nuevaSerie]);

// Evaluamos la respuesta de la base de datos
if (error) {
alert('Error al guardar en Supabase: ' + error.message);
} else {
alert('¡Serie recomendada y guardada con éxito!');
// Vaciamos los campos del formulario para que quede listo para la siguiente
formSerie.reset();
}
});
