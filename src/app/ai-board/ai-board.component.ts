import { Component, OnInit } from '@angular/core';
import {AiService} from '../shared/ai.service';
import { CheckWinner } from '../shared/ai.service'
import { UiService } from '../shared/ui.service';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-ai-board',   
  templateUrl: './ai-board.component.html',
  styleUrls: ['./ai-board.component.css']
})
export class AiBoardComponent implements OnInit {
  blocks: string[] = [];
  playerSymbol = 'O';
  aiMove: number[];
  clickEnable = true;
  // checkWinner: CheckWinner
  player = this.auth.userInfo().email;

  constructor(private aiService: AiService, private uiService: UiService, private auth: AuthService, private checkWinner: CheckWinner) { }

  ngOnInit() {
    this.blocks = this.aiService.state;
    console.log(this.blocks);
  }

  restartGame() {
    for (let i = 0; i < 9; i++) {
      this.blocks[i] = null;
    }
    this.clickEnable = true;
  }

  onPlayerClick(position: number) {
    // CHECK IF THERE ARE AVAILABLE MOVES OR WINNERS AFTER HOMAN MAKES A MOVE
    if (this.blocks[position]) {
      this.uiService.showSnackBar(`You cannot play this block`, null, 5000);
    } else {

      if (this.clickEnable) {
        this.blocks[position] = this.playerSymbol;
        this.aiService.state = this.blocks;
        if(this.checkWinner.hasMoves(this.blocks) == false)
        {
          // DO SOMETHING TO DISPLAY DRAW
          this.uiService.showSnackBar(`You Game is a draw`, null, 5000);
        }
  
        if(this.checkWinner.returnWinner(this.blocks) != "nowinner")
        {
          // DO SOMETHING TO DISPLAY HUMAN WON
          this.uiService.showSnackBar(`You have Won ${this.player}`, null, 5000);
          this.clickEnable = false;                   
        }
  
  
        // END CHECK IF HUMAN WON OR HUMAN HAD LAST MOVE

        this.aiService.aisign = 'X';
        this.aiService.humansign = 'O';
        this.aiMove = this.aiService.minimax(this.blocks,'X');
        console.log(this.aiMove);
        this.blocks[this.aiMove[0]] = 'X';
        // CHECK IF THERE ARE AVAILABLE MOVES OR WINNERS AFTER AI MAKES A MOVE
        if(this.checkWinner.hasMoves(this.blocks) == false)
        {
          // DO SOMETHING TO DISPLAY DRAW
          this.uiService.showSnackBar(`You Game is a draw`, null, 5000);
        }

        if(this.checkWinner.returnWinner(this.blocks) != "nowinner")
        {
          // DO SOMETHING TO AI WON
          this.uiService.showSnackBar(`You loose Human! AI Agent won!`, null, 5000);
          this.clickEnable = false;
        }
      }
     
    }                
    // END CHECK IF AI WON OR AI HAD LAST MOVE
  }

}