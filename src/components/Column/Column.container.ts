import { BoardCards, Card, StoreState } from '../../types';
import { getVal, getFirebase } from 'react-redux-firebase';
import { OwnColumnProps, StateColumnProps } from './Column';
import { getTheme } from '../../constants/Retrospective';
import { Key } from 'ts-keycode-enum';
import Raven = require('raven-js');
import { get } from 'lodash';

function sortCards(cards: Card[], sortByVotes: boolean): Card[] {
  const compareTimestamps = (a: Card, b: Card) => {
    if (a.timestamp > b.timestamp) {
      return 1;
    } else if (a.timestamp < b.timestamp) {
      return -1;
    } else {
      return 0;
    }
  };

  if (sortByVotes) {
    return cards
      .sort((a, b) => {
        if (a.votes > b.votes) {
          return 1;
        } else if (a.votes < b.votes) {
          return -1;
        } else {
          return compareTimestamps(a, b);
        }
      })
      .reverse();
  } else {
    return cards.sort(compareTimestamps).reverse();
  }
}

export const mapStateToProps = (
  state: StoreState,
  ownProps: OwnColumnProps
): StateColumnProps => {
  const user = getVal(state.fbState, 'auth', undefined);
  const isAdmin =
    getVal(
      state.fbState,
      `data/${ownProps.boardUrl}/config/creatorUid`,
      undefined
    ) === user.uid;

  const boardCards: BoardCards = getVal(
    state.fbState,
    `data/${ownProps.boardUrl}/cards`,
    {}
  );

  const focusedCardId: string = getVal(
    state.fbState,
    `data/${ownProps.boardUrl}/config/focusedCardId`,
    undefined
  );

  if (!focusedCardId) {
    window.onkeydown = () => {};
  }

  let focusTarget = undefined;

  const focusedCard = boardCards[focusedCardId];
  let focused: Card | undefined = undefined;
  if (focusedCard) {
    if (focusedCard.type === ownProps.column.id) {
      focused = focusedCard;
      focused.id = focusedCardId;
    }
    focusTarget = get(
      ownProps.phase.columns.find(column => column.id === focusedCard.type),
      'focus.column'
    );
  }

  const showAsFocusTarget = focusedCard
    ? ownProps.column.id === focusTarget
    : false;
  const isFocusOrigin = focusedCard
    ? focusedCard.type === ownProps.column.id
    : false;

  const isHidden = focusedCard ? !isFocusOrigin && !showAsFocusTarget : false;
  const isExtended = focusedCard
    ? isFocusOrigin && ownProps.column.id !== focusTarget
    : false;

  let cards: Card[] = Object.keys(boardCards)
    .map(key => {
      return { id: key, ...boardCards[key] };
    })
    .filter(card => card.type === ownProps.column.id)
    .filter(card => !Boolean(card.parent));
  cards = sortCards(cards, ownProps.column.sorted);

  let cardsWithFocused: Card[] = Object.keys(boardCards)
    .map(key => {
      return { id: key, ...boardCards[key] };
    })
    .filter(card => card.type === ownProps.column.id)
    .filter(
      card =>
        !Boolean(card.parent) || (focused && card.id === (focused as Card).id)
    );
  cardsWithFocused = sortCards(cardsWithFocused, ownProps.column.sorted);

  function onFocusCard(cardId: string | null) {
    getFirebase()
      .ref(`${ownProps.boardUrl}/config/focusedCardId`)
      .set(cardId)
      .catch((err: Error) => {
        Raven.captureMessage('Could not set focus on card', {
          extra: {
            reason: err.message,
            uid: user.uid,
            boardId: ownProps.boardUrl,
            cardId
          }
        });
      });
  }

  if (focused && focused.type === ownProps.column.id) {
    const isFocusedStacked = cards.length !== cardsWithFocused.length;
    const stackToSearch = isFocusedStacked ? cardsWithFocused : cards;

    let index = stackToSearch.findIndex((card: Card) => {
      return card.id === (focused as Card).id;
    });

    if (state.app.keyboardNavigationEnabled) {
      window.onkeydown = (ev: KeyboardEvent) => {
        if (isAdmin) {
          // on escape
          if (ev.keyCode === Key.Escape) {
            if (document.getElementById('portal')!.children.length === 0) {
              onFocusCard(null);
              ev.preventDefault();
            }
          }

          // on arrow up
          if (ev.keyCode === Key.UpArrow) {
            if (index > 0) {
              onFocusCard(cards[index - 1].id as string);
              ev.preventDefault();
            }
          }

          // on arrow down
          if (ev.keyCode === Key.DownArrow) {
            if (index < cards.length - 1) {
              onFocusCard(cards[index + (isFocusedStacked ? 0 : 1)]
                .id as string);
              ev.preventDefault();
            }
          }
        }
      };
    } else {
      window.onkeydown = () => {};
    }
  }

  const theme = getTheme(ownProps.column.type);

  return {
    theme,
    cards,
    focused,
    isHidden,
    isExtended
  };
};
