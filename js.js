Number.prototype.pad = function(n) {
  for (var r = this.toString(); r.length < n; r = 0 + r);
  return r;
};

let city;
let language; 
const languageArray = ["en", "pt"];
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

var coords = undefined;
var temperature = undefined;
var dtNow = new Date();

async function initClock (){
	console.log('iniciou');
	renderClock();
	AdicionarEfeitoParallax();
//	ObterGeoLocation();
	
	setInterval(()=>{renderClock()},1000*60);
	
//	setInterval(()=>{ObterGeoLocation()},1000*60*30);
}

// async function ObterGeoLocation(){
// 	console.log('obter geolocation');{
// 		if (navigator.geolocation) {
// 			console.log(1);
// 			navigator.geolocation.getCurrentPosition((e)=>{
// 			coords = e.coords;
		
// 			console.log('cooorrdsss',coords);
		
// 			ObterTemperatura();
// 			},(err)=>{
// 				console.log('deu ruim',err);
// 				document.querySelector(".weather").remove();
// 				alert('deu ruim aqui1')
// 			});
// 		}
// 		else{
// 			document.querySelector(".weather").remove();
// 		}
// 	}
// }

// function obterDados() {
// 	var numero = prompt("Digite um número:");
// 	var lingua = prompt("Digite um lingua:");
// 	return [numero, lingua];
// }

// let [city, language] = obterDados();
 
// console.log(city, language)


function livelyPropertyListener(name, val)
{
    // or switch-case...
    if(name =="city"){
	city=val;
	console.log(val);
    }
    else if(name =="language"){
	language=languageArray[val];
	console.log(val);
    }
	else if(name =="imgSelect"){
	console.log(val);
	trocarimg(val);
	}
	
	if (city !==undefined && language !==undefined){
		const apiGeo = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=${language}&format=json`
		console.log(city)
		console.log(language)
		// Faça uma solicitação GET para a API usando fetch
	   fetch(apiGeo)
		 .then(response => {
		   // Verifique se a resposta da API é bem-sucedida
		   if (!response.ok) {
			 throw new Error(`Ocorreu um erro ao obter os dados meteorológicos. Código de status: ${response.status}`);
		   }
		 // Extraia informações sobre a temperatura atual, mínima e máxima da resposta da API
		   return response.json();
		  })
		.then(data => {
			const latitude = data.results[0].latitude;
			const longitude = data.results[0].longitude;
			console.log(`latitute do local: ${latitude}`);
			ObterTemperatura(latitude, longitude);
	   
	   })       
	   .catch(error => {
		   // Lidar com erros de rede ou erros na resposta da API
		   console.error('Ocorreu um aqui2:', error);
		 });
	}
}


function trocarimg(val){
	console.log(val);
	var img = document.querySelector('.bgimg');
	img.src = val;
}
 

async function ObterTemperatura(latitude, longitude){
	console.log('obter temperatura');
	let apiFore = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=GMT&forecast_days=1`;

	fetch(apiFore)
		.then(response => {
		// Verifique se a resposta da API   bem-sucedida
		if (!response.ok) {
			throw new Error(`Ocorreu um erro ao obter os dados meteorol gicos. C digo de status: ${response.status}`);
		}
		// Extraia informa  es sobre a temperatura atual, m nima e m xima da resposta da API
		return response.json();
	})
	.then(data=>{
		temperature = data;
		console.log('temperatura',temperature);
		renderTemperature();
	});
}


function renderTemperature(){
	const currentTemperature = Math.round(temperature.current.temperature_2m);
	const minTemperature = Math.round(temperature.daily.temperature_2m_min);
	const maxTemperature = Math.round(temperature.daily.temperature_2m_max);
	rotatePointer(currentTemperature, minTemperature, maxTemperature)

	// Faça o que voce  desejar com essas informaçoes (por exemplo, exibir no console)
	document.querySelector("#actual").innerHTML = currentTemperature + `°`;
	document.querySelector("#minT").innerHTML = minTemperature ;
	document.querySelector("#maxT").innerHTML = maxTemperature ;
}

function renderClock(){
	dtNow = new Date();
	document.querySelector("#wd").innerHTML = weekdays[dtNow.getDay()];
	document.querySelector("#h").innerHTML = dtNow.getHours().toString().padStart(2,'0');
	document.querySelector("#m").innerHTML = dtNow.getMinutes().pad(2);
	
	document.querySelector("#mon").innerHTML = months[dtNow.getMonth()];
	document.querySelector("#d").innerHTML = dtNow.getDate().toString().padStart(2,'0');	
}

function AdicionarEfeitoParallax(){
	const parallax = document.querySelector('.parallax');
	const img = document.querySelector('.bgimg');
	const layer = document.querySelector('.rotate-layer');

	parallax.addEventListener('mousemove', function(event) {
	  const x = event.clientX / window.innerWidth - 0.5;
	  const y = event.clientY / window.innerHeight - 0.5;

	  layer.style.transform = `translateX(${x * 20}px) translateY(${y * 20}px) `;
	  
	  img.style.transform = `translateX(${-x * 15}px) translateY(${-y * 15}px) `;
	  
	});
}
function rotatePointer(currentTemperature, minTemperature, maxTemperature) {
	var pointer = document.getElementById('pointer');
	var angle = ((currentTemperature - minTemperature) / (maxTemperature - minTemperature)) * 220 - 110;
	pointer.style.transform = 'rotate(' + angle + 'deg)';

console.log(angle);
};