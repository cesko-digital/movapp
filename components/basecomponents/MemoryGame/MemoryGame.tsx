import React, { useState, useEffect, useMemo } from 'react';
import { Button } from 'components/basecomponents/Button';
import { useTranslation } from 'next-i18next';
import Card from './MemoryGameCard';
import { AudioPlayer } from 'utils/AudioPlayer';
import { useLanguage } from 'utils/useLanguageHook';
import { Phrase } from 'utils/Phrase';
import phrases from './MemoryGamePhrases.json';
import createTimer from './createTimer';

const getRandomElement = <Type,>(arr: Type[]): Type => arr[Math.floor(Math.random() * arr.length)];

export interface TranslationType {
  main: string;
  uk: string;
}

export interface CardDataType {
  image: string;
  translation: TranslationType;
  backgroundColor?: string;
}

export interface CardType {
  id: number;
  flipped: boolean;
  image: string;
  translation: TranslationType;
  color?: string;
}

interface MemoryGameProps {
  cardsData: CardDataType[];
}

const addBackroundColor = (cardsData: CardDataType[]) => {
  return cardsData.map((item, i) => ({ ...item, color: `hsl(${(360 / cardsData.length) * i},50%,50%)` }));
};

enum Scenes {
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

const cardFlipSound = new Audio('/kids/card_flip.mp3');
cardFlipSound.volume = 0.2;

const cardsMatchSound = new Audio('/kids/reward_sfx.mp3');
cardsMatchSound.volume = 0.25;

const winMusic = new Audio('/kids/reward_song.mp3');
winMusic.volume = 0.8;

const MemoryGame = ({ cardsData }: MemoryGameProps) => {
  const { currentLanguage, otherLanguage } = useLanguage();
  const { t } = useTranslation();

  const [cards, setCards] = useState<CardType[]>([]);

  interface SelectedCards {
    first: CardType | null;
    second: CardType | null;
  }

  const [selectedCards, setSelectedCards] = useState<SelectedCards>({ first: null, second: null });

  const isSelected = (card: CardType) =>
    (selectedCards.first !== null && card.id === selectedCards.first.id) ||
    (selectedCards.second !== null && card.id === selectedCards.second.id);

  const [scene, setScene] = useState<Scenes>(Scenes.init);
  const [controlsDisabled, setControlsDisabled] = useState<boolean>(true);
  const [setTimer, clearTimers] = useMemo(createTimer, []);

  const newGame = () => {
    console.log('new game');
    // prepare and shuffle cards, pick 8 cards
    const pickedCards = cardsData.sort(() => Math.random() - 0.5).slice(0, 8);

    const coloredCards = addBackroundColor(pickedCards);
    setCards(
      [...coloredCards, ...coloredCards]
        .sort(() => Math.random() - 0.5)
        .map((card) => ({ ...card, image: `/kids/${card.image}.svg`, id: Math.random(), flipped: false }))
    );
    setSelectedCards({ first: null, second: null });
    // clearTimers();
  };

  const playCardWordOtherLang = (card: CardType) =>
    AudioPlayer.getInstance().playTextToSpeech(new Phrase(card.translation).getTranslation(otherLanguage), otherLanguage);
  const playCardWordCurrentLang = (card: CardType) =>
    AudioPlayer.getInstance().playTextToSpeech(new Phrase(card.translation).getTranslation(currentLanguage), currentLanguage);
  const playPhraseOtherLang = (phrase: TranslationType) =>
    AudioPlayer.getInstance().playTextToSpeech(new Phrase(phrase).getTranslation(otherLanguage), otherLanguage);
  const playPhraseCurrentLang = (phrase: TranslationType) =>
    AudioPlayer.getInstance().playTextToSpeech(new Phrase(phrase).getTranslation(currentLanguage), currentLanguage);
  const playPhraseRandomLang = (phrase: TranslationType) =>
    Math.random() < 0.5 ? playPhraseOtherLang(phrase) : playPhraseCurrentLang(phrase);

  const flipCard = (cardToFlip: CardType) => {
    setCards((cards) => cards.map((card) => (card.id === cardToFlip.id ? { ...card, flipped: !card.flipped } : card)));
    cardFlipSound.play();
  };

  const selectCard = (card: CardType) => {
    if (controlsDisabled) return;

    const { first, second } = selectedCards;
    if (first === null && !card.flipped) {
      setSelectedCards((prev) => ({ ...prev, first: card }));
    } else if (second === null && !card.flipped) {
      setSelectedCards((prev) => ({ ...prev, second: card }));
    }
  };

  // handle selected cards
  useEffect(() => {
    const { first, second } = selectedCards;

    const bothCardsSelected = first !== null && second !== null;

    if (bothCardsSelected) {
      setScene(Scenes.secondCardSelected);
      return;
    }
    if (first !== null) {
      setScene(Scenes.firstCardSelected);
    }
  }, [selectedCards]);

  // resolve game states
  useEffect(() => {
    const phraseMaxLength = 2000;
    const sceneActions: { [index: string]: () => void } = {
      init: () => {
        // begin new game automaticaly
        setScene(Scenes.begin);
      },
      begin: () => {
        // new game
        newGame();
        // disable controls
        setControlsDisabled(true);
        // play css animations
        setTimer(() => {
          setScene(Scenes.game);
        }, 1000);
      },
      game: () => {
        // enable controls
        setControlsDisabled(false);
      },
      firstCardSelected: () => {
        // disable controls
        setControlsDisabled(true);
        // play css animations and sounds
        const { first: card } = selectedCards;
        flipCard(card!); // 0.3s
        playCardWordOtherLang(card!); // cca 1.2s
        // go back to game scene when card phrase ends
        setTimer(() => {
          setScene(Scenes.game);
        }, 600); // reduced for fastrer UX
      },
      secondCardSelected: () => {
        // disable controls
        setControlsDisabled(true);
        // play css animations and sounds
        const { second: card } = selectedCards;
        flipCard(card!); // 0.3s
        playCardWordCurrentLang(card!); // cca 1.2s
        // resolve cards when card phrase ends
        setTimer(() => {
          setScene(Scenes.resolveCards);
        }, phraseMaxLength);
      },
      resolveCards: () => {
        const { first, second } = selectedCards;
        const cardsMatch = first?.image === second?.image;

        if (cardsMatch) {
          console.log('cards match');
          setScene(Scenes.cardsMatch);
        } else {
          console.log('cards dont match');
          setScene(Scenes.cardsDontMatch);
        }
      },
      cardsMatch: () => {
        // disable controls
        setControlsDisabled(true);
        // play css animations and sounds
        // cardsMatch animation 0.7s
        setTimer(() => cardsMatchSound.play(), 100); // sync to animation

        setTimer(() => {
          setScene(Scenes.cardsMatchReward);
        }, 700);
      },
      cardsMatchReward: () => {
        let delay = 700;
        // play css animations and sounds
        if (Math.random() > 0.5) {
          delay = phraseMaxLength; // extend delay to phrase max length
          playPhraseRandomLang(getRandomElement(phrases.good));
        }
        // reset selected cards
        setSelectedCards({ first: null, second: null });
        // check win
        setTimer(() => {
          if (cards.every((card) => card.flipped)) {
            console.log('win');
            setScene(Scenes.win);
          } else {
            setScene(Scenes.game);
          }
        }, delay);
      },
      cardsDontMatch: () => {
        let delay = 1200;
        // disable controls
        setControlsDisabled(true);
        // play animations and sounds
        if (Math.random() > 0.8) {
          delay = phraseMaxLength; // extend delay to phrase max length
          playPhraseRandomLang(getRandomElement(phrases.wrong));
        }
        // setTimer: show cards for a period of time to remember then flip back
        setTimer(() => {
          const { first, second } = selectedCards;
          flipCard(first!);
          flipCard(second!);
          setSelectedCards({ first: null, second: null });
          setScene(Scenes.cardsDontMatchFlipBack);
        }, delay);
      },
      cardsDontMatchFlipBack: () => {
        // wait for cards flip back
        setTimer(() => {
          setScene(Scenes.game);
        }, 300);
      },
      win: () => {
        // disable controls
        setControlsDisabled(true);
        // play css animations and sounds
        playPhraseRandomLang(getRandomElement(phrases.win));
        setTimer(() => {
          setScene(Scenes.winReward);
        }, phraseMaxLength);
      },
      winReward: () => {
        // play css animations and sounds
        winMusic.play();
      },
      goNewGame: () => {
        // play css animations and sounds
        clearTimers();
        playPhraseRandomLang(getRandomElement(phrases.newGame));
        setTimer(() => {
          setScene(Scenes.begin);
        }, 500);
      },
    };
    console.log(`scene is: ${scene}`);
    // run scene actions
    sceneActions[scene]();
  }, [scene]);

  // clear timers on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="py-5">
        <Button className="bg-primary-blue" text={t('utils.new_game')} onClick={() => setScene(Scenes.goNewGame)} />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => (
          <Card key={card.id} onClick={selectCard} card={card} scene={scene} selected={isSelected(card)} />
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
