/* eslint-disable */
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from 'components/basecomponents/Button';
import { useTranslation } from 'next-i18next';
import Card from './MemoryGameCard';
import { TranslationJSON } from 'utils/Phrase';
import { getCountryVariant } from 'utils/locales';
import phrases_CS from './memory-game-cs.json';
import phrases_PL from './memory-game-pl.json';
import phrases_SK from './memory-game-sk.json';
import createTimer from './createTimer';
import usePlayPhrase from './usePlayPhrase';
import { AudioPlayer } from 'utils/AudioPlayer';
import { Phrase } from 'utils/Phrase';

const player = new Audio();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getRandomElement = <Type,>(arr: Type[]): Type => arr[Math.floor(Math.random() * arr.length)];

const addBackroundColor = (cardsData: Record<string, unknown>[]) =>
  cardsData.map((item, i) => ({ ...item, color: `hsl(${(360 / cardsData.length) * i},50%,50%)` }));

const GAME_NARRATION_PHRASES = {
  cs: phrases_CS,
  sk: phrases_SK,
  pl: phrases_PL,
};

const phrases = GAME_NARRATION_PHRASES[getCountryVariant()];

enum Scene {
  init = 'init',
  begin = 'begin',
  game = 'game',
  firstCardSelected = 'firstCardSelected',
  secondCardSelected = 'secondCardSelected',
  resolveCards = 'resolveCards',
  cardsMatch = 'cardsMatch',
  cardsMatchReward = 'cardsMatchReward',
  cardsDontMatch = 'cardsDontMatch',
  cardsDontMatchFlipBack = 'cardsDontMatchFlipBack',
  win = 'win',
  winReward = 'winReward',
  goNewGame = 'goNewGame',
}

export type CardData = {
  image: string;
  translation: TranslationJSON;
};

export type Card = CardData & {
  id: number;
  flipped: boolean;
  color: string;
};

interface MemoryGameProps {
  audio: {
    cardFlipSound: string;
    cardsMatchSound: string;
    winMusic: string;
  };
  styles: Record<string, string>;
  cardsData: CardData[];
  cardBackImage: string;
}

const MemoryGame = ({ cardsData, audio, styles, cardBackImage }: MemoryGameProps) => {
  const { playCardPhraseOtherLang, playCardPhraseCurrentLang, playPhraseRandomLang } = usePlayPhrase();
  const { t } = useTranslation();

  const [cards, setCards] = useState<Card[]>([]);

  interface SelectedCards {
    first: Card | null;
    second: Card | null;
  }

  const [selectedCards, setSelectedCards] = useState<SelectedCards>({ first: null, second: null });

  const isSelected = (card: Card) =>
    (selectedCards.first !== null && card.id === selectedCards.first.id) ||
    (selectedCards.second !== null && card.id === selectedCards.second.id);

  const [scene, setScene] = useState<Scene>(Scene.init);
  const [controlsDisabled, setControlsDisabled] = useState<boolean>(true);
  const [setTimer, clearTimers] = useMemo(createTimer, []);

  const { cardFlipSound, cardsMatchSound, winMusic } = useMemo(() => {
    const cardFlipSound = new Audio(audio.cardFlipSound);
    cardFlipSound.volume = 0.2;

    const cardsMatchSound = new Audio(audio.cardsMatchSound);
    cardsMatchSound.volume = 0.1;

    const winMusic = new Audio(audio.winMusic);
    winMusic.volume = 0.8;

    return {
      cardFlipSound,
      cardsMatchSound,
      winMusic,
    };
  }, []);

  const newGame = () => {
    console.log('new game');
    // prepare and shuffle cards, pick 8 cards
    const pickedCards = cardsData.sort(() => Math.random() - 0.5).slice(0, 8);
    const coloredCards = addBackroundColor(pickedCards) as (CardData & { color: string })[];

    setCards(
      [...coloredCards, ...coloredCards]
        .sort(() => Math.random() - 0.5)
        .map((card) => ({ ...card, image: `/kids/${card.image}.svg`, id: Math.random(), flipped: false }))
    );
    setSelectedCards({ first: null, second: null });
    // clearTimers();
  };

  const flipCard = (cardToFlip: Card) => {
    setCards((cards) => cards.map((card) => (card.id === cardToFlip.id ? { ...card, flipped: !card.flipped } : card)));
    cardFlipSound.play();
  };

  const selectCard = (card: Card) => {
    if (controlsDisabled) return;

    // Test debug
    playPhraseRandomLang(getRandomElement(phrases.good));

    const { first, second } = selectedCards;
    if (first === null && !card.flipped) {
      setSelectedCards({ ...selectedCards, first: card });
    } else if (second === null && !card.flipped) {
      setSelectedCards({ ...selectedCards, second: card });
    }
  };

  // handle selected cards
  useEffect(() => {
    const { first, second } = selectedCards;

    const bothCardsSelected = first !== null && second !== null;

    if (bothCardsSelected) {
      setScene(Scene.secondCardSelected);
      return;
    }
    if (first !== null) {
      setScene(Scene.firstCardSelected);
    }
  }, [selectedCards]);

  const playTTSAsync = () => {
    const sound = AudioPlayer.getInstance().getGoogleTTSAudio(new Phrase(phrases_CS.good[0]).getTranslation('uk'), 'uk');    
    return new Promise<void>((resolve) => {
      sound.oncanplay = () => {
        sound.play().catch(resolve);
      }
      sound.onerror = () => {        
        resolve();
      };
      sound.onabort = () => {        
        resolve();
      };
      sound.onpause = () => resolve();
      sound.onended = () => resolve();
    });
  }

  const changeScene = (scene: Scene) => {
    setScene(scene);    
    sceneActions[scene]();
  }

  const sceneActions: Record<Scene, () => void> = useMemo(()=>({
    init: () => {
      // begin new game automaticaly
      //setScene(Scene.begin);
    },
    begin: () => {
      player.src = audio.cardsMatchSound;
      player.play();
      setTimeout(()=>{
        player.src = audio.cardFlipSound;
        player.play();
      },2000);
    },
    game: () => {        
      player.src = audio.cardsMatchSound;
      player.play();
      player.onended = ()=> {
        player.src = audio.cardFlipSound;
        player.onended = () => {};
        player.play();
      };
    },
    firstCardSelected: () => {
      player.src = audio.cardsMatchSound;
      player.play();
      setTimeout(()=>{
        player.src = audio.cardFlipSound;
        player.play();
      },500);
    },
    secondCardSelected: () => {      
      setTimeout(() => changeScene(Scene.begin), 1500);
    },
    resolveCards: () => {
      cardsMatchSound.play();
    },
    cardsMatch: () => {
      AudioPlayer.getInstance().playTextToSpeech(new Phrase(phrases_CS.good[0]).getTranslation('uk'), 'uk');
      cardsMatchSound.play();
    },
    cardsMatchReward: async () => {
      await delay(1500);        
      await playTTSAsync();
      console.log("***");     
    },
    cardsDontMatch: () => {
      setTimeout(() => AudioPlayer.getInstance().playTextToSpeech(new Phrase(phrases_CS.good[0]).getTranslation('uk'), 'uk'), 1500);
      cardsMatchSound.play();
    },
    cardsDontMatchFlipBack: () => {
      // // wait for cards flip back
      // setTimer(() => {
      //   setScene(Scene.game);
      // }, 300);
    },
    win: () => {
      // // disable controls
      // setControlsDisabled(true);
      // // play css animations and sounds
      // playPhraseRandomLang(getRandomElement(phrases.win)).then(() => {
      //   setScene(Scene.winReward);
      // });
    },
    winReward: () => {
      // // play css animations and sounds
      // winMusic.play();
    },
    goNewGame: () => {
      // clearTimers();
      // // play css animations and sounds
      // playPhraseRandomLang(getRandomElement(phrases.newGame));
      // setTimer(() => {
      //   setScene(Scene.begin);
      // }, 500);
    },
  }),[]);

  

  // // resolve game states
  // useEffect(() => {
  //   const sceneActions: Record<Scene, () => void> = {
  //     init: () => {
  //       // begin new game automaticaly
  //       //setScene(Scene.begin);
  //     },
  //     begin: () => {
  //       AudioPlayer.getInstance().playTextToSpeech(new Phrase(phrases_CS.good[0]).getTranslation('uk'), 'uk');        
  //     },
  //     game: () => {        
  //       setTimer(() => AudioPlayer.getInstance().playTextToSpeech(new Phrase(phrases_CS.good[0]).getTranslation('uk'), 'uk'), 1500);
  //     },
  //     firstCardSelected: () => {       
  //       playTTSAsync();
  //     },
  //     secondCardSelected: () => {
  //       setTimer(() => setScene(Scene.begin), 1500);
  //     },
  //     resolveCards: () => {
  //       cardsMatchSound.play();
  //     },
  //     cardsMatch: () => {
  //       AudioPlayer.getInstance().playTextToSpeech(new Phrase(phrases_CS.good[0]).getTranslation('uk'), 'uk');
  //       cardsMatchSound.play();
  //     },
  //     cardsMatchReward: async () => {        
  //       await playTTSAsync();
  //       console.log("***");     
  //     },
  //     cardsDontMatch: () => {
  //       // disable controls
  //       setControlsDisabled(true);
  //       // play animations and sounds
  //       setTimeout(() => {
  //         if (Math.random() > 0.8) {
  //           playPhraseRandomLang(getRandomElement(phrases.wrong));
  //         }

  //         // setTimer: show cards for some time to remember then flip back
  //         const { first, second } = selectedCards;
  //         flipCard(first!);
  //         flipCard(second!);
  //         setSelectedCards({ first: null, second: null });
  //         setScene(Scene.cardsDontMatchFlipBack);
  //       }, 1000);
  //     },
  //     cardsDontMatchFlipBack: () => {
  //       // wait for cards flip back
  //       setTimer(() => {
  //         setScene(Scene.game);
  //       }, 300);
  //     },
  //     win: () => {
  //       // disable controls
  //       setControlsDisabled(true);
  //       // play css animations and sounds
  //       playPhraseRandomLang(getRandomElement(phrases.win)).then(() => {
  //         setScene(Scene.winReward);
  //       });
  //     },
  //     winReward: () => {
  //       // play css animations and sounds
  //       winMusic.play();
  //     },
  //     goNewGame: () => {
  //       clearTimers();
  //       // play css animations and sounds
  //       playPhraseRandomLang(getRandomElement(phrases.newGame));
  //       setTimer(() => {
  //         setScene(Scene.begin);
  //       }, 500);
  //     },
  //   };
  //   console.log(`scene is: ${scene}`);
  //   // run scene actions
  //   sceneActions[scene]();
  // }, [scene]);

  // clear timers on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  const playTimeout = (snd: HTMLAudioElement) => setTimeout(() => snd.play(), 1500);
  
  return (
    <div className={styles.app}>
      {/* <Button className={styles.newGameButton} text="sound.play()" onClick={() => cardsMatchSound.play()} />
      <Button className={styles.newGameButton} text="setTimeout=>sound.play()" onClick={() => setTimeout(() => cardsMatchSound.play(),1500)} />
      <Button className={styles.newGameButton} text="playSoundAsync" onClick={async () => {await delay(1500); cardsMatchSound.play()}} />
      <Button className={styles.newGameButton} text="playTTSAsync" onClick={playTTSAsync} /> */}
      <Button className={styles.newGameButton} text="changeScene-player-setTimeout-long" onClick={() => changeScene(Scene.begin)} />
      <Button className={styles.newGameButton} text="changeScene-player-setTimeout-short" onClick={() => changeScene(Scene.firstCardSelected)} />
      <Button className={styles.newGameButton} text="changeScene-player-onended" onClick={() => changeScene(Scene.game)} />
      {/* <Button className={styles.newGameButton} text="changeScene-playTTSasync" onClick={() => changeScene(Scene.firstCardSelected)} /> */}
      {/* <Button className={styles.newGameButton} text="changeScene=>changeScene-playTTS" onClick={() => changeScene(Scene.secondCardSelected)} /> */}
      {/* <Button className={styles.newGameButton} text="changeScene=>sound.play()" onClick={() => changeScene(Scene.resolveCards)} /> */}
      {/* <Button className={styles.newGameButton} text="changeScene=>playTTS; sound.play()" onClick={() => changeScene(Scene.cardsMatch)} /> */}
      {/* <Button className={styles.newGameButton} text="changeScene=>await playTTSasync" onClick={() => changeScene(Scene.cardsMatchReward)} /> */}
      {/* <Button className={styles.newGameButton} text="changeScene=>playTTS-setTimeout; sound.play()" onClick={() => changeScene(Scene.cardsDontMatch)} />        */}
    </div>
  );
};

export default MemoryGame;
