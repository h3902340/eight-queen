"use strict";
let canvas = document.getElementById("mainCanvas");
let ctx = canvas.getContext("2d");
let population = [];
let boardWidth = 8;
let boardHeight = 8;
let squareWidth = 50;
let lineThickness = 1;
let queenCount = 8;
let populationCount = 100;
let iterationLimit = 10000;
let currentIteration = 0;
let perfectEntityIndex = -1;
function generateEntity() {
    let queenSpot = [];
    for (let j = 0; j < boardWidth; j++) {
        queenSpot.push(j);
    }
    for (let j = boardWidth; j > 0; j--) {
        let index = Math.floor(Math.random() * j);
        let temp = queenSpot[index];
        queenSpot[index] = queenSpot[j - 1];
        queenSpot[j - 1] = temp;
    }
    return {
        queenSpot: queenSpot,
        score: getNonAttackingPairCount(queenSpot),
    };
}
function drawBoard(queenSpot) {
    let squareTotalWidth = squareWidth + lineThickness * 2;
    let boardWidthPx = boardWidth * squareTotalWidth;
    let boardHeightPx = boardHeight * squareTotalWidth;
    ctx.canvas.width = boardWidthPx;
    ctx.canvas.height = boardHeightPx;
    let topLeft = {
        x: 1,
        y: 1
    };
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let i = 0; i < boardHeight; i++) {
        for (let j = 0; j < boardWidth; j++) {
            drawHollowRect({ x: topLeft.x + squareTotalWidth * j, y: topLeft.y + squareTotalWidth * i, w: squareWidth, h: squareWidth }, 'white', 1);
            if (queenSpot[j] == i) {
                drawText('Q', { x: topLeft.x + squareWidth * .5 + squareTotalWidth * j, y: topLeft.y + squareWidth * .5 + squareTotalWidth * i }, 'white', 'arial', 32);
            }
        }
    }
}
function drawHollowRect(rect, color, lineWidth) {
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.w, rect.h);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
}
function drawText(text, startPosition, color, font, size) {
    ctx.font = `${size}px ${font}`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, startPosition.x, startPosition.y + 4);
}
function getNonAttackingPairCount(queenSpot) {
    let count = 0;
    for (let j = 0; j < boardWidth; j++) {
        for (let j2 = j + 1; j2 < boardWidth; j2++) {
            if (Math.abs(j2 - j) == Math.abs(queenSpot[j2] - queenSpot[j]))
                continue;
            if (queenSpot[j2] == queenSpot[j])
                continue;
            count++;
        }
    }
    return count;
}
for (let i = 0; i < populationCount; i++) {
    population.push(generateEntity());
}
while (currentIteration < iterationLimit) {
    let totalScore = 0;
    for (let i = 0; i < population.length; i++) {
        if (population[i].score == queenCount * (queenCount - 1) * .5) {
            perfectEntityIndex = i;
            break;
        }
        totalScore += population[i].score;
    }
    if (perfectEntityIndex != -1) {
        break;
    }
    // select an entity according to score
    for (let i = 0; i < population.length; i++) {
        let select = Math.floor(Math.random() * totalScore);
        for (let j = 0; j < population.length; j++) {
            if (select > population[j].score) {
                select -= population[j].score;
            }
            else {
                population[i] = population[j];
                break;
            }
        }
    }
    // mating
    for (let i = 0; i < population.length; i += 2) {
        let index = Math.floor(Math.random() * queenCount);
        for (let j = 0; j < index; j++) {
            for (let k = 0; k < boardHeight; k++) {
                let temp = population[i].queenSpot[j];
                population[i].queenSpot[j] = population[i + 1].queenSpot[j];
                population[i + 1].queenSpot[j] = temp;
            }
        }
    }
    // mutation
    for (let i = 0; i < population.length; i++) {
        let mutationIndex = Math.floor(Math.random() * boardWidth);
        let mutationIndex2 = Math.floor(Math.random() * boardWidth);
        let temp = population[i].queenSpot[mutationIndex];
        population[i].queenSpot[mutationIndex] = population[i].queenSpot[mutationIndex2];
        population[i].queenSpot[mutationIndex2] = temp;
        population[i].score = getNonAttackingPairCount(population[i].queenSpot);
    }
    currentIteration++;
}
if (perfectEntityIndex != -1) {
    drawBoard(population[perfectEntityIndex].queenSpot);
    document.getElementById('result').innerHTML = `Population: ${population.length}, Iteration: ${currentIteration}`;
}
else {
    let highest = 0;
    for (let i = 0; i < population.length; i++) {
        if (population[i].score > highest) {
            highest = population[i].score;
        }
    }
    alert('No perfect entity! highest: ' + highest);
}
