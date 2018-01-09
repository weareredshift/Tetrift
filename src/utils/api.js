import { invokeApig } from './aws';

export const getHighScores = (game) => (
  invokeApig({
    path: '/highscores',
    method: 'GET',
    queryParams: {
      game: game
    }
  })
);

export const saveHighScore = (game, name, score) => (
  invokeApig({
    path: '/highscores',
    method: 'POST',
    queryParams: {
      game: game,
      name: name,
      score: score
    }
  })
);
