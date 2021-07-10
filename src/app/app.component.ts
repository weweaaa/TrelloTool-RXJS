import { Component } from '@angular/core';
import { TrelloBoardService } from './svc/trello-board.service';
import { environment as env } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private boardService: TrelloBoardService) {
    if(!env.key || !env.token){
      alert("[*] 請記得到 https://trello.com/app-key/ 上取得 key 及 Token")
    }
  }

  getBoard() {
    this.boardService.getBoard(env.boardId).subscribe(rep => {
      console.log('%c 🍧 rep: ', 'font-size:20px;background-color: #93C0A4;color:#fff;', rep);
    })
  }

  // ------------------------------
  // Label
  // ------------------------------
  getLabel() {
    this.boardService.getLabels(env.boardId).subscribe(rep => {
      if (rep) {
        console.log('%c 🍧 getListCard: ', 'font-size:20px;background-color: #93C0A4;color:#fff;', rep);
      }
    });
  }

  setLabel() {
    this.boardService.setLabel(env.boardId, 'IND').subscribe(rep => {
      if (rep) {
        console.log('%c 🍧 getListCard: ', 'font-size:20px;background-color: #93C0A4;color:#fff;', rep);
      }
    });
  }

  putLabel(labelId: string) {
    // 60e46f20ebff3d4c6d9cd24b
    this.boardService.putLabel(labelId, 'XDXDXDXD', 'red').subscribe(rep => {
      if (rep) {
        console.log('%c 🍧 getListCard: ', 'font-size:20px;background-color: #93C0A4;color:#fff;', rep);
      }
    });
  }



  // ------------------------------
  // List
  // ------------------------------
  getList() {
    this.boardService.getList(env.boardId).subscribe(rep => {

      if (rep) {
        console.log('%c 🍧 rep: ', 'font-size:20px;background-color: #93C0A4;color:#fff;', rep.map((val) => {
          this.getListCard(val.id);
          return val.id;
        }));
      }
    });
  }

  setList() {
    this.boardService.setList(env.boardId, '測試創建泳道').subscribe(rep => {

      if (rep) {
        console.log('%c 🍧 rep: ', 'font-size:20px;background-color: #93C0A4;color:#fff;', rep);
      }
    });
  }


  // ------------------------------
  // List
  // ------------------------------
  getListCard(id: string) {
    // 60e30b05e274972cdb88f39f
    this.boardService.getListCard(id).subscribe(rep => {
      if (rep) {
        console.log('%c 🍧 getListCard: ', 'font-size:20px;background-color: #93C0A4;color:#fff;', rep);
      }
    });
  }

  setListCard(id: string) {
    // 60e30b05e274972cdb88f39f
    this.boardService.setListCard('60e30b05e274972cdb88f39f', '測試創建卡片').subscribe(rep => {
      if (rep) {
        console.log('%c 🍧 getListCard: ', 'font-size:20px;background-color: #93C0A4;color:#fff;', rep);
      }
    });
  }



  // ------------------------------
  // CheckItemCheckList
  // ------------------------------
  getCardCheckItem(cardId: string) {
    // 60e30d012c83ac7d375af266
    this.boardService.getCardCheckItem(cardId).subscribe(rep => {
      if (rep) {
        console.log('%c 🍧 getListCard: ', 'font-size:20px;background-color: #93C0A4;color:#fff;', rep);
      }
    });
  }

  setCardCheckItem(cardId: string) {
    // 60e30d012c83ac7d375af266
    this.boardService.setCardCheckItem('60e30d012c83ac7d375af266', '測試創建待辦清單').subscribe(rep => {
      if (rep) {
        console.log('%c 🍧 getListCard: ', 'font-size:20px;background-color: #93C0A4;color:#fff;', rep);
      }
    });
  }


  // ------------------------------
  // CheckItemCheckList
  // ------------------------------
  getCardCheckItemCheckList(checkItemId: string) {
    // 60e30d283edb1237a9b78b7c
    this.boardService.getCardCheckItemCheckList('60e30d283edb1237a9b78b7c').subscribe(rep => {
      if (rep) {
        console.log('%c 🍧 getListCard: ', 'font-size:20px;background-color: #93C0A4;color:#fff;', rep);
      }
    });
  }

  setCardCheckItemCheckList(checkItemId: string) {
    // 60e30d283edb1237a9b78b7c
    // https://trello.com/c/cIGKbxsn
    this.boardService.setCardCheckItemCheckList('60e30d283edb1237a9b78b7c', 'https://trello.com/c/cIGKbxsn').subscribe(rep => {
      if (rep) {
        console.log('%c 🥕 rep: ', 'font-size:20px;background-color: #FFDD4D;color:#fff;', rep);
      }
    });
  }
}
