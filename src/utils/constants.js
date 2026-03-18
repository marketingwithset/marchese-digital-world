// SET UNIVERSE — Constants & Configuration

export const COLORS = {
  SET_NAVY: 0x0A1628,
  SET_GOLD: 0xC5A55A,
  CHROME_SILVER: 0xC0C0C0,
  DEEP_BLACK: 0x050505,
  WARM_WHITE: 0xF5F0E8,
  CAPITAL_GOLD: 0xFFD700,
  INFRA_BLUE: 0x0066FF,
  GROWTH_GREEN: 0x00CC66,
  PHONE_RED: 0xCC0000,
  RUNWAY_PINK: 0xFF1493
};

export const ROOMS = {
  MAIN_HALL: 'main_hall',
  CAPITAL: 'capital',
  INFRASTRUCTURE: 'infrastructure',
  GROWTH: 'growth',
  ART_GALLERY: 'art_gallery',
  FASHION: 'fashion',
  MEDIA_LOUNGE: 'media_lounge',
  CAR_SHOWROOM: 'car_showroom'
};

export const MAIN_HALL_DIMS = { WIDTH: 30, DEPTH: 20, HEIGHT: 8, WALL_THICKNESS: 0.3 };

export const PLAYER = {
  SPEED: 5,
  SPRINT_MULTIPLIER: 1.8,
  HEIGHT: 1.8,
  RADIUS: 0.4,
  CAMERA_OFFSET: { x: 0, y: 3.5, z: 5 },
  CAMERA_LOOK_OFFSET: { x: 0, y: 1.2, z: 0 }
};

export const PILLAR_POSITIONS = {
  CAPITAL:        { x: -6, y: 0, z: -3 },
  INFRASTRUCTURE: { x:  0, y: 0, z: -5 },
  GROWTH:         { x:  6, y: 0, z: -3 }
};