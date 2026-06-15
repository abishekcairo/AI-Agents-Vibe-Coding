export type ParticleType = 'snowflake' | 'balloon';

export interface BaseParticle {
  id: string;
  type: ParticleType;
  x: number; // percentage across window width: 0 to 100
  size: number; // diameter/dimension in px
  speed: number; // speed multiplier
  delay: number; // spawn delay in ms
  opacity: number;
}

export interface SnowflakeParticle extends BaseParticle {
  type: 'snowflake';
  driftSpeed: number; // side-to-side sway
  rotationSpeed: number;
}

export interface BalloonParticle extends BaseParticle {
  type: 'balloon';
  color: string;
  swaySpeed: number;
  swayAmplitude: number;
  hasString: boolean;
}

export type Particle = SnowflakeParticle | BalloonParticle;
