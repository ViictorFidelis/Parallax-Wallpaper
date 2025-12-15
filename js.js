Number.prototype.pad = function (n) {
	for (var r = this.toString(); r.length < n; r = 0 + r);
	return r;
};

let city;
let language;
const languageArray = ["en", "pt"];
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const weekdayspt = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const monthspt = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

var coords = undefined;
var temperature = undefined;
var dtNow = new Date();
var longitude = undefined;
var latitude = undefined;

async function initClock() {
	renderClock();
	AdicionarEfeitoParallax();
	//	ObterGeoLocation();

	setInterval(() => { renderClock() }, 1000 * 60);
	//	setInterval(()=>{ObterGeoLocation()},1000*60*30);
	setInterval(() => { ObterTemperatura(latitude, longitude) }, 1000 * 60 * 60);
}



function livelyPropertyListener(name, val) {
	// or switch-case...
	if (name == "city") {
		val = val.toLowerCase()
		city = val;
	}
	else if (name == "language") {
		language = languageArray[val];
		renderDays(language);
		setInterval(() => { renderDays(language) }, 1000 * 60 * 60)
	}
	else if (name == "imgSelect") {
		trocarimg(val);
	}

	if (city !== undefined && language !== undefined) {
		const apiGeo = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=${language}&format=json`
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
				 latitude = data.results[0].latitude;
				 longitude = data.results[0].longitude;
				ObterTemperatura(latitude, longitude);

			})
			.catch(error => {
				// Lidar com erros de rede ou erros na resposta da API
				console.error('Ocorreu um aqui2:', error);
			});
	}
}


function trocarimg(val) {
	var img = document.querySelector('.bgimg');
	img.src = val;
}


async function ObterTemperatura(latitude, longitude) {
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
		.then(data => {
			temperature = data;
			renderTemperature();
		});
}


function renderTemperature() {
	const currentTemperature = Math.round(temperature.current.temperature_2m);
	const minTemperature = Math.round(temperature.daily.temperature_2m_min);
	const maxTemperature = Math.round(temperature.daily.temperature_2m_max);
	rotatePointer(currentTemperature, minTemperature, maxTemperature)

	// Faça o que voce  desejar com essas informaçoes (por exemplo, exibir no console)
	document.querySelector("#actual").innerHTML = currentTemperature + `°`;
	document.querySelector("#minT").innerHTML = minTemperature;
	document.querySelector("#maxT").innerHTML = maxTemperature;
}

function renderDays(language) {
	dtNow = new Date();
	var lang = language; // Defina aqui o idioma desejado, por exemplo, "pt" para português
	console.log(language)
	if (lang === "pt") {
		document.querySelector("#wd").innerHTML = weekdayspt[dtNow.getDay()];
		document.querySelector("#mon").innerHTML = monthspt[dtNow.getMonth()];
		document.querySelector("#d").innerHTML = dtNow.getDate().toString().padStart(2, '0');
	} else {
		document.querySelector("#wd").innerHTML = weekdays[dtNow.getDay()];
		document.querySelector("#mon").innerHTML = months[dtNow.getMonth()];
		document.querySelector("#d").innerHTML = dtNow.getDate().toString().padStart(2, '0');
	}
}

function renderClock() {
	dtNow = new Date();
	document.querySelector("#h").innerHTML = dtNow.getHours().toString().padStart(2, '0');
	document.querySelector("#m").innerHTML = dtNow.getMinutes().pad(2);
}


function AdicionarEfeitoParallax() {
	const parallax = document.querySelector('.parallax');
	const img = document.querySelector('.bgimg');
	const layer = document.querySelector('.rotate-layer');

	parallax.addEventListener('mousemove', function (event) {
		const x = event.clientX / window.innerWidth - 0.5;
		const y = event.clientY / window.innerHeight - 0.5;

		layer.style.transform = `translateX(${x * 10}px) translateY(${y * 10}px) `;

		img.style.transform = `translateX(${-x * 10}px) translateY(${-y * 10}px) `;

	});
}
function rotatePointer(currentTemperature, minTemperature, maxTemperature) {
	var pointer = document.getElementById('pointer');
	var angle = ((currentTemperature - minTemperature) / (maxTemperature - minTemperature)) * 220 - 110;
	pointer.style.transform = 'rotate(' + angle + 'deg)';
};
