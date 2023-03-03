import anime from 'animejs';

export const animation = {
  select: (ref: HTMLElement) =>
    anime({
      targets: ref,
      duration: 200,
      opacity: 0.5,
      easing: 'easeInOutCubic',
      direction: 'alternate',
    }),
  selectCorrect: (ref: HTMLElement) =>
    anime({
      targets: ref,
      duration: 600,
      background: 'hsl(50, 100%, 50%)',
      color: 'hsl(50, 100%, 25%)',
      easing: 'easeInOutCubic',
    }),
  selectWrong: (ref: HTMLElement) =>
    anime({
      targets: ref,
      duration: 600,
      background: 'hsl(0, 0%, 40%)',
      easing: 'easeInOutCubic',
    }),
  play: (ref: HTMLElement) =>
    anime({
      targets: ref,
      duration: 200,
      opacity: 0.5,
      easing: 'easeInOutCubic',
      direction: 'alternate',
      loop: true,
    }),
  fade: (ref: HTMLElement, duration = 600) =>
    anime({
      targets: ref,
      duration,
      opacity: 0,
      easing: 'easeInOutSine',
    }),
  show: (ref: HTMLElement, duration = 600) =>
    anime({
      targets: ref,
      duration,
      opacity: 1,
      easing: 'easeInOutSine',
    }),
};
