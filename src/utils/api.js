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
