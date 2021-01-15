//import L from 'leaflet';
window.$ = window.jQuery = require('jquery');


var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab
titulo = ["Nueva Ruta","Nueva localizacion","Pregunta"];


var map = L.map('mapid').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
    attribution: '&copy; <a>OpenStreetMap</a> contributors'
}).addTo(map);

var latlang;
var lugar;
var localizaciones = [];
var listaPreguntas = [];
var numLocalizaciones = 0;
var listaMarker = [];

var placesAutocomplete = places({
  appId: 'plOJC0RKIYMV',
  apiKey: '4b3ce3367d9d2a1a12f1d09e32bd0c75',
  container: document.querySelector('#nombreLocalizacion'),
  templates: {
    value: function(suggestion) {
        map.setView([suggestion.latlng.lat,suggestion.latlng.lng],15);
    }
  },
  });

  placesAutocomplete.on('change', e => {
    map.setView([e.suggestion.latlng.lat,e.suggestion.latlng.lng],15);
    console.log(e.suggestion.latlng);
    latlang = e.suggestion.latlng;
    lugar = e.suggestion.name;
    $('#nombreLocalizacion').text(lugar);
  });

  function onMapClick(e) {
    latlang = e.latlng;
    lugar = e.name;
    $('#nombreLocalizacion').text(lugar);
    nuevaLocalizacion();
  }

  map.on('click', onMapClick);
  
  function nuevaLocalizacion(){
    localizaciones.push([latlang.lat,latlang.lng]);
    console.log(localizaciones);

    marker = new L.marker(localizaciones[numLocalizaciones]);
    map.addLayer(marker);
    marker.bindPopup('Localizacion '+(numLocalizaciones+1)).openPopup();

    for (i= 0 ; localizaciones.length>i;i++){
      
    //listaMarker.push(marker);
    }

    /*****NUEVA FILA TABLA*****/

    $('#localizacionesDeRuta').append("<tr id='"+numLocalizaciones+"'></tr>");

    $('#localizacionesDeRuta #'+numLocalizaciones).append("<th scope='row'>"+lugar+"</th><td></td>");

    $('#localizacionesDeRuta #'+numLocalizaciones+" td").append("<Button type='button' onclick=borrar('"+numLocalizaciones+"')><em class='fas fa-eraser'></em></Button>");


    /*****NUEVO QUESTIONARIO*****/

    //NOMBRE LOCALIZACION

    $('#accordeonPreguntas').append("<div id='div"+numLocalizaciones+"'><h1 onclick='pestana("+numLocalizaciones+")'>"+lugar+"</h1></div>");    
    
    $("#div"+numLocalizaciones).append("<div class='subdiv'> </div>");

    //ESCRBIR DESCRIPCION

    $("#div"+numLocalizaciones+" .subdiv").append("Descripcion: <p><textarea id='descripcionPregunta' placeholder='Descripcion' name='' id='' style='resize: none; overflow: auto;'></textarea></p> ")

    //ESCRBIR PREGUNTA A

    $("#div"+numLocalizaciones+" .subdiv").append("Pregunta A:<p><input id='preguntaA' placeholder='Pregunta A' oninput=''></p> ");

    //ESCRBIR PREGUNTA B

    $("#div"+numLocalizaciones+" .subdiv").append("Pregunta B:<p><input id='preguntaB' placeholder='Pregunta B' oninput=''></p>");

    //ESCRBIR PREGUNTA C

    $("#div"+numLocalizaciones+" .subdiv").append("Pregunta C:<p><input id='preguntaC' placeholder='Pregunta C' oninput=''></p> ");

    //ESCRBIR IMAGEN

    $("#div"+numLocalizaciones+" .subdiv").append("Imagen:<p><input id='imagenPregunta' type='file'></p>");

    //ELEGIR TIPO PREGUNTA
    
    $("#div"+numLocalizaciones+" .subdiv").append("<p><input type='radio' name='tipo' id='Pregunta'>    <label for='Pregunta'>Pregunta</label></p>");

    $("#div"+numLocalizaciones+" .subdiv").append("<p><input type='radio' name='tipo' id='Localizacion'>    <label for='Localizacion'>Localizacion</label></p>");

    //ELEGIR RESPUESTA CORRECTA

    $("#div"+numLocalizaciones+" .subdiv").append("Respuesta correcta:    <p><select id='respuestaPregunta' class='form-select' aria-label='Default select example'>      <option selected>Open this select menu</option>      <option value='1'>A</option>      <option value='2'>B</option>      <option value='3'>C</option>  </select></p>");

    numLocalizaciones++;
  }


function pestana(num){
  $("#div"+num+" .subdiv").toggle(500);
}

function borrar(sitio){
  console.log('#'+sitio)
  $('#'+sitio).remove();
  $('#div'+sitio).remove();
  numLocalizaciones--;
  console.log(listaMarker.splice(sitio-1, 1));
  map.removeLayer(listaMarker.splice(sitio-1, 1));
  localizaciones.splice(sitio-1,1);
  console.log(localizaciones);
  console.log(listaMarker);
  

}

function editar(sitio){
  $("form div").hide();
  $('#pregunta').show();
}

function salirEditar(){
  window.location.href = 'index.html';

}

function showTab(n) {
  // This function will display the specified tab of the form ...
  var x = document.getElementsByClassName("tab");
  
  x[n].style.display = "block";
 
  if (titulo[n] === undefined){
    document.getElementById("titulo").innerHTML = "Nueva Ruta";
  }else{
    document.getElementById("titulo").innerHTML = titulo[n];
  }
  
  // ... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").innerHTML = "Submit";
    
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }
  // ... and run a function that displays the correct step indicator:
  fixStepIndicator(n)
  if(document.getElementById("titulo").innerHTML == "Nueva localizacion"){
    map.invalidateSize();
    map.locate({setView : true});
  }
  
}

function nextPrev(n) {

  // This function will figure out which tab to display
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form... :
  if (currentTab >= x.length) {
    //...the form gets submitted:
    //document.getElementById("regForm").submit();
    currentTab -= 1;
    showTab(currentTab);
    console.log('enviado');
    recogerYEnviar();
    return false;
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

function validateForm() {
  /*// This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false:
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status*/
  return true;
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class to the current step:
  x[n].className += " active";
}

/*var localizacion = document.getElementById('localizacionPregunta').value;

document.getElementById("localizacionPregunta").addEventListener("change", e => {
  
  JSONPregunta = {
    "descripcionPregunta":document.getElementById('descripcionPregunta').value,
    "preguntaA":document.getElementById('preguntaA').value,
    "preguntaB":document.getElementById('preguntaB').value,
    "preguntaC":document.getElementById('preguntaC').value,
    "imagenPregunta":document.getElementById('imagenPregunta').value,
    "tipoPregunta":tipo,
    "respuestaPregunta":document.getElementById('respuestaPregunta').value,
    "localizacionPregunta":document.getElementById('localizacionPregunta').value
  };

  console.log(JSONPregunta["localizacionPregunta"]);

  console.log(JSONPregunta["localizacionPregunta"] != "");
  
  esta =false;

  for (i=0; i < listaPreguntas.length;i++){
    console.log(listaPreguntas);
    if(listaPreguntas[i]["localizacionPregunta"] == JSONPregunta["localizacionPregunta"]){
      document.getElementById('descripcionPregunta').innerHTML=document.getElementById('descripcionPregunta').value;
      document.getElementById('preguntaA').innerHTML=document.getElementById('preguntaA').value;
      document.getElementById('preguntaB').innerHTML=document.getElementById('preguntaB').value;
      document.getElementById('preguntaC').innerHTML=document.getElementById('preguntaC').value;
      document.getElementById('imagenPregunta').innerHTML=""; 
      esta = true;
      break;
    }
    
  }

  if (!esta){
    listaPreguntas.push(JSONPregunta);
    document.getElementById('descripcionPregunta').value="";
    document.getElementById('preguntaA').value="";
    document.getElementById('preguntaB').value="";
    document.getElementById('preguntaC').value="";
    document.getElementById('imagenPregunta').value="";
  }

});*/

function recogerYEnviar(){
  var difi;
  for(i=0;i<document.getElementById('dificultad').getElementsByTagName("input").length;i++){
    if(document.getElementById('dificultad').getElementsByTagName("input")[i].checked){
      difi = document.getElementById('dificultad').getElementsByTagName("input")[i].value;
    }
  }

  var JSONRuta =  {
  "nombreRuta" : document.getElementById('nombreRuta').value,
  "descripcionRuta" : document.getElementById('descripcionRuta').value,
  "imagenRuta" : document.getElementById('imagenRuta').value,
  "ciudadRuta" : document.getElementById('ciudadRuta').value,
  "transporteRuta" : document.getElementById('transporteRuta').value,
  "tematicaRuta" : document.getElementById('tematicaRuta').value,
  "dificultadRuta":difi};
  
  //Cambiar direccion por la de la api
  fetch('https://httpbin.org/post',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(JSONRuta),
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log('data = ', data);
    })
    .catch(function(err) {
        console.error(err);
    });

  

}
