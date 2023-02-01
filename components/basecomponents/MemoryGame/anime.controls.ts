 // type AnimeParams = _anime.AnimeAnimParams & {
  //   reset?: _anime.AnimeCallBack;
  // };

  // let animations: _anime.AnimeInstance[] = [];
  // const anime = (params: AnimeParams) => {
  //   const animation = _anime({
  //     ...params,
  //     begin: (anim) => {
  //       animations.push(anim);
  //       console.log(`begin: animations stored: ${animations.length}`);
  //       if (params.begin) params.begin(anim);
  //     },
  //     complete: (anim) => {
  //       animations = animations.filter((item) => anim !== item);
  //       console.log(`complete: animations stored: ${animations.length}`);
  //       if (params.complete) params.complete(anim);
  //     },
  //   });
  //   return animation;
  // };
  // const pauseAnimations = () => {
  //   console.log(`pause: animations stored: ${animations.length}`);
  //   animations.map((anim) => anim.pause());
  //   animations = [];
  // };