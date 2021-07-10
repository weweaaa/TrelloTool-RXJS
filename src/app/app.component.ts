import { Component } from '@angular/core';
import { TrelloBoardService } from './svc/trello-board.service';
import { environment as env } from 'src/environments/environment';
import { Dictionary } from './models/dictionary';
import { of } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';
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
  /** 建立 案件類型 標籤 */
  addLabel() {
    env.tags.forEach((label: string) => {
      const $addLabel = this.boardSvc.setLabel(this.boardIdStr, label)
      $addLabel.subscribe(req => {
        console.log('%c 🌽 addLabel: ', 'font-size:20px;background-color: #EA7E5C;color:#fff;', req);
        if (req) {
          this.tagsDic[req.name] = req.id;
        }
      });
    });
  }

  /** 建立 泳道 */
  addList() {
    env.lists.reverse().forEach((list: string) => {
      const $addList = this.boardSvc.setList(this.boardIdStr, list)
      $addList.subscribe(req => {
        console.log('%c 🥖 addList: ', 'font-size:20px;background-color: #2EAFB0;color:#fff;', req);
        if (req) {
          this.listsDic[req.name] = req.id;
        }
      });
    });
  }

  /** 建立指定泳道下的 KPI 卡片清單 */
  addKPICard() {
    if (!this.listsDic['年度計畫']) {
      console.error('%c 🦐 this.listsDic[年度計畫] NULL: ', 'font-size:20px;background-color: #2EAFB0;color:#fff;', this.listsDic['年度計畫']);
      return;
    }

    const WaitWorkListsId = this.listsDic['年度計畫'];

    if (typeof (WaitWorkListsId) !== 'string') {
      console.log('%c 🍇 typeof(WaitWorkListsId) !== "string": ', 'font-size:20px;background-color: #33A5FF;color:#fff;', WaitWorkListsId);
      return;
    }

    this.addCardRun(WaitWorkListsId, env.KPI, this.KPIDic);
  }

  /** 建立 所有案件類型卡片清單 */
  addCaseCard() {
    if (!this.listsDic['待辦項目']) {
      console.error('%c 🦐 this.listsDic[待辦項目] NULL: ', 'font-size:20px;background-color: #2EAFB0;color:#fff;', this.listsDic['待辦項目']);
      return;
    }

    const WaitWorkListsId = this.listsDic['待辦項目'];

    if (typeof (WaitWorkListsId) !== 'string') {
      console.log('%c 🍇 typeof(WaitWorkListsId) !== "string": ', 'font-size:20px;background-color: #33A5FF;color:#fff;', WaitWorkListsId);
      return;
    }

    this.addCardRun(WaitWorkListsId, env.caseTypes, this.caseTypesDic);
  }

  /** 建立 所有案件 所有待辦項目 的卡片清單 */
  addWaitWorkCard() {
    if (!this.listsDic['待辦項目']) {
      console.error('%c 🦐 this.listsDic[待辦項目] NULL: ', 'font-size:20px;background-color: #2EAFB0;color:#fff;', this.listsDic['待辦項目']);
      return;
    }

    const WaitWorkListsId = this.listsDic['待辦項目'];

    if (typeof (WaitWorkListsId) !== 'string') {
      console.log('%c 🍇 typeof(WaitWorkListsId) !== "string": ', 'font-size:20px;background-color: #33A5FF;color:#fff;', WaitWorkListsId);
      return;
    }


    this.addCardRun(WaitWorkListsId, env.CaseCheckList1, this.CaseCheckList1_Dic);
    this.addCardRun(WaitWorkListsId, env.CaseCheckList2, this.CaseCheckList2_Dic);
  };

  /** 將 Test 待辦項目加入到卡片中 */
  addCaseTypeCK() {
    this.addCheckList('1. Test', this.KPIDic, 'Test 待辦項目', env.caseTypes, this.caseTypesDic);
  }

  /** 將 CaseCheckList1、CaseCheckList2  待辦項目加入到 Case1 卡片中 */
  addCaseCK1() {
    this.addCheckList('Case1', this.caseTypesDic, 'CaseCheckList1', env.CaseCheckList1, this.CaseCheckList1_Dic);
    this.addCheckList('Case1', this.caseTypesDic, 'CaseCheckList2', env.CaseCheckList2, this.CaseCheckList2_Dic);
  }


  /** 將 待辦項目加入到卡片中 */
  addCheckList(SourceCardName: string, SourceCardDic: Dictionary, ckItemName: string, ck: string[], ckdic: Dictionary) {
    if (typeof (SourceCardDic[SourceCardName]) !== 'object') {
      console.log('%c 🍥 typeof (caseDic[SourceCardName]) !== object: ', 'font-size:20px;background-color: #42b983;color:#fff;', SourceCardDic[SourceCardName]);
      return;
    }

    const cardId = SourceCardDic[SourceCardName]['id'] as string;
    const $addCKItem = this.boardSvc.setCardCheckItem(cardId, ckItemName);

    $addCKItem.subscribe(itemReq => {
      console.log('%c 🍋 addCKItem: ', 'font-size:20px;background-color: #42b983;color:#fff;', itemReq);

      ck.forEach((name: string) => {
        if (typeof (ckdic[name]) !== 'object') {
          console.log('%c 🍥 typeof (ckdic[name]) !== object: ', 'font-size:20px;background-color: #42b983;color:#fff;', ckdic[name]);
          return;
        }


        const $addCKLink = this.boardSvc.setCardCheckItemCheckList(itemReq.id, ckdic[name]['shortUrl']);
        $addCKLink.subscribe(addCKLinkReq => {
          console.log('%c 🍌 addCKLinkReq: ', 'font-size:20px;background-color: #6EC1C2;color:#fff;', addCKLinkReq);
        });
      });
    });
  }

  /** === 將建立卡片的清單抽離 === */
  addCardRun(WaitWorkListsId: string, list: string[], dic: Dictionary) {
    list.forEach((name: string) => {
      const hascheck = env.caseTypes.includes(name)
      const $addCard = this.boardSvc.setListCard(WaitWorkListsId, name, hascheck ? [this.getLabelID(name)] : null)
      of(null).pipe(delay(10 * 1000), concatMap(() => $addCard)).subscribe(req => {
        console.log('%c 🍌 addCard: ', 'font-size:20px;background-color: #6EC1C2;color:#fff;', req);
        if (req) {
          dic[req.name] = { id: req.id, shortUrl: req.shortUrl, shortLink: req.shortLink };
        }
        console.log('%c =============================================: ', 'font-size:20px;background-color: #E41A6A;color:#fff;');
      });
    });
  }

  getLabelID(naem: string): string {
    if (naem === 'Case1') { return this.tagsDic['LabelTest_1'] as string; }
    if (naem === 'Case2') { return this.tagsDic['LabelTest_2'] as string; }
  }
}
