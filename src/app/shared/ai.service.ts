/*
THIS FILE HOLDS : AI , CheckWinner
QUICK HOW TO USE:
  check for winner:
      var winner = new CheckWinner(state).returnWinner();
  check if there are available moves:
      var winner = new CheckWinner(state).hasMoves();
  make ai move:
      var aiMove = new AI(state, ai_sigh).getMove();
For more details look at comments surrounding the class you need help with.
If you have any specific question, email me at ovcina2m@uregina.ca or text me at 306 591 1260..
*/


import { Injectable } from '@angular/core';
@Injectable()
export class CheckWinner
{

  // return true if there exists at least one tile that is empty
  // otherwise, return false...
  // TO CHANGE WHAT IS RETURNED< CHANGE return true/false TO WHATEVER YOU NEED
  hasMoves(state: any)
  {
    for (let i of state)
    {
      if (i === null )
      {
        return true;
      }
    }
    return false;
  }
  // returns sign of winner. If, for example, X has 3 tiles in any winnin position, X will be returned
  // If there is no winning combination or a draw, nowinner will be returned..
  // TO CHANGE WHAT IS RETURNED< CHANGE no_winner VARIABLE //
  returnWinner(state: any)
  {


    /*
      _______
     |x x x|
     |     |
     |_____|
     */
    if ((state[0] != null) && (state[0] == state[1]) && (state[1] == state[2]) && (state[0] == state[2]))
    {
      return state[0];
    }

    /*
   _______
   |     |
   |x x x|
   |_____|
   */
    if(state[3] != null && (state[3] == state[4]) && (state[4] == state[5]) && (state[5] == state[3]))
    {
      return state[3];
    }

    /*
     _______
    |     |
    |     |
    |x x x|
   */
    if(state[6] != null && (state[6] == state[7]) && (state[7] == state[8]) && (state[8] == state[6]))
    {
      return state[6];
    }

    /*
    _______
    |x    |
    |x    |
    |x____|
    */
    if(state[0] != null && (state[0] == state[3]) && (state[3] == state[6]) && (state[6] == state[0]))
    {
      return state[0];
    }

    /*
  _______
  |  x  |
  |  x  |
  |__x__|
  */
    if(state[1] != null && (state[1] == state[4]) && (state[4] == state[7]) && (state[7] == state[1]))
    {
      return state[1];
    }

    /*
     _______
     |    x|
     |    x|
     |____x|
     */
    if(state[2] != null && (state[2] == state[5]) && (state[5] == state[8]) && (state[8] == state[2]))
    {
      return state[2];
    }

    /*
   _______
   |x    |
   |  x  |
   |____x|
   */
    if(state[0] != null && (state[0] == state[4]) && (state[4] == state[8]) && (state[8] == state[0]))
    {
      return state[0];
    }

    /*
    _______
    |    x|
    |  x  |
    |x____|
    */
    if(state[2] != null && (state[2] == state[4]) && (state[4] == state[6]) && (state[6] == state[2]))
    {
      return state[2];
    }

    // if at this point, there is no winner, return no winner
    return 'nowinner';
  }

}

@Injectable()
export class AiService {
  state: string[] = [];
  initturn: string;
  position: number;
  score: number;
  aisign: string;
  humansign: string;
  Nmove: number;

  constructor() {
    this.populateBlocks(this.state);
    this.score = 1;
    this.position = 0;
    this.aisign = this.initturn;
    this.Nmove = 1;
    if (this.aisign === 'X') {
      this.humansign = 'X';
    } else {
      this.humansign = 'O';
    }
  }

  populateBlocks(state) {
    for (let i = 0; i < 9; i++) {
      state[i] = null;
    }
  }

  getMove()
  {


    if (this.isFirstNMoves() <= this.Nmove)
    {
      const firstTwoMoves = this.assignFirstNMoves();
      if (firstTwoMoves !== -1)
      {
        return firstTwoMoves;
      }
    }
    // After this AI takes over
    let bestMove = this.minimax(this.state , 'O');

    return bestMove[this.position];

  }


  minimax(state: string[], player: string)
  {
    // Hold alailabe moves at each level of recursion
    // move val is a 2d array with first index [x][] pointing to moves array
    // all_moves array holds position and score of move
    // structure looks like this
    // move_val[][] = {all_moves, all_moves .... };
    // all_moves[] = {position = x, score  = x};
    // Combined view
    // {{position = x, score = x} ,{position = x, score = x} .... }
    let move_val: number[] = new Array(2);
    let all_moves: number[][] = new Array();

    // Check the state of game
    let move_state = new  CheckWinner();
    let winner = move_state.returnWinner(state);
    let moves = move_state.hasMoves(state);

    // Begin base case
    // If its my turn and I worn, return +10, position do not care
    if (winner === this.aisign) {
      move_val[this.score] = 10;
      return move_val;
    }
    // If opponenets turn and they won, return -10, position do not care
    if (winner === this.humansign) {
      move_val[this.score] = -10;
      return move_val;
    }
    // If there are no more moves and no winners, return 0, position do not care
    if (!moves) {
      move_val[this.score] = 0;
      return move_val;
    }


    for (let i = 0; i < state.length; i++){
      if (state[i] == null) {
        state[i] = player;
        if (player === 'X') {
          move_val = this.minimax(state, 'O');
        } else {
          move_val = this.minimax(state, 'X');
        }

        move_val[this.position] = i;
        state[i] = null;

        // push new move into array
        all_moves.push(move_val);
      }
    }

    let best_move_pos = -1;
    let temp_score;

    if (player === 'O') {
      temp_score = 10000;
      for (let i = 0; i < all_moves.length; i++) {
        if (all_moves[i][this.score] < temp_score)
        {
          temp_score = all_moves[i][this.score];
          best_move_pos = i;
        }
      }
    }

    if (player === 'X') {
      temp_score = -10000;
      for (let i = 0; i < all_moves.length; i++) {
        if (all_moves[i][this.score] > temp_score) {
          temp_score = all_moves[i][this.score];
          best_move_pos = i;
        }
      }
    }
    return all_moves[best_move_pos];
  }

  // Return number of assigned tiles
  private isFirstNMoves()
  {
    let numMoves = 0;
    for (let i of this.state)
    {
      if (i != null)
      {
        numMoves++;
      }
    }
    return numMoves;
  }

  private assignFirstNMoves()
  {
    const possibles = [4, 0, 2, 8, 6];
    for (let i = 0; i < possibles.length; i++)
    {
      if (this.state[possibles[i]] == null)
      {
        return possibles[i];
      }
    }
    // if for some reason execution ges here return -1
    return -1;
  }

}


