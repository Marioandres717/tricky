import { Component, OnInit } from '@angular/core';
import {AiService} from '../../game/ai.service';

@Component({
  selector: 'app-ai-board',
  templateUrl: './ai-board.component.html',
  styleUrls: ['./ai-board.component.css']
})
export class AiBoardComponent implements OnInit {
  blocks: string[];
  playerSymbol = 'X';
  aiMove: number;
  constructor(private aiService: AiService) { }

  ngOnInit() {
    this.blocks = this.aiService.state;
    console.log(this.blocks);
  }

  onPlayerClick(position: number) {
    this.blocks[position] = this.playerSymbol;
    this.aiService.state = this.blocks;
    this.aiService.aisign = 'O';
    this.aiService.humansign = 'X';
    this.aiMove = this.aiService.getMove();
    console.log(this.aiMove);
    this.blocks[this.aiMove] = 'O';
  }

}
