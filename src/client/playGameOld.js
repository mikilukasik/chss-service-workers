// import Worker from './workers/playLearnerGame.worker.js';

// const worker = new Worker();

// const onmessageHandlers = {};
// worker.onmessage = (event) => {
//   const handler = onmessageHandlers[event.data.command];
//   handler(event.data.data);
// };

// export const autoPlayTournamentGame = ({ startingFen, black, white }) =>
//   new Promise((r) => {
//     onmessageHandlers['autoPlayTournamentGame:result'] = r;
//     worker.postMessage({ command: 'autoPlayTournamentGame', data: { startingFen, black, white } });
//   });
