import mitt from 'mitt';

type Events = {
  'show-nav-bar': boolean,
  'hide-nav-bar': boolean,
  'set-nav-bar': NavBarProps,
};

export const eventBus = mitt<Events>();
