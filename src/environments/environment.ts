// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // key & Token 須從 trello 的 https://trello.com/app-key/ 上取得
  key: '',
  token: '',

  /** Board 網址使用 */
  boardId: '',


  tags: ['LabelTest_1', 'LabelTest_2'],

  lists: ['年度計畫', '待辦項目', '進行中', '待修正', '待驗證', '已完成'],

  KPI: [
    '1. Test',
    '2. Test',
    '3. Test',
    '4. Test',
    '5. Test',
    '6. Test',
    '7. Test',
    '8. Test'
  ],

  caseTypes: [
    'Case1',
    'Case2',
  ],

  // 待辦事項
  CaseCheckList1: ['CK_1', 'CK_2'],
  CaseCheckList2: ['CK_1', 'CK_2', 'CK_3'],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
