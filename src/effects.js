import {effects} from 'ferp';

export const delay = (action, ms = 250) => {
  return effects.defer((done) => setTimeout(() => done(effects.act(action)), ms))
}

