import { Component, OnInit } from '@angular/core';
import {AiService} from '../shared/ai.service';
import {UiService} from '../shared/ui.service';

@Component({
  selector: 'app-ai-board',
  templateUrl: './ai-board.component.html',
  styleUrls: ['./ai-board.component.css']
})
export class AiBoardComponent implements OnInit {
  blocks: string[];
  playerSymbol = 'O';
  aiMove: number;
  turn = 'O';
  constructor(private aiService: AiService, private uiService: UiService) { }

  ngOnInit() {
    this.blocks = this.aiService.state;
    this.aiService.aisign = 'X';
    this.aiService.humansign = 'O';
  }

  onPlayerClick(position: number) {
    if (this.turn !== 'O') {
      this.uiService.showSnackBar('You must wait for your turn!', null, 3000);
    } else {
      if (this.blocks[position]) {
        this.uiService.showSnackBar('This place is Already been use!, Pick Different one', null, 3000);
      } else {
        this.blocks[position] = this.playerSymbol;
        this.turn = 'X';
        this.aiService.state = this.blocks;
        this.aiMove = this.aiService.getMove();
        console.log(this.aiMove);
        this.blocks[this.aiMove] = 'X';
        if (this.aiMove === 10) {
          this.turn = '';
          this.uiService.showSnackBar('The AI won!!', null, 10000);
        } else if (this.aiMove === -10) {
          this.turn = '';
          this.uiService.showSnackBar('Player Won!', null, 10000);
        } else {
          this.turn = 'O';
        }
      }
    }
  }
}
