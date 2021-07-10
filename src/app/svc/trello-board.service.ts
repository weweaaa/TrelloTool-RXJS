import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';
import { Cards } from '../models/cards';
import { Checklist } from '../models/check-lists';
import { Label } from '../models/label';
import { Lists } from '../models/lists';

@Injectable({
  providedIn: 'root'
})
export class TrelloBoardService {

  trelloUrl = 'https://api.trello.com/1/';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {

  }

  getBoard(boardId: string) {
    return this.http.get(`${this.trelloUrl}boards/${boardId}?key=${env.key}&token=${env.token}`, this.httpOptions);
  }

  // --------------------------------------------------------------------------------------
  // 泳道中 的卡片清單
  // --------------------------------------------------------------------------------------
  /**
   * 查詢：取得泳道清單
   * 補充：https://api.trello.com/1/boards/${boardId} 這種的 ID 為 URL 上的類似這樣的 "oA2raDa2" ID 值
   * 補充：https://api.trello.com/1/lists?boards=${boardId} 這種的 ID 此 Board 在 trello 背後系統中定義類似這樣的 "60e2dcf564552b2b9d359cd1" ID 值
   */
  getList(boardId: string): Observable<Lists[]> {
    return this.http.get<Lists[]>(`${this.trelloUrl}boards/${boardId}/lists?key=${env.key}&token=${env.token}`, this.httpOptions);
  }

  setList(boardId: string, name: string): Observable<Lists> {
    return this.http.post<Lists>(`${this.trelloUrl}boards/${boardId}/lists?key=${env.key}&token=${env.token}&name=${name}`, this.httpOptions);
  }


  // --------------------------------------------------------------------------------------
  // 泳道中 的卡片清單
  // --------------------------------------------------------------------------------------
  /**
   * 查詢：取得泳道清單中的所有卡片
   */
  getListCard(listsId: string): Observable<Cards[]> {
    return this.http.get<Cards[]>(`${this.trelloUrl}lists/${listsId}/cards?key=${env.key}&token=${env.token}`, this.httpOptions);
  }

  setListCard(listsId: string, name: string, idLabels?: string[]): Observable<Cards> {

    let idLabelsStr = '';
    if (idLabels && idLabels.length > 0) {
      idLabelsStr = idLabels.join(',');
    }

    return this.http.post<Cards>(`${this.trelloUrl}lists/${listsId}/cards?key=${env.key}&token=${env.token}&name=${name}&idLabels=${idLabels}`, this.httpOptions);
  }


  // --------------------------------------------------------------------------------------
  // 看板中 的標籤
  // --------------------------------------------------------------------------------------
  // 預設："green", "yellow", "orange", "red", "purple", "blue"
  // 可使用的值：yellow, purple, blue, red, green, orange, black, sky, pink, lime
  getLabels(boardId: string): Observable<Label[]> {
    return this.http.get<Label[]>(`${this.trelloUrl}boards/${boardId}/labels?key=${env.key}&token=${env.token}`, this.httpOptions);
  }

  setLabel(boardId: string, name: string, color?: string): Observable<Label> {

    let colorStr = '';
    if (color) {
      colorStr = `&color=${color}`
    } else {
      // null 不給值，表示灰色
    }

    return this.http.post<Label>(`${this.trelloUrl}boards/${boardId}/labels?key=${env.key}&token=${env.token}&name=${name}${colorStr}`, this.httpOptions);
  }

  putLabel(labelId: string, name: string, color?: string): Observable<any> {

    let colorStr = '';
    if (color) {
      colorStr = `&color=${color}`
    } else {
      // null 不給值，表示灰色
    }

    return this.http.put<any>(`${this.trelloUrl}labels/${labelId}?key=${env.key}&token=${env.token}&name=${name}${colorStr}`, this.httpOptions);
  }



  // --------------------------------------------------------------------------------------
  // 代辦事項中 清單
  // --------------------------------------------------------------------------------------
  /**
   * 查詢：取得卡片中的代辦事項清單
   */
  getCardCheckItem(cardId: string): Observable<Checklist[]> {
    return this.http.get<Checklist[]>(`${this.trelloUrl}cards/${cardId}/checklists?key=${env.key}&token=${env.token}`, this.httpOptions);
  }

  setCardCheckItem(cardId: string, name: string): Observable<Checklist> {
    return this.http.post<Checklist>(`${this.trelloUrl}cards/${cardId}/checklists?key=${env.key}&token=${env.token}&name=${name}`, this.httpOptions);
  }


  // --------------------------------------------------------------------------------------
  // 代辦事項中 的列表
  // --------------------------------------------------------------------------------------
  /**
   * 查詢：取得卡片中的代辦事項中的列表
   */
  getCardCheckItemCheckList(checkItemId: string): Observable<Checklist> {
    return this.http.get<Checklist>(`${this.trelloUrl}checklists/${checkItemId}?key=${env.key}&token=${env.token}`, this.httpOptions);
  }

  /**
   * 新增：卡片中的代辦事項中的列表
   */
  setCardCheckItemCheckList(checkItemId: string, name: string): Observable<any> {
    return this.http.post<any>(`${this.trelloUrl}checklists/${checkItemId}/checkItems?key=${env.key}&token=${env.token}&name=${name}`, this.httpOptions);
  }
}
