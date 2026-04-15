import { Track } from './types';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'NEON_PULSE.WAV',
    artist: 'CYBER_SYNTH',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: '',
    color: '#00ffff',
  },
  {
    id: '2',
    title: 'MIDNIGHT_DRIVE.WAV',
    artist: 'RETRO_WAVE',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: '',
    color: '#ff00ff',
  },
  {
    id: '3',
    title: 'ELECTRIC_DREAMS.WAV',
    artist: 'DIGITAL_GHOST',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: '',
    color: '#00ffff',
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION = { x: 0, y: -1 };
export const GAME_SPEED = 80;
