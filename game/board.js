class Board {

  constructor() {
    this.players = []

    for (var i = 0; i <= 1; i++)
      this.players[i] = { id: i, mp: 3 }

    this.cards = []

    // this.history = []

    this.activePlayer = 0

    this._cardID = 0
  }

  copy() {
    var board = new Board()

    board.players = []

    for (var i = 0; i <= 1; i++)
      board.players[i] = this.players[i]

    board.cards = []

    for (var i = 0; i < this.cards.length; i++)
      board.cards[i] = this.cards[i]

    // board.history = []
    //
    // for (var i = 0; i < this.history.length; i++)
    //   board.history[i] = this.history[i]

    board.activePlayer = this.activePlayer

    board._cardID = this._cardID

    return board
  }

  addCard(card) {

    var board = this.copy()

    var card = { id: board._cardID++, type: card.type, player: card.player, state: card.state }

    board.cards.push(card)

    return board

  }


  addArmy(army, player) {

    var board = this.copy()

    for (var i = 0; i < army.length; i++)
      board = board.addCard({type:army[i].type, player: player, state: 'DECK'})

    return board
  }

  static newArmy() {
    var army = []

    for (var i = 1; i <= 5; i++) {
      army.push({ type: 'CARD_SPEARMAN'})
      army.push({ type: 'CARD_CROSSBOWMAN'})
    }

    for (var i = 1; i <= 2; i++)
      army.push({ type: 'CARD_KNIGHT'})

    return army
  }

  cardFitsCriteria(card, criteria) {
    var ok = true

    if (criteria != null) {
      if (criteria.hasOwnProperty('type')) {
        if (card.type != criteria.type)
          ok = false
      }

      if (criteria.hasOwnProperty('player')) {
        if (card.player != criteria.player)
          ok = false
      }

      if (criteria.hasOwnProperty('state')) {
        if (card.state != criteria.state)
          ok = false
      }

      if (criteria.hasOwnProperty('id')) {
        if (card.id != citeria.id)
          ok = false
      }

      return ok
    }
  }


  findCards(criteria) {
    var cards_found = []

    for (var i = 0; i < this.cards.length; i++) {
        if (this.cardFitsCriteria(this.cards[i], criteria))
          cards_found.push(i)
      }
      return cards_found
  }

  findCard(criteria) {
    for (var i = 0; i < this.cards.length; i++)
      if (this.cardFitsCriteria(cards[i], criteria))
        return i
    return null
  }

  // removeCards(criteria) {
  //
  //
  //   for (var i = 0; i < cards.length; i++){
  //     if (cardFitsCriteria(cards[i], criteria)) {
  //       cards.splice(i, 1)
  //       i--
  //     }
  //   }
  // }

  randomizeDeck(player) {
    var board = this.copy()

    var deck_cards = board.findCards({player:player, state: 'DECK'})

    var position = 0
    while (deck_cards.length > 0) {
      var index = Math.floor(Math.random() * deck_cards.length)

      board.cards[deck_cards[index]].position = position++

      deck_cards.splice(index, 1)
    }

    return board

  }

  drawCards(player, amount) {
    var cards_drawn = []

    var deck_cards = this.findCards({player: player, state: 'DECK'})
    deck_cards.sort((a, b) => this.cards[a].position - this.cards[b].position)

    var board = this.copy()

    var howManyCards = Math.min(deck_cards.length, amount)

    for (var i = 0; i < deck_cards.length; i++) {
      if (i < howManyCards)
        board.cards[deck_cards[i]].state = 'HAND'
      else
        board.cards[deck_cards[i]].position -= howManyCards
    }

    return board
  }



}

module.exports = Board