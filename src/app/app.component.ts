import { Component } from '@angular/core';
import { TrelloBoardService } from './svc/trello-board.service';
import { environment as env } from 'src/environments/environment';
import { Dictionary } from './models/dictionary';
import { of, pipe } from 'rxjs';
import { concatMap, delay, map, retry, tap } from 'rxjs/operators';
import { Label } from './models/label';
import { Lists } from './models/lists';
import { Checklist } from './models/check-lists';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  checkInit = true;
  boardIdStr = env.boardId;

  tagsDic = new Dictionary;
  listsDic = new Dictionary;
  KPIDic = new Dictionary;
  caseTypesDic = new Dictionary;
  CaseCheckList1_Dic = new Dictionary;
  CaseCheckList2_Dic = new Dictionary;

  constructor(private boardSvc: TrelloBoardService) {
    if (!env.key || !env.token) {
      this.checkInit = false;
      alert("[*] 請記得到 https://trello.com/app-key/ 上取得 key 及 Token")
    }

    if(!env.boardId){
      this.checkInit = false;
      alert("[*] 請記得開啟 Trello 看板網址，複製網址上的 ID。\n  - 例如：'https://trello.com/b/oA2raDa2/Test'\n  - 則 ID 就是 【oA2raDa2】")
    }
  }

  /** 因為每個呼叫 API 後建立的 標籤、泳道、卡片、待辦清單 都會有其對應的 ID，
   *  使用這個 ID，接著才能夠進行下一層級呼叫 API 建立的流程 */
  RunCreateTrelloBoardData() {
    let obs$ = of(null);

    // 建立標籤
    env.tags.map(label => pipe(
      delay(3000),
      concatMap(() => this.boardSvc.setLabel(this.boardIdStr, label).pipe(retry(3))),
      tap((req: Label) => req && (this.tagsDic[req.name] = req.id))
    )).forEach(pipeFunc => obs$ = obs$.pipe(pipeFunc));

    // 建立泳道
    env.lists.reverse().map(list => pipe(
      delay(3000),
      concatMap(() => this.boardSvc.setList(this.boardIdStr, list)),
      tap((req: Lists) => req && (this.listsDic[req.name] = req.id))
    )).forEach(pipeFunc => obs$ = obs$.pipe(pipeFunc));

    // 建立所有卡片
    [
      [env.KPI, this.KPIDic],
      [env.caseTypes, this.caseTypesDic],
      [env.CaseCheckList1, this.CaseCheckList1_Dic],
      [env.CaseCheckList2, this.CaseCheckList2_Dic],
    ].forEach(([list, listDic]: [string[], Dictionary]) => {
      list.map(name => {
        const hascheck = env.caseTypes.includes(name);
        const idLables = hascheck ? [this.getLabelID(name)] : null;

        // 產生 Observable 資料流
        return pipe(
          delay(2500),
          map(() => this.listsDic['待辦項目'] as string), // 在此 pipe 資料流中，產生資料後往下傳遞
          concatMap(id => this.boardSvc.setListCard(id, name, idLables).pipe(retry(3))),  // 合併輸出資料流
          tap(req => req && (listDic[req.name] = { id: req.id, shortUrl: req.shortUrl, shortLink: req.shortLink })) // 另外開資料流來做事情
        );

        // 將 map 輸出的 pipe 資料流，統一使用 obs$ 串接起來
      }).forEach(pipeFunc => obs$ = obs$.pipe(pipeFunc));
    });

    // 建立卡片中的待辦清單
    [
      ['1. Test', this.KPIDic, 'Test 待辦項目', env.caseTypes, this.caseTypesDic],
      ['Case1', this.caseTypesDic, 'CaseCheckList1', env.CaseCheckList1, this.CaseCheckList1_Dic],
      ['Case1', this.caseTypesDic, 'CaseCheckList2', env.CaseCheckList2, this.CaseCheckList2_Dic],
    ].forEach(([cardName, listDic, CKName, cardList, cardDic]: [string, Dictionary, string, string[], Dictionary]) => {

      obs$ = obs$.pipe(
        delay(1000),
        concatMap(() => this.boardSvc.setCardCheckItem(listDic[cardName]['id'], CKName).pipe(retry(3)))
      );

      // 此段 pipe 承接到的資料流為從 setCardCheckItem 結束後帶過來的資料流
      cardList.map(name =>  pipe(
        delay(2500),

        // 在這裡 req 結果為 setCardCheckItem 訂閱後取得的值
        // 要特別注意的是 .pipe(map(() => req)) 此段的目的為，確保 cardList.map 每次迴圈跑的時候 concatMap 中的 req 皆為 setCardCheckItem 帶入的資料流
        concatMap((req: Checklist) => this.boardSvc.setCardCheckItemCheckList(req.id, cardDic[name]['shortUrl']).pipe(map(() => req))),
      )).forEach(pipeFunc => obs$ = obs$.pipe(pipeFunc));
    });

    obs$.subscribe();
  }

  getLabelID(naem: string): string {
    if (naem === 'Case1') { return this.tagsDic['LabelTest_1'] as string; }
    if (naem === 'Case2') { return this.tagsDic['LabelTest_2'] as string; }
  }
}
