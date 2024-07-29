/** @type {HTMLCanvasElement} */
const canvas = document.querySelector("canvas");

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

const TAU = 6.28318530;

// configura a resolução (no momento fixo 1200 x 800)
canvas.width  = 1200;
canvas.height = 1000;


const centro = {
	x: canvas.width  * 0.5,
	y: canvas.height * 0.5,
}

const config = {
	// qtdFrames: 0,
	qtdFrames: 60 * 2,
	linhas: false,
	escala: 1,
}


render();

function render() {
	config.qtdFrames += 1 * config.escala;

	limpaCanvas();
	desenhaRepresentacaoDoSistemaDeCoordenadas();
	desenhaTextoDeAtalhos();
	desenhaUniverso();

	window.requestAnimationFrame(render);
}

window.addEventListener("keypress", evt => {
	const tecla = evt.key.toLowerCase();
	if (tecla === "l") {
		config.linhas = !config.linhas;
		return;
	}

	if (tecla === "s") {
		config.escala += 0.1;
		return;
	}

	if (tecla === "d") {
		config.escala -= 0.1;
		return;
	}

	if (tecla === "r") {
		config.linhas = false;
		config.escala = 1;
		return;
	}
})


function limpaCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function desenhaUniverso() {
	const rotacao = config.qtdFrames / 360;

	desenhaBuracoNegroEm(centro.x, centro.y, -rotacao * 6)

	let x = 0;
	let y = 0;
	
	// vetor do buraco negro até o sol
	const solX = 0;
	const solY = 240;

	let cos = Math.cos(-rotacao * 4);
	let sin = Math.sin(-rotacao * 4);

	// rotaciona vetor local do buraco negro ate o sol
	x = cos * solX - sin * solY;
	y = sin * solX + cos * solY;
	// poderia usar só os Y porque os X em coordenadas locais são sempre 0
	// x = - sin * solY;
	// y = + cos * solY;

	const solAbsX = centro.x + x;
	const solAbsY = centro.y + y;

	if (config.linhas) desenhaLinhaEntre(centro.x, centro.y, solAbsX, solAbsY)
	desenhaSolEm(solAbsX, solAbsY, rotacao * 10);

	// vetor do sol até o planeta
	const planetaX = 0;
	const planetaY = 150;

	cos = Math.cos(-rotacao * 8);
	sin = Math.sin( rotacao * 8);

	// rotaciona vetor local do sol ate o planeta
	x = cos * planetaX - sin * planetaY;
	y = sin * planetaX + cos * planetaY;

	const planetaAbsX = solAbsX + x;
	const planetaAbsY = solAbsY + y;

	if (config.linhas) desenhaLinhaEntre(solAbsX, solAbsY, planetaAbsX, planetaAbsY)
	desenhaPlanetaEm(planetaAbsX, planetaAbsY, -rotacao * 22);

	// vetor do planeta até a lua
	const luaX = 0;
	const luaY = 100;

	cos = Math.cos(-rotacao * 20);
	sin = Math.sin(-rotacao * 20);

	// rotaciona vetor local do planeta ate a lua
	x = cos * luaX - sin * luaY;
	y = sin * luaX + cos * luaY;

	const luaAbsX = planetaAbsX + x;
	const luaAbsY = planetaAbsY + y;

	if (config.linhas) desenhaLinhaEntre(planetaAbsX, planetaAbsY, luaAbsX, luaAbsY)
	desenhaLuaEm(luaAbsX, luaAbsY);
}

function desenhaTextoDeAtalhos() {
	ctx.fillStyle = "gray";
	ctx.font = "30px serif"
	ctx.lineWidth = 2;
	const x = canvas.width  * 6/10;
	const y = canvas.height * 1/10;
	const tamanhoLinha = canvas.height * 0.5/10
	
	// ctx.fillText("L: ativa desenho de Linhas",   x, y + tamanhoLinha * 0)
	// ctx.fillText("S: aumenta eScala de tempo",   x, y + tamanhoLinha * 1)
	// ctx.fillText("D: Diminui a escala de tempo", x, y + tamanhoLinha * 2)
	// ctx.fillText("R: Reseta configurações", x, y + tamanhoLinha * 3)
	// const scaleStr = `escala de tempo: ${config.escala.toFixed(1)}`;

	ctx.fillText("L: Lines",   x, y + tamanhoLinha * 0)
	ctx.fillText("S: Time scale up", x, y + tamanhoLinha * 1)
	ctx.fillText("D: Time scale down", x, y + tamanhoLinha * 2)
	ctx.fillText("R: Reset", x, y + tamanhoLinha * 3)
	const scaleStr = `time scale: ${config.escala.toFixed(1).replace("-0.0", "0.0")}`;

	// const strMeasure = ctx.measureText(scaleStr);
	ctx.fillText(scaleStr, x, y + tamanhoLinha * 4);
}

function desenhaBuracoNegroEm(x, y, rotacaoLocal) {
	ctx.fillStyle = "black";
	desenhaCirculoEm(x, y, 25);

	ctx.lineWidth = 5
	const its = 10;
	for (let i = 0; i <= its; ++i) {
		const t = i / its;
		const angle = TAU * t + rotacaoLocal;
		
		ctx.beginPath();
		ctx.ellipse(x, y, 40, 21, angle, TAU * 0.75, TAU);
		ctx.stroke();
	}
}

function desenhaSolEm(x, y, rotacaoLocal) {
	ctx.lineWidth = 5;
	ctx.fillStyle = "orange"
	desenhaCirculoEm(x, y, 20);

	ctx.strokeStyle = "orange"
	const its = 9;
	ctx.beginPath();
	for (let i = 0; i <= its; ++i) {
		const t = i / its;
		const angle = TAU * t + rotacaoLocal;

		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		const raioX = cos * 25;
		const raioY = sin * 25;
		linhaQualquerEntre(x + raioX, y + raioY, x + raioX * 1.5, y + raioY * 1.5)
		// ctx.ellipse(x, y, 60, 40, angle, TAU * 0.75, TAU);
	}
	ctx.stroke();
}

function desenhaPlanetaEm(x, y, rotacaoLocal) {
	ctx.strokeStyle = "saddleBrown"
	ctx.lineWidth = 5;
	ctx.beginPath();
	ctx.ellipse(x, y, 25, 5, rotacaoLocal, 0 - 0.3, TAU * 0.5 + 0.3);
	ctx.stroke();

	ctx.fillStyle = "peru"
	desenhaCirculoEm(x, y, 15);

	ctx.beginPath();
	ctx.ellipse(x, y, 25, 5, rotacaoLocal, TAU * 0.5, TAU);
	ctx.stroke();
}

function desenhaLuaEm(x, y) {
	ctx.fillStyle = "gray";
	desenhaCirculoEm(x, y, 10);
}


function desenhaCirculoEm(x, y, raio) {
	ctx.beginPath();
	ctx.arc(x, y, raio, 0, TAU);
	ctx.fill();
}

function desenhaPontoEm(x, y) {
	ctx.lineWidth = 7;
	ctx.beginPath();
	ctx.arc(x, y, 7, 0, TAU);
	ctx.fill();
}

function desenhaLinhaEntre(x0, y0, x1, y1) {
	ctx.lineWidth = 3;
	ctx.strokeStyle = "black";
	linhaQualquerEntre(x0, y0, x1, y1);
}


function configuraGrossuraEEstiloDaLinha(width, strokeStyle) {
	ctx.lineWidth   = width;
	ctx.strokeStyle = strokeStyle;
}

function lerp(a, b, t) {
	return (1 - t) * a + t * b;
}

function randomRange(min, max) {
	return lerp(min, max, Math.random());
}

function linhaQualquerEntre(x0, y0, x1, y1) {
	ctx.beginPath();
	ctx.moveTo(x0, y0);
	ctx.lineTo(x1, y1);
	ctx.stroke();
}

function desenhaRepresentacaoDoSistemaDeCoordenadas() {
	// pinta o background
	ctx.fillStyle = "beige"
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// configura fonte
	ctx.fillStyle = "black"
	const fontSize = Math.min(canvas.width, canvas.height) / 25;
	ctx.font = `${fontSize}px serif`;

	// texto "0"
	ctx.fillText("0", 0, fontSize * 0.85)
 
	// textos "0..9"
	const markerLen = 10;
	for (let i = 1; i < 10; ++i) {
		const t = i / 10;

		const w = t * canvas.width;  // ou lerp(0, canvas.width, t)
		const wString = `${Math.round(w)}`
		const wStringMetrics = ctx.measureText(wString);
 
		// desenha linhas verticais (colunas)
		configuraGrossuraEEstiloDaLinha(0.25, "gray");
		linhaQualquerEntre(w, 0, w, canvas.height);

		// marcadores verticais
		configuraGrossuraEEstiloDaLinha(2.00, "black");
		linhaQualquerEntre(w, 0, w, markerLen);

		// textos das "colunas"
		ctx.fillText(wString, w - wStringMetrics.width - ctx.lineWidth, fontSize * 0.85);

		const h = t * canvas.height; // ou lerp(0, canvas.height, t)
		const hString = `${Math.round(h)}`
 
		// desenha linhas horizontais
		configuraGrossuraEEstiloDaLinha(0.25, "gray");
		linhaQualquerEntre(canvas.width, h, markerLen, h);

		// marcadores horizontais
		configuraGrossuraEEstiloDaLinha(2.00, "black");
		linhaQualquerEntre(0, h, markerLen, h);

		// textos das linhas
		ctx.fillText(hString, 0, h - ctx.lineWidth);
	}

	// texto "10"
	const textWidth = ctx.measureText(canvas.width).width;
	ctx.fillText(canvas.width, canvas.width - textWidth, fontSize * 0.85);
	ctx.fillText(canvas.height, 0, canvas.height);
}
