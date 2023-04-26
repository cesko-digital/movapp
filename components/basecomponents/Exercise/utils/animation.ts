import anime from 'animejs';

export const animation = {
  click: (ref: HTMLElement) =>
    anime({
      targets: ref,
      duration: 150,
      scale: 0.9,
      easing: 'easeInOutSine',
      direction: 'alternate',
    }),
  selectCorrect: (ref: HTMLElement) =>
    anime({
      targets: ref,
      duration: 600,
      background: 'hsl(86, 100%, 50%)',
      easing: 'easeInOutSine',
    }),
  selectWrong: (ref: HTMLElement) =>
    anime({
      targets: ref,
      duration: 600,
      background: 'hsl(0, 0%, 80%)',
      easing: 'easeInOutSine',
    }),
  breathe: (ref: HTMLElement) =>
    anime({
      targets: ref,
      duration: 600,
      opacity: 0.7,
      easing: 'easeInOutSine',
      direction: 'alternate',
      loop: true,
    }),
  fade: (ref: HTMLElement, duration = 600, delay = 0) =>
    anime({
      targets: ref,
      duration,
      delay,
      opacity: 0,
      easing: 'easeInOutSine',
    }),
  show: (ref: HTMLElement, duration = 600, delay = 0) =>
    anime({
      targets: ref,
      duration,
      delay,
      opacity: 1,
      easing: 'easeInOutSine',
    }),
};
